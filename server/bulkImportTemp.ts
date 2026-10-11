// TEMPORARY bulk import for colleges and races. DELETE AFTER USE.
// POST /api/admin/bulk-import-temp with { type: 'colleges'|'races', items: [...] }
// Creates tables if they don't exist, then bulk inserts.

import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { colleges, races } from "../drizzle/schema";
import { sql } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "fcs-temp-import-2026";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CREATE_COLLEGES = `
CREATE TABLE IF NOT EXISTS \`colleges\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`city\` varchar(128) NOT NULL,
  \`state\` varchar(64) NOT NULL,
  \`stateCode\` varchar(2) NOT NULL,
  \`zip\` varchar(10),
  \`address\` varchar(512),
  \`phone\` varchar(20),
  \`website\` varchar(512),
  \`denomination\` varchar(128),
  \`ipedsUnitId\` varchar(16),
  \`enrollment\` int,
  \`latitude\` decimal(10,7),
  \`longitude\` decimal(10,7),
  \`source\` varchar(64) NOT NULL DEFAULT 'ipeds',
  \`sourceUrl\` varchar(512),
  \`importDate\` timestamp,
  \`listingStatus\` enum('verified','unverified','pending','claimed','removed','suspended','community_submitted') NOT NULL DEFAULT 'unverified',
  \`isApproved\` boolean NOT NULL DEFAULT true,
  \`featured\` boolean NOT NULL DEFAULT false,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`colleges_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`colleges_slug_unique\` UNIQUE(\`slug\`)
)`;

const CREATE_RACES = `
CREATE TABLE IF NOT EXISTS \`races\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`raceDate\` date,
  \`city\` varchar(128),
  \`state\` varchar(64),
  \`stateCode\` varchar(2),
  \`zip\` varchar(10),
  \`distances\` varchar(512),
  \`summary\` text,
  \`signupUrl\` varchar(512),
  \`runsignupId\` varchar(64),
  \`source\` varchar(64) NOT NULL DEFAULT 'runsignup',
  \`sourceUrl\` varchar(512),
  \`importDate\` timestamp,
  \`listingStatus\` enum('verified','unverified','pending','claimed','removed','suspended','community_submitted') NOT NULL DEFAULT 'unverified',
  \`isApproved\` boolean NOT NULL DEFAULT true,
  \`featured\` boolean NOT NULL DEFAULT false,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`races_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`races_slug_unique\` UNIQUE(\`slug\`)
)`;

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


      // Apply SoF attestation columns (from migration 0017) if missing
      const sofTables = ["jobs", "events", "schools", "international_schools"];
      for (const tbl of sofTables) {
        try {
          await db.execute(sql.raw(`ALTER TABLE \`${tbl}\` ADD COLUMN IF NOT EXISTS \`sofAttested\` boolean NOT NULL DEFAULT false`));
        } catch (e) { /* column may already exist */ }
        try {
          await db.execute(sql.raw(`ALTER TABLE \`${tbl}\` ADD COLUMN IF NOT EXISTS \`sofAttestedAt\` timestamp NULL`));
        } catch (e) { /* column may already exist */ }
      }

      // Ensure tables exist
      if (type === "colleges") {
        await db.execute(sql.raw(CREATE_COLLEGES));
      } else if (type === "races") {
        await db.execute(sql.raw(CREATE_RACES));
      } else {
        res.status(400).json({ error: "Type must be colleges or races" });
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
              latitude: item.latitude ? String(item.latitude) : null,
              longitude: item.longitude ? String(item.longitude) : null,
              source: item.source || "ipeds",
              sourceUrl: item.sourceUrl || null,
              listingStatus: "unverified",
              isApproved: true,
            });
            imported++;
          } catch (e: any) {
            errors.push(`${item.name}: ${(e.cause?.message || e.message)?.slice(0, 300)}`);
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
            errors.push(`${item.name}: ${(e.cause?.message || e.message)?.slice(0, 300)}`);
          }
        }
      }

      res.json({ imported, total: items.length, errors: errors.slice(0, 20) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
