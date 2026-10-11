// TEMPORARY blog migration + import. DELETE AFTER USE.
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

// SECURITY: This key MUST be set via environment variable.
// The hardcoded fallback was removed — these temp endpoints refuse to work without it.
// TODO: Remove this entire file after the blog import is complete.
const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY;
if (!ADMIN_KEY) {
  console.warn("[SECURITY] ADMIN_IMPORT_KEY not set — temp blog import endpoints are disabled.");
}

const MIGRATION_STATEMENTS: string[] = [
  "CREATE TABLE IF NOT EXISTS blog_posts (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, title varchar(255) NOT NULL, slug varchar(255) NOT NULL UNIQUE, excerpt text NULL, category varchar(32) NOT NULL DEFAULT 'teaching_tips', ageGroup varchar(64) NULL, content text NOT NULL, readingTimeMinutes int NULL DEFAULT 5, status varchar(16) NOT NULL DEFAULT 'draft', scheduledFor timestamp NULL, publishedAt timestamp NULL, featured boolean NOT NULL DEFAULT false, viewCount int NOT NULL DEFAULT 0, seoTitle varchar(255) NULL, heroImageUrl varchar(512) NULL, resourceTitle varchar(255) NULL, resourceDescription text NULL, resourceContent text NULL, resourceType varchar(64) NULL, downloadCount int NOT NULL DEFAULT 0, isPremiumResource boolean NOT NULL DEFAULT false, resourcePriceCents int NULL, resourcePageCount int NULL, resourcePreviewContent text NULL, createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)",
  "CREATE TABLE IF NOT EXISTS resource_downloads (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, postId int NOT NULL, email varchar(320) NOT NULL, firstName varchar(255) NULL, userType varchar(32) DEFAULT 'other', downloadedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  "CREATE TABLE IF NOT EXISTS resource_purchases (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, postId int NOT NULL, email varchar(320) NOT NULL, stripeSessionId varchar(255) NULL, amount decimal(10,2) NULL, createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)",
];

const ALTER_STATEMENTS: string[] = [
  "ALTER TABLE blog_posts ADD COLUMN isPremiumResource boolean NOT NULL DEFAULT false",
  "ALTER TABLE blog_posts ADD COLUMN resourcePriceCents int NULL",
  "ALTER TABLE blog_posts ADD COLUMN resourcePageCount int NULL",
  "ALTER TABLE blog_posts ADD COLUMN resourcePreviewContent text NULL",
  "ALTER TABLE blog_posts ADD COLUMN heroImageUrl varchar(512) NULL",
  "ALTER TABLE blog_posts ADD COLUMN seoTitle varchar(255) NULL",
  "ALTER TABLE schools ADD COLUMN educationalModel ENUM('traditional','classical','charlotte_mason','montessori','unschooling','eclectic','university_model') DEFAULT 'traditional'",
  "ALTER TABLE blog_posts MODIFY COLUMN category ENUM('bible_lessons','classroom_activities','crafts','critical_thinking','character_education','seasonal','chapel','teaching_tips','family_resources','school_leadership') NOT NULL DEFAULT 'teaching_tips'",
  "CREATE TABLE IF NOT EXISTS news_items (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, title varchar(255) NOT NULL, slug varchar(255) NOT NULL UNIQUE, sourceName varchar(128) NOT NULL, sourceUrl varchar(1024) NOT NULL UNIQUE, summary text NULL, category ENUM('national','state','policy','school_choice','curriculum') NOT NULL DEFAULT 'national', stateCode varchar(2) NULL, publishedAt timestamp NULL, fetchedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, imageUrl varchar(512) NULL, isActive boolean NOT NULL DEFAULT true)",
  "CREATE TABLE IF NOT EXISTS news_fetch_log (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, feedName varchar(128) NOT NULL, fetchedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, itemCount int NOT NULL DEFAULT 0)",
];

export function registerBlogImportTemp(app: Express) {
  app.post("/api/admin/blog-alter-temp", async (req: Request, res: Response) => {
    if (!ADMIN_KEY || req.headers["x-admin-key"] !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const db = await getDb();
      if (!db) { res.status(500).json({ error: "No DB" }); return; }
      for (const stmt of ALTER_STATEMENTS) {
        try { await db.execute(sql.raw(stmt)); } catch (e: any) {
          const msg = (e.message || "") + " " + (e.cause?.message || "") + " " + JSON.stringify(e.cause || {});
          if (!/duplicate/i.test(msg) && !/already exists/i.test(msg)) throw e;
          // else: column already exists, skip silently
        }
      }
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message?.slice(0, 500) });
    }
  });

  app.post("/api/admin/blog-migrate-temp", async (req: Request, res: Response) => {
    if (!ADMIN_KEY || req.headers["x-admin-key"] !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const db = await getDb();
      if (!db) { res.status(500).json({ error: "No DB" }); return; }
      for (const stmt of MIGRATION_STATEMENTS) {
        await db.execute(sql.raw(stmt));
      }
      res.json({ ok: true, tables: ["blog_posts", "resource_downloads", "resource_purchases"] });
    } catch (e: any) {
      res.status(500).json({ error: e.message?.slice(0, 500) });
    }
  });

  app.post("/api/admin/blog-import-temp", async (req: Request, res: Response) => {
    if (!ADMIN_KEY || req.headers["x-admin-key"] !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const db = await getDb();
      if (!db) { res.status(500).json({ error: "No DB" }); return; }
      const { blogPosts } = await import("../drizzle/schema");
      const { items } = req.body;
      if (!Array.isArray(items)) { res.status(400).json({ error: "items array required" }); return; }

      let imported = 0;
      const errors: string[] = [];
      for (const item of items) {
        try {
          // Use raw SQL with only core columns to avoid missing-column issues
          await db.execute(sql.raw(
            `INSERT INTO blog_posts (title, slug, excerpt, category, ageGroup, content, readingTimeMinutes, status, scheduledFor, featured, seoTitle) VALUES (${[
              item.title, item.slug, item.excerpt || null, item.category || "teaching_tips",
              item.ageGroup || null, item.content, item.readingTimeMinutes || 5,
              item.status || "scheduled", item.scheduledFor || null,
              item.featured ? 1 : 0, item.seoTitle || null
            ].map(v => v === null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`).join(", ")}) ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), excerpt=VALUES(excerpt), status=VALUES(status), scheduledFor=VALUES(scheduledFor)`
          ));
          imported++;
        } catch (e: any) {
          errors.push(item.slug + ": " + (e.cause?.message || e.message || "unknown").slice(0, 150));
        }
      }
      res.json({ imported, total: items.length, errors: errors.slice(0, 10) });
    } catch (e: any) {
      res.status(500).json({ error: (e.message || "unknown").slice(0, 500) });
    }
  });

  app.post("/api/admin/news-refresh-temp", async (req: Request, res: Response) => {
    if (!ADMIN_KEY || req.headers["x-admin-key"] !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const { triggerNewsRefresh } = await import("./db.js");
      const result = await triggerNewsRefresh();
      res.json({ ok: true, result });
    } catch (e: any) {
      res.status(500).json({ error: (e.message || "unknown").slice(0, 500) });
    }
  });

  app.post("/api/admin/publish-all-temp", async (req: Request, res: Response) => {
    if (!ADMIN_KEY || req.headers["x-admin-key"] !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const db = await getDb();
      if (!db) { res.status(500).json({ error: "No DB" }); return; }
      await db.execute(sql.raw("UPDATE blog_posts SET status='published', publishedAt=NOW() WHERE status='scheduled'"));
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: (e.message || "unknown").slice(0, 500) });
    }
  });
}
