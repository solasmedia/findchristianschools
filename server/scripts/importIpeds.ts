#!/usr/bin/env tsx
/**
 * Import IPEDS college facts (tuition, fall enrollment, graduation rate,
 * highest degree offered) and match them to the `colleges` table.
 *
 * Data source: IPEDS bulk downloads from NCES (keyless, public federal data).
 * 2023-24 collection:
 *   HD2023.zip     directory info (INSTNM, CITY, STABBR, HLOFFER)
 *   IC2023_AY.zip  academic-year student charges — CHG2AY3 is the published
 *                  in-state tuition & fees; CHG1AY3 (in-district) and
 *                  CHG3AY3 (out-of-state) are fallbacks, in that order
 *   EF2023A.zip    fall enrollment — row EFALEVEL=1 (all students, total),
 *                  EFTOTLT is the total fall headcount
 *   DRVGR2023.zip  derived graduation rates — GRRTTOT is the overall rate
 *                  (% of the cohort completing within 150% of normal time)
 *
 * Matching (conservative — a wrong fact on a profile is worse than no fact):
 *   1. Exact join on the stored colleges.ipedsUnitId  -> confidence "high"
 *      (flagged "review" if the directory name and the IPEDS name barely
 *      resemble each other, which can indicate a merger/closure).
 *   2. Fuzzy fallback for rows without a usable UnitID: same state, equal
 *      normalized city, and name similarity >= 0.90 -> "high";
 *      same state and similarity >= 0.78 -> "review" (never auto-applied);
 *      anything else -> unmatched. One-to-one: an IPEDS institution can be
 *      fuzzy-claimed by at most one college (highest score wins).
 *
 * Usage:
 *   Audit against the live public API (read-only, no DB access):
 *     npx tsx server/scripts/importIpeds.ts --audit
 *   Audit against a local colleges JSON export ([{id,name,city,state,
 *   stateCode,ipedsUnitId}]):
 *     npx tsx server/scripts/importIpeds.ts --audit --colleges-json f.json
 *   Simulate fuzzy-only matching (ignores stored UnitIDs):
 *     ... --audit --ignore-unitids
 *   Apply high-confidence matches to the database (requires DATABASE_URL):
 *     npx tsx server/scripts/importIpeds.ts --apply --file ipeds-matches.json
 *
 * Requires the `unzip` binary on PATH for the IPEDS .zip downloads.
 * Env: IPEDS_DIR (download cache, default /tmp/ipeds-facts),
 *      FCS_BASE_URL (default https://www.findchristianschools.com).
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------- types

interface CollegeRow {
  id: number;
  name: string;
  slug?: string;
  city: string;
  state: string;
  stateCode: string;
  ipedsUnitId?: string | null;
}

interface IpedsFacts {
  unitId: string;
  ipedsName: string;
  city: string;
  stateCode: string;
  tuition: number | null; // published tuition & fees / yr (undergrad)
  enrollment: number | null; // fall headcount, all students
  graduationRate: number | null; // percent, 0-100
  highestDegreeOffered: string | null;
}

interface MatchResult {
  collegeId: number;
  collegeName: string;
  city: string;
  stateCode: string;
  unitId: string;
  ipedsName: string;
  method: "unitid" | "fuzzy";
  score: number; // 0-1 name similarity
  confidence: "high" | "review";
  reviewReason?: string;
  facts: Omit<IpedsFacts, "unitId" | "ipedsName" | "city" | "stateCode">;
}

const DATA_YEAR = "2023-24";
const IPEDS_FILES: Record<string, { zip: string; csv: string }> = {
  hd: { zip: "HD2023.zip", csv: "HD2023.csv" },
  charges: { zip: "IC2023_AY.zip", csv: "ic2023_ay.csv" },
  enroll: { zip: "EF2023A.zip", csv: "ef2023a.csv" },
  gradrate: { zip: "DRVGR2023.zip", csv: "drvgr2023.csv" },
};
const IPEDS_BASE = "https://nces.ed.gov/ipeds/datacenter/data";

// HLOFFER uses the IPEDS award-level codes. Doctoral variants (9/10/11)
// collapse to one display label.
const HLOFFER_LABELS: Record<string, string> = {
  "1": "Certificate",
  "2": "Certificate",
  "3": "Associate degree",
  "4": "Certificate",
  "5": "Bachelor's degree",
  "6": "Postbaccalaureate certificate",
  "7": "Master's degree",
  "8": "Post-master's certificate",
  "9": "Doctoral degree",
  "10": "Doctoral degree",
  "11": "Doctoral degree",
};

// ---------------------------------------------------------------- csv

/** Minimal RFC-4180 CSV parser (quotes, embedded commas/newlines). */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => (obj[h] = (r[idx] ?? "").trim()));
    return obj;
  });
}

function toNum(v: string | undefined): number | null {
  if (v === undefined) return null;
  const s = v.trim();
  if (s === "" || s === "." || s === "-1" || s === "-2" || s === "-3" || s === "-4") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

// ---------------------------------------------------------------- ipeds

async function ensureIpedsFile(kind: keyof typeof IPEDS_FILES, dir: string): Promise<string> {
  const { zip, csv } = IPEDS_FILES[kind];
  const csvPath = join(dir, csv);
  if (existsSync(csvPath)) return csvPath;
  mkdirSync(dir, { recursive: true });
  const zipPath = join(dir, zip);
  if (!existsSync(zipPath)) {
    const url = `${IPEDS_BASE}/${zip}`;
    console.log(`  downloading ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`IPEDS download failed: ${url} -> HTTP ${res.status}`);
    writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));
  }
  execFileSync("unzip", ["-o", "-q", zipPath, "-d", dir], { stdio: "inherit" });
  // IPEDS zips are not consistent about csv case; resolve case-insensitively.
  if (!existsSync(csvPath)) {
    const { readdirSync } = await import("node:fs");
    const found = readdirSync(dir).find((f) => f.toLowerCase() === csv.toLowerCase());
    if (!found) throw new Error(`CSV ${csv} not found after extracting ${zip}`);
    return join(dir, found);
  }
  return csvPath;
}

async function loadIpeds(dir: string): Promise<Map<string, IpedsFacts>> {
  const facts = new Map<string, IpedsFacts>();
  const get = (uid: string): IpedsFacts => {
    let f = facts.get(uid);
    if (!f) {
      f = {
        unitId: uid,
        ipedsName: "",
        city: "",
        stateCode: "",
        tuition: null,
        enrollment: null,
        graduationRate: null,
        highestDegreeOffered: null,
      };
      facts.set(uid, f);
    }
    return f;
  };

  console.log("Loading IPEDS HD2023 (directory)...");
  for (const r of parseCsv(readFileSync(await ensureIpedsFile("hd", dir), "utf-8"))) {
    const f = get(r.UNITID);
    f.ipedsName = r.INSTNM ?? "";
    f.city = r.CITY ?? "";
    f.stateCode = r.STABBR ?? "";
    f.highestDegreeOffered = HLOFFER_LABELS[(r.HLOFFER ?? "").trim()] ?? null;
  }

  console.log("Loading IPEDS IC2023_AY (published tuition & fees)...");
  for (const r of parseCsv(readFileSync(await ensureIpedsFile("charges", dir), "utf-8"))) {
    const f = get(r.UNITID);
    f.tuition = toNum(r.CHG2AY3) ?? toNum(r.CHG1AY3) ?? toNum(r.CHG3AY3);
  }

  console.log("Loading IPEDS EF2023A (fall enrollment, EFALEVEL=1 total)...");
  for (const r of parseCsv(readFileSync(await ensureIpedsFile("enroll", dir), "utf-8"))) {
    if ((r.EFALEVEL ?? "") !== "1") continue;
    get(r.UNITID).enrollment = toNum(r.EFTOTLT);
  }

  console.log("Loading IPEDS DRVGR2023 (overall graduation rate)...");
  for (const r of parseCsv(readFileSync(await ensureIpedsFile("gradrate", dir), "utf-8"))) {
    const rate = toNum(r.GRRTTOT);
    get(r.UNITID).graduationRate = rate !== null && rate >= 0 && rate <= 100 ? rate : null;
  }

  console.log(`  ${facts.size} IPEDS institutions loaded`);
  return facts;
}

// ---------------------------------------------------------------- match

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^the /, "");
}

function tokenDice(a: string, b: string): number {
  const ta = new Set(a.split(" ").filter(Boolean));
  const tb = new Set(b.split(" ").filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of Array.from(ta)) if (tb.has(t)) inter++;
  return (2 * inter) / (ta.size + tb.size);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function nameSimilarity(a: string, b: string): number {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (na === nb) return 1;
  const dice = tokenDice(na, nb);
  const levRatio = 1 - levenshtein(na, nb) / Math.max(na.length, nb.length);
  return Math.max(dice, 0.6 * dice + 0.4 * levRatio);
}

const normCity = (c: string) => c.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();

function matchColleges(
  colleges: CollegeRow[],
  ipeds: Map<string, IpedsFacts>,
  ignoreUnitIds: boolean,
): { matches: MatchResult[]; unmatched: CollegeRow[] } {
  const matches: MatchResult[] = [];
  const unmatched: CollegeRow[] = [];
  const fuzzyClaimed = new Set<string>();

  // Pass 1: exact UnitID join.
  const remaining: CollegeRow[] = [];
  for (const c of colleges) {
    const uid = !ignoreUnitIds && c.ipedsUnitId ? String(c.ipedsUnitId).trim() : "";
    const f = uid ? ipeds.get(uid) : undefined;
    if (f) {
      const score = nameSimilarity(c.name, f.ipedsName);
      const review = score < 0.4;
      matches.push({
        collegeId: c.id,
        collegeName: c.name,
        city: c.city,
        stateCode: c.stateCode,
        unitId: uid,
        ipedsName: f.ipedsName,
        method: "unitid",
        score: Number(score.toFixed(3)),
        confidence: review ? "review" : "high",
        reviewReason: review
          ? `UnitID matches but names differ sharply (similarity ${score.toFixed(2)}) — possible merger/rename; verify before applying`
          : undefined,
        facts: {
          tuition: f.tuition,
          enrollment: f.enrollment,
          graduationRate: f.graduationRate,
          highestDegreeOffered: f.highestDegreeOffered,
        },
      });
      fuzzyClaimed.add(uid);
    } else {
      remaining.push(c);
    }
  }

  // Pass 2: fuzzy fallback (same state; one-to-one, best score first).
  const candidates: { c: CollegeRow; f: IpedsFacts; score: number }[] = [];
  const byState = new Map<string, IpedsFacts[]>();
  for (const f of Array.from(ipeds.values())) {
    if (fuzzyClaimed.has(f.unitId)) continue;
    const arr = byState.get(f.stateCode) ?? [];
    arr.push(f);
    byState.set(f.stateCode, arr);
  }
  for (const c of remaining) {
    for (const f of byState.get(c.stateCode) ?? []) {
      const score = nameSimilarity(c.name, f.ipedsName);
      if (score >= 0.78) candidates.push({ c, f, score });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  const matchedCollegeIds = new Set<number>();
  for (const { c, f, score } of candidates) {
    if (matchedCollegeIds.has(c.id) || fuzzyClaimed.has(f.unitId)) continue;
    const sameCity = normCity(c.city) === normCity(f.city);
    const high = sameCity && score >= 0.9;
    matches.push({
      collegeId: c.id,
      collegeName: c.name,
      city: c.city,
      stateCode: c.stateCode,
      unitId: f.unitId,
      ipedsName: f.ipedsName,
      method: "fuzzy",
      score: Number(score.toFixed(3)),
      confidence: high ? "high" : "review",
      reviewReason: high
        ? undefined
        : !sameCity
          ? `Name similarity ${score.toFixed(2)} but city differs (directory: ${c.city}; IPEDS: ${f.city})`
          : `Name similarity ${score.toFixed(2)} below the 0.90 auto-apply threshold`,
      facts: {
        tuition: f.tuition,
        enrollment: f.enrollment,
        graduationRate: f.graduationRate,
        highestDegreeOffered: f.highestDegreeOffered,
      },
    });
    matchedCollegeIds.add(c.id);
    fuzzyClaimed.add(f.unitId);
  }
  for (const c of remaining) if (!matchedCollegeIds.has(c.id)) unmatched.push(c);

  return { matches, unmatched };
}

// ---------------------------------------------------------------- colleges input

async function fetchCollegesFromApi(baseUrl: string): Promise<CollegeRow[]> {
  const rows: CollegeRow[] = [];
  for (let offset = 0; ; offset += 200) {
    const input = encodeURIComponent(JSON.stringify({ json: { limit: 200, offset } }));
    const res = await fetch(`${baseUrl}/api/trpc/colleges.search?input=${input}`);
    if (!res.ok) throw new Error(`colleges.search failed: HTTP ${res.status}`);
    const data: any = await res.json();
    const page: any[] = data?.result?.data?.json ?? [];
    rows.push(...page);
    if (page.length < 200) break;
  }
  return rows;
}

// ---------------------------------------------------------------- audit

function printAudit(
  colleges: CollegeRow[],
  matches: MatchResult[],
  unmatched: CollegeRow[],
  fuzzyOnly: boolean,
) {
  const high = matches.filter((m) => m.confidence === "high");
  const review = matches.filter((m) => m.confidence === "review");
  const byUnitid = matches.filter((m) => m.method === "unitid").length;
  const byFuzzy = matches.filter((m) => m.method === "fuzzy").length;
  const cov = (pick: (m: MatchResult) => number | string | null) =>
    matches.filter((m) => pick(m) !== null).length;

  console.log("\n================ IPEDS MATCH AUDIT ================");
  console.log(`Mode:                 ${fuzzyOnly ? "fuzzy-only simulation (UnitIDs ignored)" : "standard (UnitID join + fuzzy fallback)"}`);
  console.log(`Colleges considered:  ${colleges.length}`);
  console.log(`Matched (any):        ${matches.length}  (unitid ${byUnitid}, fuzzy ${byFuzzy})`);
  console.log(`  high-confidence:    ${high.length}`);
  console.log(`  review-needed:      ${review.length}`);
  console.log(`Unmatched:            ${unmatched.length}`);
  console.log(`Field coverage among matched:`);
  console.log(`  tuition present:      ${cov((m) => m.facts.tuition)}`);
  console.log(`  enrollment present:   ${cov((m) => m.facts.enrollment)}`);
  console.log(`  graduationRate:       ${cov((m) => m.facts.graduationRate)}`);
  console.log(`  highestDegreeOffered: ${cov((m) => m.facts.highestDegreeOffered)}`);

  const edge = [...review]
    .sort((a, b) => a.score - b.score)
    .concat([...high].sort((a, b) => a.score - b.score).slice(0, 5))
    .slice(0, 20);
  console.log(`\nEdge cases (review-needed + lowest-scoring high matches):`);
  for (const m of edge) {
    console.log(
      `  [${m.confidence}/${m.method} ${m.score.toFixed(2)}] "${m.collegeName}" (${m.city}, ${m.stateCode})` +
        ` <-> "${m.ipedsName}" (UnitID ${m.unitId})${m.reviewReason ? ` — ${m.reviewReason}` : ""}`,
    );
  }
  if (unmatched.length) {
    console.log(`\nUnmatched sample (up to 10):`);
    for (const c of unmatched.slice(0, 10)) console.log(`  "${c.name}" (${c.city}, ${c.stateCode})`);
  }
  console.log("===================================================\n");
}

// ---------------------------------------------------------------- apply

async function applyMatches(file: string) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("--apply requires DATABASE_URL (production import is a deliberate, reviewed step)");
  }
  const matches: MatchResult[] = JSON.parse(readFileSync(file, "utf-8"));
  const high = matches.filter((m) => m.confidence === "high");
  console.log(`Applying ${high.length} high-confidence matches (${matches.length - high.length} review-needed skipped)`);
  const mysql = (await import("mysql2/promise")).default;
  const conn = await mysql.createConnection(databaseUrl);
  let updated = 0;
  for (const m of high) {
    const [res]: any = await conn.execute(
      `UPDATE colleges SET tuition = ?, graduationRate = ?, highestDegreeOffered = ?,
         ipedsDataYear = ?, enrollment = COALESCE(?, enrollment), importDate = NOW()
       WHERE id = ?`,
      [
        m.facts.tuition,
        m.facts.graduationRate,
        m.facts.highestDegreeOffered,
        DATA_YEAR,
        m.facts.enrollment,
        m.collegeId,
      ],
    );
    updated += res.affectedRows ?? 0;
  }
  await conn.end();
  console.log(`Done. ${updated} college rows updated.`);
}

// ---------------------------------------------------------------- main

async function main() {
  const args = process.argv.slice(2);
  const has = (f: string) => args.includes(f);
  const val = (f: string) => {
    const i = args.indexOf(f);
    return i >= 0 ? args[i + 1] : undefined;
  };

  if (has("--apply")) {
    const file = val("--file");
    if (!file) throw new Error("--apply requires --file <matches.json>");
    await applyMatches(file);
    return;
  }
  if (!has("--audit")) {
    console.log("Usage: importIpeds.ts --audit [--colleges-json f] [--ignore-unitids] [--out f]\n       importIpeds.ts --apply --file matches.json");
    process.exit(1);
  }

  const ipedsDir = process.env.IPEDS_DIR ?? "/tmp/ipeds-facts";
  const ipeds = await loadIpeds(ipedsDir);

  let colleges: CollegeRow[];
  const jsonPath = val("--colleges-json");
  if (jsonPath) {
    colleges = JSON.parse(readFileSync(jsonPath, "utf-8"));
    console.log(`Loaded ${colleges.length} colleges from ${jsonPath}`);
  } else {
    const base = process.env.FCS_BASE_URL ?? "https://www.findchristianschools.com";
    colleges = await fetchCollegesFromApi(base);
    console.log(`Fetched ${colleges.length} colleges from ${base} public API`);
  }

  const { matches, unmatched } = matchColleges(colleges, ipeds, has("--ignore-unitids"));
  printAudit(colleges, matches, unmatched, has("--ignore-unitids"));

  const out = val("--out") ?? "ipeds-matches.json";
  writeFileSync(out, JSON.stringify(matches, null, 1));
  console.log(`Matches written to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
