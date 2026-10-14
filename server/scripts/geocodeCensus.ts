/**
 * geocodeCensus.ts — geocode FindChristianSchools directory schools with the
 * FREE U.S. Census Bureau batch geocoder. No API key, no paid service.
 *
 * Why: the directory's latitude/longitude coverage is sparse (some rows hold
 * ZIP-centroid approximations from an old zip-centroid pass), and the map
 * view decision is gated on rooftop-grade coordinate coverage approaching
 * ~90%. Census address matching gives street-level coordinates for free.
 *
 * Service: Census Geocoder batch endpoint (locations/addressbatch).
 *   Docs: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html
 *   - POST multipart form: addressFile (CSV), benchmark, vintage.
 *   - Input CSV columns (NO header): Unique ID, Street Address, City, State, ZIP
 *   - Hard limit: 10,000 addresses per file. This script chunks at 9,500.
 *   - Output CSV columns: id, input address, Match (Match/No_Match/Tie),
 *     Match type (Exact/Non_Exact), matched address, "longitude,latitude",
 *     TIGERLINE id, side (L/R).
 *
 * Confidence classification (the map gate):
 *   - EXACT:      Match + Exact       -> usable, rooftop-grade.
 *   - NON_EXACT:  Match + Non_Exact   -> usable (street interpolation);
 *                                        flagged so the import gate can decide.
 *   - TIE:        multiple candidates -> EXCLUDED (ambiguous).
 *   - NO_MATCH:   no candidate        -> EXCLUDED (PO Boxes land here:
 *                                        Census address ranges have no PO Boxes).
 *
 * This script NEVER writes to any database. It reads a schools file and
 * writes result files. The production import is a separate, later step
 * (temporary in-Railway runner, confidence-gated UPDATE keyed by schoolId).
 *
 * Usage:
 *   pnpm tsx server/scripts/geocodeCensus.ts \
 *       --schools-csv data/masterschoollist.csv \
 *       --out-dir /path/to/out \
 *       [--limit 500]        # pilot: stride-sample N schools across the file
 *       [--chunk 9500]       # rows per Census submission (<= 10000)
 *       [--benchmark Public_AR_Current] [--vintage Current_Current]
 *
 *   --schools-json accepts [{schoolId, street, city, state, zip}] instead.
 *
 * Outputs in --out-dir:
 *   census-input-<chunk>.csv    exact files submitted to Census
 *   census-raw-<chunk>.csv      raw Census responses
 *   geocode-results.csv         one row per school, classified
 *   geocode-results.jsonl       same, JSON lines
 *   summary.json                counts: total, by class, match rate
 */
import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const schoolsCsv = arg("schools-csv");
const schoolsJson = arg("schools-json");
const outDir = arg("out-dir") ?? "geocode-out";
const limit = arg("limit") ? parseInt(arg("limit")!, 10) : undefined;
const chunkSize = Math.min(arg("chunk") ? parseInt(arg("chunk")!, 10) : 9500, 10000);
const benchmark = arg("benchmark") ?? "Public_AR_Current";
const vintage = arg("vintage") ?? "Current_Current";
const ENDPOINT = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";

if (!schoolsCsv && !schoolsJson) {
  console.error("Give --schools-csv <file> or --schools-json <file>. See header.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Minimal RFC-4180 CSV reader/writer (fields may contain quoted commas)
// ---------------------------------------------------------------------------
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", inQ = false;
  const t = text.replace(/\r\n/g, "\n");
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inQ) {
      if (c === '"') {
        if (t[i + 1] === '"') { field += '"'; i++; } else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); field = ""; rows.push(row); row = []; }
    else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length > 1 || (r[0] ?? "").trim() !== "");
}
function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
const csvLine = (cells: unknown[]) => cells.map(csvCell).join(",");

// ---------------------------------------------------------------------------
// Load schools
// ---------------------------------------------------------------------------
type SchoolIn = { schoolId: string; name: string; street: string; city: string; state: string; zip: string };
function loadSchools(): SchoolIn[] {
  if (schoolsJson) {
    const raw = JSON.parse(fs.readFileSync(schoolsJson, "utf-8")) as any[];
    return raw.map(r => ({
      schoolId: String(r.schoolId ?? r.school_id ?? r.id),
      name: String(r.name ?? r.school_name ?? ""),
      street: String(r.street ?? r.street_address ?? r.address ?? ""),
      city: String(r.city ?? ""), state: String(r.state ?? ""), zip: String(r.zip ?? ""),
    }));
  }
  const rows = parseCsvRows(fs.readFileSync(schoolsCsv!, "utf-8"));
  const head = rows[0].map(h => h.trim());
  const ix = (n: string) => head.indexOf(n);
  const out: SchoolIn[] = [];
  for (const r of rows.slice(1)) {
    out.push({
      schoolId: r[ix("school_id")], name: r[ix("school_name")],
      street: r[ix("street_address")], city: r[ix("city")],
      state: r[ix("state")], zip: r[ix("zip")],
    });
  }
  return out;
}

const PO_BOX = /\bp\.?\s?o\.?\s*box\b/i;
let schools = loadSchools().filter(s => s.schoolId && s.street && s.city && s.state);
console.log(`Loaded ${schools.length} schools with street+city+state from ${schoolsJson ?? schoolsCsv}`);

// Deterministic stride sample for pilots: spreads across the whole file
// (the master list is state-ordered, so a head-slice pilot would be all AK/AL).
if (limit && limit < schools.length) {
  const stride = schools.length / limit;
  const sampled: SchoolIn[] = [];
  for (let i = 0; i < limit; i++) sampled.push(schools[Math.floor(i * stride)]);
  schools = sampled;
  console.log(`Pilot mode: stride-sampled ${schools.length} schools`);
}

// ---------------------------------------------------------------------------
// Census batch submission
// ---------------------------------------------------------------------------
async function submitChunk(rows: SchoolIn[], chunkIdx: number): Promise<string> {
  const inputCsv = rows.map(s => csvLine([s.schoolId, s.street, s.city, s.state, s.zip])).join("\n") + "\n";
  const inPath = path.join(outDir, `census-input-${chunkIdx}.csv`);
  fs.writeFileSync(inPath, inputCsv);
  const form = new FormData();
  form.append("addressFile", new Blob([inputCsv], { type: "text/csv" }), `addresses-${chunkIdx}.csv`);
  form.append("benchmark", benchmark);
  form.append("vintage", vintage);
  const started = Date.now();
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: form, signal: AbortSignal.timeout(15 * 60 * 1000) });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const text = await res.text();
      if (!text.trim()) throw new Error("Empty response body");
      console.log(`Chunk ${chunkIdx}: ${rows.length} rows, ${text.length} bytes back in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      fs.writeFileSync(path.join(outDir, `census-raw-${chunkIdx}.csv`), text);
      return text;
    } catch (e) {
      lastErr = e;
      console.warn(`Chunk ${chunkIdx} attempt ${attempt} failed: ${e instanceof Error ? e.message : e}`);
      // FormData bodies are single-use in some runtimes; rebuild on retry.
      form.delete("addressFile");
      form.append("addressFile", new Blob([inputCsv], { type: "text/csv" }), `addresses-${chunkIdx}.csv`);
    }
  }
  throw lastErr;
}

// ---------------------------------------------------------------------------
// Run + classify
// ---------------------------------------------------------------------------
type Result = {
  schoolId: string; name: string; street: string; city: string; state: string; zip: string;
  pobox: boolean; matchStatus: string; matchType: string; matchedAddress: string;
  longitude: number | null; latitude: number | null;
  confidence: "EXACT" | "NON_EXACT" | "TIE" | "NO_MATCH"; usable: boolean;
};

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const byId = new Map(schools.map(s => [s.schoolId, s]));
  const results: Result[] = [];
  for (let start = 0, ci = 0; start < schools.length; start += chunkSize, ci++) {
    const chunk = schools.slice(start, start + chunkSize);
    const raw = await submitChunk(chunk, ci);
    for (const r of parseCsvRows(raw)) {
      // Census output: id, input, match, matchType, matchedAddr, "lon,lat", tigerId, side
      const [id, , match, matchType, matchedAddress, coords] = r;
      const s = byId.get(id);
      if (!s) continue;
      let lat: number | null = null, lng: number | null = null;
      if (coords && coords.includes(",")) {
        const [lo, la] = coords.split(",").map(Number);
        if (Number.isFinite(lo) && Number.isFinite(la)) { lng = lo; lat = la; }
      }
      const confidence: Result["confidence"] =
        match === "Match" && matchType === "Exact" ? "EXACT" :
        match === "Match" ? "NON_EXACT" :
        match === "Tie" ? "TIE" : "NO_MATCH";
      results.push({
        schoolId: s.schoolId, name: s.name, street: s.street, city: s.city, state: s.state, zip: s.zip,
        pobox: PO_BOX.test(s.street), matchStatus: match ?? "", matchType: matchType ?? "",
        matchedAddress: matchedAddress ?? "", longitude: lng, latitude: lat,
        confidence, usable: confidence === "EXACT" || confidence === "NON_EXACT",
      });
    }
  }

  // Any submitted school missing from the response is recorded, never dropped.
  const seen = new Set(results.map(r => r.schoolId));
  for (const s of schools) if (!seen.has(s.schoolId)) {
    results.push({
      schoolId: s.schoolId, name: s.name, street: s.street, city: s.city, state: s.state, zip: s.zip,
      pobox: PO_BOX.test(s.street), matchStatus: "MissingFromResponse", matchType: "",
      matchedAddress: "", longitude: null, latitude: null, confidence: "NO_MATCH", usable: false,
    });
  }
  results.sort((a, b) => a.schoolId.localeCompare(b.schoolId));

  const header = ["schoolId", "name", "street", "city", "state", "zip", "pobox", "matchStatus", "matchType", "matchedAddress", "latitude", "longitude", "confidence", "usable"];
  fs.writeFileSync(path.join(outDir, "geocode-results.csv"),
    [csvLine(header), ...results.map(r => csvLine([r.schoolId, r.name, r.street, r.city, r.state, r.zip, r.pobox, r.matchStatus, r.matchType, r.matchedAddress, r.latitude, r.longitude, r.confidence, r.usable]))].join("\n") + "\n");
  fs.writeFileSync(path.join(outDir, "geocode-results.jsonl"), results.map(r => JSON.stringify(r)).join("\n") + "\n");

  const count = (c: string) => results.filter(r => r.confidence === c).length;
  const usable = results.filter(r => r.usable).length;
  const summary = {
    inputFile: schoolsJson ?? schoolsCsv, submitted: schools.length, returned: results.length,
    exact: count("EXACT"), nonExact: count("NON_EXACT"), tie: count("TIE"), noMatch: count("NO_MATCH"),
    usable, usablePct: +(100 * usable / results.length).toFixed(2),
    poboxSubmitted: results.filter(r => r.pobox).length,
    poboxUsable: results.filter(r => r.pobox && r.usable).length,
    benchmark, vintage, generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
  console.log("\n=== SUMMARY ===");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
