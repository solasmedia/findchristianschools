// TEMPORARY bulk import for colleges and races. DELETE AFTER USE.
// POST /api/admin/bulk-import-temp with { type: 'colleges'|'races', items: [...] }
// Requires admin auth via existing adminImport auth check.

import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { colleges, races } from "../drizzle/schema";

const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "fcs-temp-import-2026";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function registerBulkImportTemp(app: Express) {
  app.post("/api/admin/bulk-import-temp", async (req: Request, res: Response) => {
    try {
      const key = req.headers["x-admin-key"];
      if (key !== ADMIN_KEY) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const { type, items } = req.body;
      if (!type || !Array.isArray(items)) {
        res.status(400).json({ error: "Missing type or items array" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database unavailable" });
        return;
      }

      let imported = 0;
      const errors: string[] = [];

      if (type === "colleges") {
        for (const item of items) {
          try {
            await db.insert(colleges).values({
              name: item.name,
              slug: item.slug || slugify(item.name),
              city: item.city || "",
              state: item.state || "",
              stateCode: item.stateCode || "",
              zip: item.zip || null,
              address: item.address || null,
              phone: item.phone || null,
              website: item.website || null,
              denomination: item.denomination || null,
              ipedsUnitId: item.ipedsUnitId || null,
              enrollment: item.enrollment || null,
              latitude: item.latitude || null,
              longitude: item.longitude || null,
              source: item.source || "ipeds",
              sourceUrl: item.sourceUrl || null,
              listingStatus: "unverified",
              isApproved: true,
            });
            imported++;
          } catch (e: any) {
            errors.push(`${item.name}: ${e.message?.slice(0, 500)}`);
          }
        }
      } else if (type === "races") {
        for (const item of items) {
          try {
            await db.insert(races).values({
              name: item.name,
              slug: item.slug || slugify(item.name),
              raceDate: item.raceDate ? new Date(item.raceDate) : null,
              city: item.city || "",
              state: item.state || "",
              stateCode: item.stateCode || "",
              zip: item.zip || null,
              distances: item.distances || null,
              summary: item.summary || null,
              signupUrl: item.signupUrl || null,
              runsignupId: item.runsignupId || null,
              source: item.source || "runsignup",
              sourceUrl: item.sourceUrl || null,
              listingStatus: "unverified",
              isApproved: true,
            });
            imported++;
          } catch (e: any) {
            errors.push(`${item.name}: ${e.message?.slice(0, 500)}`);
          }
        }
      } else {
        res.status(400).json({ error: "Type must be colleges or races" });
        return;
      }

      res.json({ imported, total: items.length, errors: errors.slice(0, 20) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
