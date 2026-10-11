import { Express, Request, Response } from "express";
import { sql } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "fcs-admin-711475419c823149fcbdd85cf850c207";

// Classical indicators in school names/descriptions
const CLASSICAL_PATTERNS = [
  "classical",
  "trivium",
  "veritas",
  "logos",
  "quadrivium",
  "grammar school",
  "rhetoric school",
  "dialectic",
];

export function registerClassicalTagTemp(app: Express) {
  app.post("/api/admin/tag-classical-temp", async (req: Request, res: Response) => {
    if (req.headers["x-admin-key"] !== ADMIN_KEY) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    try {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "No DB" });
        return;
      }

      // First ensure the column exists
      try {
        await db.execute(sql.raw(`ALTER TABLE schools ADD COLUMN educationalModel ENUM('traditional','classical','charlotte_mason','montessori','unschooling','eclectic','university_model') DEFAULT 'traditional'`));
      } catch (e: any) {
        if (!e.message?.includes("Duplicate") && !e.message?.includes("duplicate")) {
          // Column might already exist, continue
        }
      }

      // Build the LIKE conditions
      const conditions = CLASSICAL_PATTERNS.map(p =>
        `(LOWER(name) LIKE '%${p}%' OR LOWER(COALESCE(description, '')) LIKE '%${p}%')`
      ).join(" OR ");

      // Count matches first
      const countResult: any = await db.execute(sql.raw(
        `SELECT COUNT(*) as cnt FROM schools WHERE (${conditions}) AND (educationalModel IS NULL OR educationalModel = 'traditional')`
      ));
      const matchCount = countResult[0]?.[0]?.cnt || countResult[0]?.cnt || 0;

      // Update them
      await db.execute(sql.raw(
        `UPDATE schools SET educationalModel = 'classical' WHERE (${conditions}) AND (educationalModel IS NULL OR educationalModel = 'traditional')`
      ));

      // Also check for Charlotte Mason indicators
      const cmResult: any = await db.execute(sql.raw(
        `SELECT COUNT(*) as cnt FROM schools WHERE (LOWER(name) LIKE '%charlotte mason%' OR LOWER(COALESCE(description, '')) LIKE '%charlotte mason%') AND (educationalModel IS NULL OR educationalModel = 'traditional')`
      ));
      const cmCount = cmResult[0]?.[0]?.cnt || cmResult[0]?.cnt || 0;
      await db.execute(sql.raw(
        `UPDATE schools SET educationalModel = 'charlotte_mason' WHERE (LOWER(name) LIKE '%charlotte mason%' OR LOWER(COALESCE(description, '')) LIKE '%charlotte mason%') AND (educationalModel IS NULL OR educationalModel = 'traditional')`
      ));

      res.json({
        ok: true,
        classicalTagged: matchCount,
        charlotteMasonTagged: cmCount,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message?.slice(0, 500) });
    }
  });
}
