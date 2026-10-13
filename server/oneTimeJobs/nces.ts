// One-time job: NCES PSS school facts import. Reuses the audited matching
// engine from server/scripts/importNcesPss.ts verbatim (same thresholds,
// same duplicate-claim demotion), downloads the PSS 2023-24 public-use
// file from NCES at runtime, and upserts HIGH-confidence matches only
// into `school_nces_facts` — the same write the script's --apply performs.
// Idempotent: schoolId is unique and rows are upserted.
import { getDb } from "../db";
import { schools, schoolNcesFacts } from "../../drizzle/schema";
import {
  parseCsv,
  toPssRecord,
  matchSchools,
  SURVEY_YEAR,
  SOURCE_NAME,
  type DirectorySchool,
} from "../scripts/importNcesPss";
import { downloadToBuffer, extractZipEntry } from "./unzipBuffer";

const LOG = "[OneTimeImports]";
const PSS_ZIP_URL = "https://nces.ed.gov/surveys/pss/zip/pss2324_pu_csv.zip";

export async function runNcesJob(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("database unavailable (getDb returned null)");

  console.log(`${LOG} nces: downloading ${PSS_ZIP_URL}`);
  const zip = await downloadToBuffer(PSS_ZIP_URL);
  const entry = extractZipEntry(
    zip,
    (n) => n.toLowerCase() === "pss2324_pu.csv",
  );
  console.log(
    `${LOG} nces: extracted ${entry.name} (${entry.data.length} bytes)`,
  );
  const pssRows = parseCsv(entry.data.toString("utf-8"));
  const pssRecords = pssRows.map(toPssRecord).filter((r) => r.ppin);
  console.log(`${LOG} nces: PSS records: ${pssRecords.length}`);

  const directory: DirectorySchool[] = await db
    .select({
      id: schools.id,
      name: schools.name,
      slug: schools.slug,
      city: schools.city,
      stateCode: schools.stateCode,
      zip: schools.zip,
    })
    .from(schools);
  console.log(`${LOG} nces: directory schools: ${directory.length}`);

  const results = matchSchools(directory, pssRecords);
  const high = results.filter((r) => r.status === "high" && r.candidate);
  const review = results.filter((r) => r.status === "review").length;
  const unmatched = results.filter((r) => r.status === "unmatched").length;
  console.log(
    `${LOG} nces: matched HIGH ${high.length}, REVIEW ${review} (never imported), UNMATCHED ${unmatched}`,
  );

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
      associations:
        c.associations.length > 0 ? JSON.stringify(c.associations) : null,
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
  console.log(
    `${LOG} nces: done (${written} rows upserted into school_nces_facts)`,
  );
}
