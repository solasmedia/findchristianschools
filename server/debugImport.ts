import { readFileSync } from "node:fs";
import { join } from "node:path";
import mysql from "mysql2/promise";

// TEMPORARY: bulk import endpoint. Remove before production.
let importStatus: { running: boolean; imported: number; failed: number; done: boolean; error?: string } = {
  running: false, imported: 0, failed: 0, done: false,
};

function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

export function registerDebugImport(app: any) {
  app.get("/api/debug/import-status", (_req: any, res: any) => {
    res.json(importStatus);
  });

  app.post("/api/debug/import", async (_req: any, res: any) => {
    if (importStatus.running) return res.json({ started: false, reason: "already running" });
    importStatus = { running: true, imported: 0, failed: 0, done: false };
    res.json({ started: true });

    (async () => {
      let conn: mysql.Connection | null = null;
      try {
        const csvText = readFileSync(join(process.cwd(), "data", "masterschoollist.csv"), "utf-8");
        const lines = csvText.split("\n").filter((l) => l.trim());
        const headers = parseCSVLine(lines[0]).map((h) => h.trim());
        conn = await mysql.createConnection(process.env.DATABASE_URL!);
        await conn.execute("DELETE FROM schools");

        const cols = `name, slug, city, state, stateCode, zip, address, phone, website, email,
          description, missionStatement, gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax,
          enrollment, studentTeacherRatio, yearFounded, denomination, accreditation,
          statementOfFaith, hasTransportation, hasLunchProgram, hasAfterSchool,
          hasSpecialNeeds, hasSports, hasArts, hasSTEM, uniformRequired, acceptsVouchers,
          sportsOffered, extracurriculars, isPremium, featured, isApproved,
          importSource, sourceId, listingStatus, schoolClaimed, isVerified,
          schoolId, denominationTag, schoolType, enrollmentTier, dataCompletenessScore,
          needsReview, pointOfContact, internalNotes`.replace(/\s+/g, " ");
        const placeholders = cols.split(",").map(() => "?").join(", ");
        const sql = `INSERT INTO schools (${cols}) VALUES (${placeholders})`;

        const isTrue = (v: string) => v === "True" || v === "1";
        for (let i = 1; i < lines.length; i++) {
          const vals = parseCSVLine(lines[i]);
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => (row[h] = (vals[idx] || "").trim()));
          try {
            const name = row.school_name || "";
            const city = row.city || "";
            const state = row.state || "";
            const zip = row.zip || "";
            if (!name || !city || !state || !zip) { importStatus.failed++; continue; }
            const stateCode = state.length === 2 ? state : "";
            await conn.execute(sql, [
              name, row.slug || "", city, state, stateCode, zip,
              row.street_address || "", row.phone || "", row.website || "", row.email || "",
              row.school_description || "", row.mission_statement || "",
              row.grade_start || "", row.grade_end || "",
              row.program_type || "traditional", row.tuition_type || "tuition_based",
              row.tuition_min ? parseInt(row.tuition_min) : null,
              row.tuition_max ? parseInt(row.tuition_max) : null,
              row.total_enrollment ? parseInt(row.total_enrollment) : null,
              row.student_teacher_ratio || "",
              row.year_founded ? parseInt(row.year_founded) : null,
              row.denomination || "", row.accreditation || "",
              row.statement_of_faith_agreed === "True" ? "Agreed" : "",
              isTrue(row.transportation), isTrue(row.lunch_program), isTrue(row.after_school_care),
              isTrue(row.special_needs_support), isTrue(row.sports_programs), isTrue(row.arts_programs),
              isTrue(row.stem_programs), isTrue(row.uniform_required), isTrue(row.accepts_vouchers),
              row.sports_offered || "", row.extracurriculars || "",
              false, false, false,
              "NCES PSS 2023-24", row.school_id || "", "unverified", false, false,
              row.school_id || "", row.denomination_tag || "", row.school_type || "",
              row.enrollment_tier || "",
              row.data_completeness_score ? parseInt(row.data_completeness_score) : null,
              isTrue(row.needs_review), row.point_of_contact || "", row.internal_notes || "",
            ]);
            importStatus.imported++;
          } catch {
            importStatus.failed++;
          }
          if (i % 1000 === 0) console.log(`[import] ${i}/${lines.length - 1}`);
        }
        importStatus.done = true;
        console.log(`[import] COMPLETE: ${importStatus.imported} imported, ${importStatus.failed} failed`);
      } catch (e: any) {
        importStatus.error = String(e).slice(0, 300);
        console.error("[import] FAILED:", e);
      } finally {
        importStatus.running = false;
        if (conn) await conn.end().catch(() => {});
      }
    })();
  });
}
