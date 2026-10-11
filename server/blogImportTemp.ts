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
  "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS isPremiumResource boolean NOT NULL DEFAULT false",
  "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS resourcePriceCents int NULL",
  "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS resourcePageCount int NULL",
  "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS resourcePreviewContent text NULL",
  "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS heroImageUrl varchar(512) NULL",
  "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seoTitle varchar(255) NULL",
];

export function registerBlogImportTemp(app: Express) {
  app.post("/api/admin/blog-alter-temp", async (req: Request, res: Response) => {
    if (!ADMIN_KEY || req.headers["x-admin-key"] !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const db = await getDb();
      if (!db) { res.status(500).json({ error: "No DB" }); return; }
      for (const stmt of ALTER_STATEMENTS) {
        try { await db.execute(sql.raw(stmt)); } catch (e: any) {
          if (!e.message?.includes("Duplicate")) throw e;
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
          await db.insert(blogPosts).values({
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt || null,
            category: item.category || "teaching_tips",
            ageGroup: item.ageGroup || null,
            content: item.content,
            heroImageUrl: item.heroImageUrl || null,
            readingTimeMinutes: item.readingTimeMinutes || 5,
            status: item.status || "scheduled",
            scheduledFor: item.scheduledFor ? new Date(item.scheduledFor) : null,
            featured: !!item.featured,
            seoTitle: item.seoTitle || null,
            resourceTitle: item.resourceTitle || null,
            resourceDescription: item.resourceDescription || null,
            resourceContent: item.resourceContent || null,
            resourceType: item.resourceType || null,
            isPremiumResource: !!item.isPremiumResource,
            resourcePriceCents: item.resourcePriceCents || null,
            resourcePageCount: item.resourcePageCount || null,
            resourcePreviewContent: item.resourcePreviewContent || null,
          });
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
}
