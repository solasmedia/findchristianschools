// Admin CSV import endpoint for the schools directory.
// Registered in server/_core/index.ts via registerAdminImportRoute(app).
//
// The admin dashboard (DataImport section) POSTs JSON to
// /api/admin/import-schools with { csvData, sourceName } and expects
// { imported, skipped, errors } back. Imported rows are inserted as
// unverified listings carrying the sourceName as their data-source badge.

import type { Express, Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { getDb, stateToCode } from "./db";
import { schools } from "../drizzle/schema";
import { parse as parseCookieHeader } from "cookie";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const nullable = (v: string | undefined): string | null =>
  v === undefined || v.trim() === "" ? null : v.trim();

const intOrNull = (v: string | undefined): number | null => {
  if (v === undefined || v.trim() === "") return null;
  const n = parseInt(v.trim(), 10);
  return Number.isNaN(n) ? null : n;
};

// Minimal CSV parser that honors quoted fields and escaped quotes.
function parseCSV(text: string): Array<Record<string, string>> {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\r") {
      // ignore, \n terminates the row
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmpty = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (nonEmpty.length === 0) return [];
  const headers = nonEmpty[0].map((h) => h.trim().toLowerCase());
  return nonEmpty.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? "").trim();
    });
    return obj;
  });
}

function isAdminRequest(req: Request): boolean {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return false;
  const cookies = parseCookieHeader(cookieHeader);
  return Boolean(cookies.admin_session);
}

export function registerAdminImportRoute(app: Express) {
  app.post("/api/admin/import-schools", async (req: Request, res: Response) => {
    if (!isAdminRequest(req)) {
      res.status(401).json({ error: "Admin authentication required" });
      return;
    }

    const { csvData, sourceName } = req.body as {
      csvData?: string;
      sourceName?: string;
    };

    if (!csvData || typeof csvData !== "string") {
      res.status(400).json({ error: "csvData is required" });
      return;
    }

    const db = await getDb();
    if (!db) {
      res.status(500).json({ error: "Database unavailable" });
      return;
    }

    const source = sourceName?.trim() || "CSV Import";
    const rows = parseCSV(csvData);

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const name = nullable(r.school_name);
      if (!name) {
        skipped++;
        continue;
      }

      try {
        const stateCode = r.state ? stateToCode(r.state) : "";
        const stateName = r.state?.trim() || null;

        // Skip duplicates already in the directory.
        const existing = await db
          .select({ id: schools.id })
          .from(schools)
          .where(and(eq(schools.name, name), eq(schools.stateCode, stateCode)))
          .limit(1);
        if (existing.length > 0) {
          skipped++;
          continue;
        }

        // Build a unique slug from name + city + state.
        const baseSlug = slugify(`${name}-${r.city || ""}-${stateCode || "us"}`);
        let slug = baseSlug;
        let suffix = 2;
        for (;;) {
          const clash = await db
            .select({ id: schools.id })
            .from(schools)
            .where(eq(schools.slug, slug))
            .limit(1);
          if (clash.length === 0) break;
          slug = `${baseSlug}-${suffix++}`;
        }

        await db.insert(schools).values({
          name,
          slug,
          city: nullable(r.city) ?? "",
          state: stateName ?? "",
          stateCode,
          zip: nullable(r.zip_code) ?? "",
          address: nullable(r.street_address),
          phone: nullable(r.phone),
          website: nullable(r.website),
          denomination: nullable(r.denomination),
          gradeStart: nullable(r.grade_start),
          gradeEnd: nullable(r.grade_end),
          enrollment: intOrNull(r.enrollment),
          studentTeacherRatio: nullable(r.student_teacher_ratio),
          county: nullable(r.county),
          listingStatus: "unverified",
          importSource: source,
          isApproved: false,
          isVerified: false,
          schoolClaimed: false,
          featured: false,
          isPremium: false,
        });
        imported++;
      } catch (e) {
        errors.push(`Row ${i + 2}: ${e instanceof Error ? e.message : "unknown error"}`);
      }
    }

    res.json({ imported, skipped, errors });
  });
}
