// TEMPORARY blog migration + import. DELETE AFTER USE.
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "fcs-temp-import-2026";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS \`blog_posts\` (
  \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  \`title\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL UNIQUE,
  \`excerpt\` text NULL,
  \`category\` enum('bible_lessons','classroom_activities','crafts','critical_thinking','character_education','seasonal','chapel','teaching_tips') NOT NULL DEFAULT 'teaching_tips',
  \`ageGroup\` varchar(64) NULL,
  \`content\` text NOT NULL,
  \`heroImageUrl\` varchar(512) NULL,
  \`readingTimeMinutes\` int NULL DEFAULT 5,
  \`status\` enum('draft','scheduled','published') NOT NULL DEFAULT 'draft',
  \`scheduledFor\` timestamp NULL,
  \`publishedAt\` timestamp NULL,
  \`featured\` boolean NOT NULL DEFAULT false,
  \`viewCount\` int NOT NULL DEFAULT 0,
  \`seoTitle\` varchar(255) NULL,
  \`seoDescription\` text NULL,
  \`targetKeyword\` varchar(255) NULL,
  \`resourceTitle\` varchar(255) NULL,
  \`resourceDescription\` text NULL,
  \`resourceContent\` text NULL,
  \`resourceType\` varchar(64) NULL,
  \`isPremium\` boolean NOT NULL DEFAULT false,
  \`premiumPrice\` decimal(10,2) NULL,
  \`downloadCount\` int NOT NULL DEFAULT 0,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_blog_status_published\` (\`status\`, \`publishedAt\`),
  INDEX \`idx_blog_scheduled\` (\`status\`, \`scheduledFor\`),
  INDEX \`idx_blog_category\` (\`category\`)
);
CREATE TABLE IF NOT EXISTS \`resource_downloads\` (
  \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  \`postId\` int NOT NULL,
  \`email\` varchar(320) NOT NULL,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_dl_post\` (\`postId\`)
);
CREATE TABLE IF NOT EXISTS \`resource_purchases\` (
  \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  \`postId\` int NOT NULL,
  \`email\` varchar(320) NOT NULL,
  \`stripeSessionId\` varchar(255) NULL,
  \`amount\` decimal(10,2) NULL,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`uq_purchase_post_email\` (\`postId\`, \`email\`),
  INDEX \`idx_purch_post\` (\`postId\`)
);
`;

export function registerBlogImportTemp(app: Express) {
  app.post("/api/admin/blog-migrate-temp", async (req: Request, res: Response) => {
    if (req.headers["x-admin-key"] !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
    try {
      const db = await getDb();
      if (!db) { res.status(500).json({ error: "No DB" }); return; }
      // Split and run each statement
      const statements = MIGRATION_SQL.split(";").map(s => s.trim()).filter(s => s.length > 10);
      for (const stmt of statements) {
        await db.execute(sql.raw(stmt));
      }
      res.json({ ok: true, tables: ["blog_posts", "resource_downloads", "resource_purchases"] });
    } catch (e: any) {
      res.status(500).json({ error: e.message?.slice(0, 500) });
    }
  });

  app.post("/api/admin/blog-import-temp", async (req: Request, res: Response) => {
    if (req.headers["x-admin-key"] !== ADMIN_KEY) { res.status(403).json({ error: "Forbidden" }); return; }
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
            seoDescription: item.seoDescription || null,
            targetKeyword: item.targetKeyword || null,
            resourceTitle: item.resourceTitle || null,
            resourceDescription: item.resourceDescription || null,
            resourceContent: item.resourceContent || null,
            resourceType: item.resourceType || null,
            isPremium: !!item.isPremium,
            premiumPrice: item.premiumPrice || null,
          });
          imported++;
        } catch (e: any) {
          errors.push(`${item.slug}: ${(e.cause?.message || e.message)?.slice(0, 150)}`);
        }
      }
      res.json({ imported, total: items.length, errors: errors.slice(0, 10) });
    } catch (e: any) {
      res.status(500).json({ error: e.message?.slice(0, 500) });
    }
  });
}
