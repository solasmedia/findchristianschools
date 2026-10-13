// One-time job: IPEDS college facts import, ported from
// server/scripts/importIpeds.ts to run inside the server process.
// Downloads the IPEDS 2023-24 bulk files from NCES at runtime, matches
// colleges (exact UnitID join, then the script's conservative fuzzy
// fallback), and applies HIGH-confidence matches only, writing the fact
// columns on `colleges` (tuition, graduationRate, highestDegreeOffered,
// ipedsDataYear, enrollment when IPEDS has one) — the same write the
// script's --apply performs. Idempotent: re-running rewrites the same
// values from the same source files.
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { colleges } from "../../drizzle/schema";
import { downloadToBuffer, extractZipEntry } from "./unzipBuffer";

const LOG = "[OneTimeImports]";
const DATA_YEAR = "2023-24";
const IPEDS_BASE = "https://nces.ed.gov/ipeds/datacenter/data";
const IPEDS_FILES: Record<string, { zip: string; csv: string }> = {
  hd: { zip: "HD2023.zip", csv: "HD2023.csv" },
  charges: { zip: "IC2023_AY.zip", csv: "ic2023_ay.csv" },
  enroll: { zip: "EF2023A.zip", csv: "ef2023a.csv" },
  gradrate: { zip: "DRVGR2023.zip", csv: "drvgr2023.csv" },
};

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
  if (s === "" || s === "." || s === "-1" || s === "-2" || s === "-3" || s === "-4")
    return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

// ---------------------------------------------------------------- ipeds

interface IpedsFacts {
  unitId: string;
  ipedsName: string;
  city: string;
  stateCode: string;
  tuition: number | null;
  enrollment: number | null;
  graduationRate: number | null;
  highestDegreeOffered: string | null;
}

async function downloadCsv(kind: keyof typeof IPEDS_FILES): Promise<string> {
  const { zip, csv } = IPEDS_FILES[kind];
  const url = `${IPEDS_BASE}/${zip}`;
  console.log(`${LOG} ipeds: downloading ${url}`);
  const buf = await downloadToBuffer(url);
  const entry = extractZipEntry(buf, (n) => n.toLowerCase() === csv.toLowerCase());
  console.log(
    `${LOG} ipeds: extracted ${entry.name} (${entry.data.length} bytes)`,
  );
  return entry.data.toString("utf-8");
}

export async function loadIpeds(): Promise<Map<string, IpedsFacts>> {
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

  for (const r of parseCsv(await downloadCsv("hd"))) {
    const f = get(r.UNITID);
    f.ipedsName = r.INSTNM ?? "";
    f.city = r.CITY ?? "";
    f.stateCode = r.STABBR ?? "";
    f.highestDegreeOffered = HLOFFER_LABELS[(r.HLOFFER ?? "").trim()] ?? null;
  }
  for (const r of parseCsv(await downloadCsv("charges"))) {
    const f = get(r.UNITID);
    f.tuition = toNum(r.CHG2AY3) ?? toNum(r.CHG1AY3) ?? toNum(r.CHG3AY3);
  }
  for (const r of parseCsv(await downloadCsv("enroll"))) {
    if ((r.EFALEVEL ?? "") !== "1") continue;
    get(r.UNITID).enrollment = toNum(r.EFTOTLT);
  }
  for (const r of parseCsv(await downloadCsv("gradrate"))) {
    const rate = toNum(r.GRRTTOT);
    get(r.UNITID).graduationRate =
      rate !== null && rate >= 0 && rate <= 100 ? rate : null;
  }
  console.log(`${LOG} ipeds: ${facts.size} IPEDS institutions loaded`);
  return facts;
}

// ---------------------------------------------------------------- match

interface CollegeRow {
  id: number;
  name: string;
  city: string;
  stateCode: string;
  ipedsUnitId?: string | null;
}

interface MatchResult {
  collegeId: number;
  confidence: "high" | "review";
  facts: {
    tuition: number | null;
    enrollment: number | null;
    graduationRate: number | null;
    highestDegreeOffered: string | null;
  };
}

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
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
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

const normCity = (c: string) =>
  c
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function matchColleges(
  rows: CollegeRow[],
  ipeds: Map<string, IpedsFacts>,
): { matches: MatchResult[]; unmatched: number } {
  const matches: MatchResult[] = [];
  const fuzzyClaimed = new Set<string>();
  const remaining: CollegeRow[] = [];

  for (const c of rows) {
    const uid = c.ipedsUnitId ? String(c.ipedsUnitId).trim() : "";
    const f = uid ? ipeds.get(uid) : undefined;
    if (f) {
      const score = nameSimilarity(c.name, f.ipedsName);
      matches.push({
        collegeId: c.id,
        confidence: score < 0.4 ? "review" : "high",
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
    matches.push({
      collegeId: c.id,
      confidence: sameCity && score >= 0.9 ? "high" : "review",
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
  return { matches, unmatched: remaining.length - matchedCollegeIds.size };
}

// ---------------------------------------------------------------- job

export async function runIpedsJob(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("database unavailable (getDb returned null)");
  const ipeds = await loadIpeds();
  const rows = await db
    .select({
      id: colleges.id,
      name: colleges.name,
      city: colleges.city,
      stateCode: colleges.stateCode,
      ipedsUnitId: colleges.ipedsUnitId,
    })
    .from(colleges);
  console.log(`${LOG} ipeds: ${rows.length} colleges in directory`);
  const { matches, unmatched } = matchColleges(rows, ipeds);
  const high = matches.filter((m) => m.confidence === "high");
  const review = matches.length - high.length;
  console.log(
    `${LOG} ipeds: matched ${matches.length} (high ${high.length}, review ${review} skipped), unmatched ${unmatched}`,
  );
  let updated = 0;
  for (const m of high) {
    const set: Record<string, unknown> = {
      tuition: m.facts.tuition,
      graduationRate:
        m.facts.graduationRate !== null ? String(m.facts.graduationRate) : null,
      highestDegreeOffered: m.facts.highestDegreeOffered,
      ipedsDataYear: DATA_YEAR,
      importDate: new Date(),
    };
    // Mirrors the script's COALESCE(?, enrollment): only overwrite the
    // directory enrollment when IPEDS reports one.
    if (m.facts.enrollment !== null) set.enrollment = m.facts.enrollment;
    await db.update(colleges).set(set).where(eq(colleges.id, m.collegeId));
    updated++;
  }
  console.log(`${LOG} ipeds: done (${updated} college rows updated)`);
}
