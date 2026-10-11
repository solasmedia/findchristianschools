// TEMPORARY migration runner. DELETE AFTER USE.
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "fcs-temp-import-2026";

export function registerMigrateTemp(app: Express) {
  app.post("/api/admin/migrate-temp", async (req: Request, res: Response) => {
    const key = req.headers["x-admin-key"];
    if (key !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const db = await getDb();
      if (!db) { res.status(500).json({ error: "No DB" }); return; }

      const results: string[] = [];

      // Migration 0018: college claims and premium
      const statements = [
        "ALTER TABLE `claim_requests` MODIFY COLUMN `schoolId` int NULL",
        "ALTER TABLE `claim_requests` ADD COLUMN `collegeId` int NULL",
        "ALTER TABLE `colleges` ADD COLUMN `isPremium` boolean NOT NULL DEFAULT false",
        "ALTER TABLE `colleges` ADD COLUMN `stripeCustomerId` varchar(255) NULL",
        "ALTER TABLE `colleges` ADD COLUMN `stripeSubscriptionId` varchar(255) NULL",
        "ALTER TABLE `colleges` ADD COLUMN `stripePaymentIntentId` varchar(255) NULL",
        "ALTER TABLE `colleges` ADD COLUMN `premiumExpiresAt` timestamp NULL",
      ];

      for (const stmt of statements) {
        try {
          await db.execute(sql.raw(stmt));
          results.push(`OK: ${stmt.slice(0, 50)}`);
        } catch (e: any) {
          const msg = e.cause?.message || e.message || "";
          if (msg.includes("Duplicate column") || msg.includes("already exists")) {
            results.push(`SKIP (exists): ${stmt.slice(0, 50)}`);
          } else {
            results.push(`FAIL: ${stmt.slice(0, 50)} - ${msg.slice(0, 100)}`);
          }
        }
      }

      res.json({ results });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
