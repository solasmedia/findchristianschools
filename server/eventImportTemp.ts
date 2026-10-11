// TEMPORARY event import. DELETE AFTER USE.
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { events } from "../drizzle/schema";

const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "fcs-temp-import-2026";

export function registerEventImportTemp(app: Express) {
  app.post("/api/admin/import-events-temp", async (req: Request, res: Response) => {
    const key = req.headers["x-admin-key"];
    if (key !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const db = await getDb();
      if (!db) { res.status(500).json({ error: "No DB" }); return; }

      const { items } = req.body;
      if (!Array.isArray(items)) { res.status(400).json({ error: "items array required" }); return; }

      let imported = 0;
      const errors: string[] = [];

      for (const item of items) {
        try {
          await db.insert(events).values({
            title: item.name,
            description: item.description || null,
            category: item.category || "other",
            location: item.city ? `${item.city}, ${item.state}` : null,
            state: item.state || null,
            stateCode: item.stateCode || null,
            startDate: new Date(item.startDate),
            endDate: item.endDate ? new Date(item.endDate) : null,
            website: item.website || item.sourceUrl || null,
            isActive: true,
            isApproved: true,
            isPublished: true,
            submitterName: item.source || "Public listing",
          });
          imported++;
        } catch (e: any) {
          errors.push(`${item.name}: ${(e.cause?.message || e.message)?.slice(0, 200)}`);
        }
      }

      res.json({ imported, total: items.length, errors: errors.slice(0, 10) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
