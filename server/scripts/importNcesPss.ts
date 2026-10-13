/**
 * importNcesPss.ts — match FindChristianSchools directory schools to the
 * U.S. Department of Education's NCES Private School Universe Survey (PSS)
 * 2023-24 public-use file, and (only with --apply) load high-confidence
 * matches into the `school_nces_facts` side table.
 *
 * Data source (public-use, published for reuse):
 *   https://nces.ed.gov/surveys/pss/pssdata.asp
 *   File: pss2324_pu_csv.zip -> pss2324_pu.csv (22,510 schools)
 *   Codebook: pdf/codebook2023_24.pdf (all code maps below cite it)
 *
 * Matching (conservative by design — the site's rule is truth over speed):
 *   - Candidates are blocked by (state, ZIP5) and (state, normalized city).
 *   - Name similarity = 0.6 * token Jaccard + 0.4 * Ratcliff-Obershelp
 *     sequence ratio on normalized names, +0.15 (capped at 1.0) when one
 *     name's token set contains the other's (campus-suffix variants).
 *   - HIGH:    score >= 0.80 AND margin over runner-up >= 0.05 AND the PSS
 *              record is not claimed by any other directory school.
 *   - REVIEW:  score >= 0.70 but not HIGH (weak margin, duplicate claim, or
 *              sub-threshold score). Review rows are NEVER imported.
 *   - UNMATCHED: everything else. Unmatched schools get no facts panel.
 *
 * Usage:
 *   pnpm tsx server/scripts/importNcesPss.ts --pss /path/pss2324_pu.csv \
 *       [--schools-json /path/directory.json]   # audit w/o DB (else reads DB)
 *       [--audit-out /path/dir]                 # write review CSV + summary
 *       [--apply]                               # insert HIGH matches (DB)
 *
 * Default mode is a dry-run audit: it writes nothing anywhere. --apply only
 * ever writes to `school_nces_facts`; it never modifies the `schools` table.
 */
import fs from "node:fs";
import path from "node:path";
import { getDb } from "../db";
import { schools, schoolNcesFacts } from "../../drizzle/schema";

// ---------------------------------------------------------------------------
// PSS code maps (2023-24 codebook, "Created Variable" sections)
// ---------------------------------------------------------------------------

// ORIENT — School Orientation. Codes 27-29 labels per PSS codebook series;
// code 30 verified in-file: exactly the 7,386 RELIG=3 (Nonsectarian) records.
// 28 verified in-file: 345 of 568 records carry ADVENTIST/SDA in the name.
const ORIENT_LABELS: Record<number, string> = {
  1: "Roman Catholic",
  2: "African Methodist Episcopal",
  3: "Amish",
  4: "Assembly of God",
  5: "Baptist",
  6: "Brethren",
  7: "Calvinist",
  8: "Christian (no specific denomination)",
  9: "Church of Christ",
  10: "Church of God",
  11: "Church of God in Christ",
  12: "Church of the Nazarene",
  13: "Disciples of Christ",
  14: "Episcopal",
  15: "Friends",
  16: "Greek Orthodox",
  17: "Islamic",
  18: "Jewish",
  19: "Latter Day Saints",
  20: "Lutheran Church - Missouri Synod",
  21: "Evangelical Lutheran Church in America",
  22: "Wisconsin Evangelical Lutheran Synod",
  23: "Other Lutheran",
  24: "Mennonite",
  25: "Methodist",
  26: "Pentecostal",
  27: "Presbyterian",
  28: "Seventh-day Adventist",
  29: "Other",
  // 30 = not applicable (nonsectarian) -> stored as null, never displayed
};

// TYPOLOGY — School Typology.
const TYPOLOGY_LABELS: Record<number, string> = {
  1: "Catholic, parochial",
  2: "Catholic, diocesan",
  3: "Catholic, private",
  4: "Other religious, conservative Christian",
  5: "Other religious, affiliated with an established denomination",
  6: "Other religious, not affiliated with any denomination",
  7: "Nonsectarian, regular school",
  8: "Nonsectarian, special program",
};

// Association memberships (Q15): value "1" = belongs (verified against the
// file: 73.7% of Roman Catholic schools flag P505/NCEA). P450 is the inverse
// "belongs to none" item and is intentionally not listed.
const ASSOCIATION_COLUMNS: Record<string, string> = {
  P455: "Accelerated Christian Education",
  P458: "Agudath Israel of America",
  P460: "American Association of Christian Schools",
  P465: "Association of Christian Schools International",
  P467: "Association of Christian Teachers and Schools",
  P468: "Association of Classical and Christian Schools",
  P470: "Christian Schools International",
  P475: "Council of Islamic Schools in North America",
  P480: "Evangelical Lutheran Education Association",
  P485: "Friends Council on Education",
  P490: "General Conference of SDA Church",
  P492: "Islamic School League of America",
  P495: "Jesuit Schools Network",
  P530: "National Alliance of Christian Schools",
  P500: "National Association of Episcopal Schools",
  P505: "National Catholic Educational Association",
  P510: "National Christian School Association",
  P515: "National Society for Hebrew Day Schools",
  P520: "Oral Roberts University Educational Fellowship",
  P523: "Prizmah: Center for Jewish Day Schools",
  P535: "Other Religious School Associations",
  P540: "American Montessori Society",
  P542: "Association Montessori International",
  P545: "Other Montessori Associations",
  P550: "Association of Military Colleges and Schools",
  P555: "Association of Waldorf Schools of North America",
};

// Grade-level enrollment columns (Q4 *_ENRL items).
const GRADE_ENROLLMENT_COLUMNS: Record<string, string> = {
  P140: "Ungraded",
  P150: "PreK",
  P160: "K",
  P170: "TK",
  P180: "T1",
  P190: "1",
  P200: "2",
  P210: "3",
  P220: "4",
  P230: "5",
  P240: "6",
  P250: "7",
  P260: "8",
  P270: "9",
  P280: "10",
  P290: "11",
  P300: "12",
};

export const HIGH_THRESHOLD = 0.8;
export const REVIEW_THRESHOLD = 0.7;
export const MIN_MARGIN = 0.05;
export const SURVEY_YEAR = "2023-24";
export const SOURCE_NAME =
  "NCES Private School Universe Survey (PSS) 2023-24";

// ---------------------------------------------------------------------------
// CSV parsing (RFC 4180; the PSS file uses quoted fields with embedded
// commas/newlines, so a naive split is not safe)
// ---------------------------------------------------------------------------

export function parseCsv(text: string): Record<string, string>[] {
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
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const header = rows[0];
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => (obj[h.replace(/^﻿/, "")] = r[idx] ?? ""));
    return obj;
  });
}

// ---------------------------------------------------------------------------
// Name normalization + similarity (identical algorithm to the audited
// prototype; thresholds above were calibrated against the live directory)
// ---------------------------------------------------------------------------

const ABBREVIATIONS: Record<string, string> = {
  MT: "MOUNT",
  ST: "SAINT",
  STE: "SAINTE",
  FT: "FORT",
  ACAD: "ACADEMY",
  SCH: "SCHOOL",
  CHR: "CHRISTIAN",
  ELEM: "ELEMENTARY",
};

export function normalizeTokens(value: string, isName = true): string[] {
  const cleaned = (value ?? "")
    .toUpperCase()
    .replace(/&/g, " AND ")
    .replace(/[^A-Z0-9 ]/g, " ");
  const toks = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => ABBREVIATIONS[t] ?? t);
  if (isName && toks[0] === "THE") toks.shift();
  return toks;
}

/** Ratcliff-Obershelp ratio (same formula as Python difflib, no junk heuristic). */
export function sequenceRatio(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  let matches = 0;
  const stack: Array<[number, number, number, number]> = [
    [0, a.length, 0, b.length],
  ];
  while (stack.length > 0) {
    const [alo, ahi, blo, bhi] = stack.pop()!;
    // Longest contiguous matching block in a[alo..ahi] x b[blo..bhi],
    // via a rolling DP row of match lengths ending at each (i, j).
    let bestI = alo,
      bestJ = blo,
      bestSize = 0;
    let prevRow = new Map<number, number>();
    for (let i = alo; i < ahi; i++) {
      const curRow = new Map<number, number>();
      for (let j = blo; j < bhi; j++) {
        if (a[i] === b[j]) {
          const k = (prevRow.get(j - 1) ?? 0) + 1;
          curRow.set(j, k);
          if (k > bestSize) {
            bestSize = k;
            bestI = i - k + 1;
            bestJ = j - k + 1;
          }
        }
      }
      prevRow = curRow;
    }
    if (bestSize === 0) continue;
    matches += bestSize;
    if (alo < bestI && blo < bestJ) stack.push([alo, bestI, blo, bestJ]);
    if (bestI + bestSize < ahi && bestJ + bestSize < bhi)
      stack.push([bestI + bestSize, ahi, bestJ + bestSize, bhi]);
  }
  return (2 * matches) / (a.length + b.length);
}

export function nameSimilarity(aToks: string[], bToks: string[]): number {
  const a = aToks.join(" ");
  const b = bToks.join(" ");
  if (!a || !b) return 0;
  const sa = new Set(aToks);
  const sb = new Set(bToks);
  let inter = 0;
  sa.forEach((t) => {
    if (sb.has(t)) inter++;
  });
  const jaccard = inter / Math.max(1, sa.size + sb.size - inter);
  let score = 0.6 * jaccard + 0.4 * sequenceRatio(a, b);
  let aInB = true;
  let bInA = true;
  sa.forEach((t) => {
    if (!sb.has(t)) aInB = false;
  });
  sb.forEach((t) => {
    if (!sa.has(t)) bInA = false;
  });
  if (aInB || bInA) score = Math.min(1, score + 0.15);
  return score;
}

// ---------------------------------------------------------------------------
// PSS record extraction
// ---------------------------------------------------------------------------

export interface PssRecord {
  ppin: string;
  name: string;
  nameToks: string[];
  city: string;
  cityKey: string;
  state: string;
  zip5: string;
  totalEnrollment: number | null;
  fteTeachers: number | null;
  studentTeacherRatio: number | null;
  religiousOrientation: string | null;
  schoolTypology: string | null;
  associations: string[];
  gradeEnrollment: Record<string, number>;
}

function toInt(v: string | undefined): number | null {
  const n = parseInt((v ?? "").trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function toFloat(v: string | undefined): number | null {
  const n = parseFloat((v ?? "").trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function toPssRecord(row: Record<string, string>): PssRecord {
  const orientCode = parseInt((row.ORIENT ?? "").trim(), 10);
  const typologyCode = parseInt((row.TYPOLOGY ?? "").trim(), 10);
  const associations = Object.entries(ASSOCIATION_COLUMNS)
    .filter(([col]) => (row[col] ?? "").trim() === "1")
    .map(([, label]) => label);
  const gradeEnrollment: Record<string, number> = {};
  for (const [col, label] of Object.entries(GRADE_ENROLLMENT_COLUMNS)) {
    const n = toInt(row[col]);
    if (n !== null) gradeEnrollment[label] = n;
  }
  const ratio = toFloat(row.STTCH_RT);
  return {
    ppin: (row.PPIN ?? "").trim(),
    name: (row.PINST ?? "").trim(),
    nameToks: normalizeTokens(row.PINST ?? ""),
    city: (row.PCITY ?? "").trim(),
    cityKey: normalizeTokens(row.PCITY ?? "", false).join(" "),
    state: (row.PSTABB ?? "").trim().toUpperCase(),
    zip5: (row.PZIP ?? "").trim().slice(0, 5),
    totalEnrollment: toInt(row.NUMSTUDS),
    fteTeachers: toFloat(row.NUMTEACH),
    studentTeacherRatio: ratio !== null ? Math.round(ratio * 100) / 100 : null,
    religiousOrientation:
      orientCode >= 1 && orientCode <= 29
        ? (ORIENT_LABELS[orientCode] ?? null)
        : null,
    schoolTypology: TYPOLOGY_LABELS[typologyCode] ?? null,
    associations,
    gradeEnrollment,
  };
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

export interface DirectorySchool {
  id: number;
  name: string;
  slug: string;
  city: string;
  stateCode: string;
  zip: string;
}

export type MatchStatus = "high" | "review" | "unmatched";

export interface MatchResult {
  school: DirectorySchool;
  status: MatchStatus;
  score: number;
  margin: number;
  method: "zip" | "city" | "none";
  candidate: PssRecord | null;
  duplicateClaim: boolean;
}

export function matchSchools(
  directory: DirectorySchool[],
  pssRecords: PssRecord[],
): MatchResult[] {
  const byZip = new Map<string, number[]>();
  const byCity = new Map<string, number[]>();
  pssRecords.forEach((p, i) => {
    const zk = `${p.state}|${p.zip5}`;
    const ck = `${p.state}|${p.cityKey}`;
    (byZip.get(zk) ?? byZip.set(zk, []).get(zk)!).push(i);
    (byCity.get(ck) ?? byCity.set(ck, []).get(ck)!).push(i);
  });

  const results: MatchResult[] = directory.map((s) => {
    const toks = normalizeTokens(s.name);
    const cityKey = normalizeTokens(s.city, false).join(" ");
    const state = (s.stateCode ?? "").toUpperCase();
    const zip5 = (s.zip ?? "").trim().slice(0, 5);
    const cand = new Map<number, "zip" | "city">();
    for (const i of byZip.get(`${state}|${zip5}`) ?? []) cand.set(i, "zip");
    for (const i of byCity.get(`${state}|${cityKey}`) ?? [])
      if (!cand.has(i)) cand.set(i, "city");
    const scoredList: Array<{ score: number; idx: number; via: "zip" | "city" }> = [];
    cand.forEach((via, i) =>
      scoredList.push({
        score: nameSimilarity(toks, pssRecords[i].nameToks),
        idx: i,
        via,
      }),
    );
    const scored = scoredList.sort((x, y) => y.score - x.score);
    const best = scored[0];
    const second = scored[1]?.score ?? 0;
    if (!best) {
      return {
        school: s,
        status: "unmatched" as const,
        score: 0,
        margin: 0,
        method: "none" as const,
        candidate: null,
        duplicateClaim: false,
      };
    }
    const margin = best.score - second;
    const status: MatchStatus =
      best.score >= HIGH_THRESHOLD && margin >= MIN_MARGIN
        ? "high"
        : best.score >= REVIEW_THRESHOLD
          ? "review"
          : "unmatched";
    return {
      school: s,
      status,
      score: best.score,
      margin,
      method: best.via,
      candidate: pssRecords[best.idx],
      duplicateClaim: false,
    };
  });

  // A PSS record claimed by more than one directory school is ambiguous
  // (multi-campus listings, split elementary/secondary entries): demote
  // every claimant to REVIEW so a human decides which listing it belongs to.
  const claims = new Map<string, MatchResult[]>();
  for (const r of results) {
    if (r.candidate && r.status !== "unmatched") {
      const list = claims.get(r.candidate.ppin) ?? [];
      list.push(r);
      claims.set(r.candidate.ppin, list);
    }
  }
  claims.forEach((list) => {
    if (list.length > 1) {
      for (const r of list) {
        r.duplicateClaim = true;
        if (r.status === "high") r.status = "review";
      }
    }
  });
  return results;
}

// ---------------------------------------------------------------------------
// Audit reporting
// ---------------------------------------------------------------------------

function fmt(r: MatchResult): string {
  const s = r.school;
  const c = r.candidate;
  const head = `[${r.score.toFixed(2)} m=${r.margin.toFixed(2)} ${r.method}${r.duplicateClaim ? " DUPE" : ""} ${r.status}] ${s.name} (${s.city}, ${s.stateCode} ${s.zip})`;
  return c ? `${head}  <->  ${c.name} (${c.city}, ${c.zip5}) [${c.ppin}]` : head;
}

export function printAudit(results: MatchResult[]): void {
  const total = results.length;
  const high = results.filter((r) => r.status === "high");
  const review = results.filter((r) => r.status === "review");
  const unmatched = results.filter((r) => r.status === "unmatched");
  const dupes = results.filter((r) => r.duplicateClaim).length;
  const viaZip = high.filter((r) => r.method === "zip").length;
  const viaCity = high.filter((r) => r.method === "city").length;
  const noCand = unmatched.filter((r) => !r.candidate).length;

  console.log(`\n================ NCES PSS ${SURVEY_YEAR} MATCH AUDIT ================`);
  console.log(`Directory schools:            ${total}`);
  console.log(
    `HIGH confidence (importable): ${high.length} (${((high.length / total) * 100).toFixed(1)}%)  [zip block: ${viaZip}, city block: ${viaCity}]`,
  );
  console.log(
    `REVIEW needed (never auto):   ${review.length} (${((review.length / total) * 100).toFixed(1)}%)  [incl. ${dupes} duplicate-claim demotions]`,
  );
  console.log(
    `UNMATCHED:                    ${unmatched.length} (${((unmatched.length / total) * 100).toFixed(1)}%)  [no candidate in state/zip or state/city: ${noCand}]`,
  );

  console.log(`\n--- Edge cases 1-8: REVIEW closest to the ${HIGH_THRESHOLD} accept line ---`);
  [...review]
    .sort((a, b) => Math.abs(a.score - HIGH_THRESHOLD) - Math.abs(b.score - HIGH_THRESHOLD))
    .slice(0, 8)
    .forEach((r) => console.log(fmt(r)));

  console.log(`\n--- Edge cases 9-14: lowest-margin non-unmatched (ambiguity check) ---`);
  results
    .filter((r) => r.status !== "unmatched")
    .sort((a, b) => a.margin - b.margin)
    .slice(0, 6)
    .forEach((r) => console.log(fmt(r)));

  console.log(`\n--- Edge cases 15-20: UNMATCHED despite a plausible candidate (correctly rejected) ---`);
  unmatched
    .filter((r) => r.candidate && r.score > 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .forEach((r) => console.log(fmt(r)));
  console.log(`===================================================================\n`);
}

function writeAuditFiles(outDir: string, results: MatchResult[]): void {
  fs.mkdirSync(outDir, { recursive: true });
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const review = results.filter((r) => r.status === "review");
  const csv = [
    "school_id,slug,school_name,city,state,zip,score,margin,method,duplicate_claim,pss_ppin,pss_name,pss_city,pss_zip",
    ...review.map((r) =>
      [
        r.school.id,
        esc(r.school.slug),
        esc(r.school.name),
        esc(r.school.city),
        r.school.stateCode,
        r.school.zip,
        r.score.toFixed(3),
        r.margin.toFixed(3),
        r.method,
        r.duplicateClaim ? "yes" : "no",
        r.candidate?.ppin ?? "",
        esc(r.candidate?.name ?? ""),
        esc(r.candidate?.city ?? ""),
        r.candidate?.zip5 ?? "",
      ].join(","),
    ),
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "nces-review-cases.csv"), csv);
  console.log(
    `Wrote ${review.length} review cases to ${path.join(outDir, "nces-review-cases.csv")}`,
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function loadDirectory(fromJson: string | null): Promise<DirectorySchool[]> {
  if (fromJson) {
    const raw = JSON.parse(fs.readFileSync(fromJson, "utf-8")) as Array<
      Record<string, unknown>
    >;
    return raw.map((r) => ({
      id: Number(r.id),
      name: String(r.name ?? ""),
      slug: String(r.slug ?? ""),
      city: String(r.city ?? ""),
      stateCode: String(r.stateCode ?? r.state ?? ""),
      zip: String(r.zip ?? ""),
    }));
  }
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL not configured and no --schools-json given");
  const rows = await db
    .select({
      id: schools.id,
      name: schools.name,
      slug: schools.slug,
      city: schools.city,
      stateCode: schools.stateCode,
      zip: schools.zip,
    })
    .from(schools);
  return rows;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const get = (flag: string): string | null => {
    const i = args.indexOf(flag);
    return i >= 0 ? (args[i + 1] ?? null) : null;
  };
  const pssPath = get("--pss");
  if (!pssPath) {
    console.error(
      "Usage: importNcesPss.ts --pss /path/pss2324_pu.csv [--schools-json dir.json] [--audit-out dir] [--apply]",
    );
    process.exit(2);
  }
  const apply = args.includes("--apply");
  const auditOut = get("--audit-out");

  console.log(`Reading PSS file: ${pssPath}`);
  const pssRows = parseCsv(fs.readFileSync(pssPath, "utf-8"));
  const pssRecords = pssRows.map(toPssRecord).filter((r) => r.ppin);
  console.log(`PSS records: ${pssRecords.length}`);

  const directory = await loadDirectory(get("--schools-json"));
  console.log(`Directory schools: ${directory.length}`);

  const results = matchSchools(directory, pssRecords);
  printAudit(results);
  if (auditOut) writeAuditFiles(auditOut, results);

  if (!apply) {
    console.log("Dry run only — nothing written. Re-run with --apply to load HIGH matches.");
    process.exit(0);
  }

  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL not configured; cannot --apply");
  const high = results.filter((r) => r.status === "high" && r.candidate);
  console.log(`Applying ${high.length} HIGH matches to school_nces_facts...`);
  let written = 0;
  for (const r of high) {
    const c = r.candidate!;
    const values = {
      schoolId: r.school.id,
      ncesSchoolId: c.ppin,
      surveyYear: SURVEY_YEAR,
      ncesSchoolName: c.name,
      totalEnrollment: c.totalEnrollment,
      fteTeachers: c.fteTeachers !== null ? String(c.fteTeachers) : null,
      studentTeacherRatio:
        c.studentTeacherRatio !== null ? String(c.studentTeacherRatio) : null,
      religiousOrientation: c.religiousOrientation,
      schoolTypology: c.schoolTypology,
      associations: c.associations.length > 0 ? JSON.stringify(c.associations) : null,
      gradeEnrollment:
        Object.keys(c.gradeEnrollment).length > 0
          ? JSON.stringify(c.gradeEnrollment)
          : null,
      matchScore: r.score.toFixed(3),
      matchMethod: r.method,
      sourceName: SOURCE_NAME,
    };
    await db
      .insert(schoolNcesFacts)
      .values(values)
      .onDuplicateKeyUpdate({ set: { ...values, updatedAt: new Date() } });
    written++;
  }
  console.log(`Done. ${written} rows upserted into school_nces_facts.`);
  process.exit(0);
}

// Run only when invoked directly (tsx server/scripts/importNcesPss.ts).
if (process.argv[1] && process.argv[1].endsWith("importNcesPss.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
