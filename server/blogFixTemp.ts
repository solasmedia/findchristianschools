import { Express, Request, Response } from "express";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_IMPORT_KEY || "";

export function registerBlogFixTemp(app: Express) {
  app.post("/api/admin/blog-fix-temp", async (req: Request, res: Response) => {
    if (req.headers["x-admin-key"] !== ADMIN_KEY) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        res.status(400).json({ error: "items array required" });
        return;
      }
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "No database" });
        return;
      }
      let imported = 0;
      const errors: string[] = [];
      for (const item of items) {
        try {
          // Delete existing by slug, then insert fresh
          await db.execute(sql.raw(`DELETE FROM blog_posts WHERE slug = '${item.slug.replace(/'/g, "''")}'`));
          const title = item.title.replace(/'/g, "''");
          const slug = item.slug.replace(/'/g, "''");
          const excerpt = (item.excerpt || "").replace(/'/g, "''");
          const content = (item.content || "").replace(/'/g, "''");
          const category = item.category || "teaching_tips";
          const status = "published";
          await db.execute(sql.raw(
            `INSERT INTO blog_posts (title, slug, excerpt, content, category, status, publishedAt, createdAt) VALUES ('${title}', '${slug}', '${excerpt}', '${content}', '${category}', '${status}', NOW(), NOW())`
          ));
          imported++;
        } catch (e: any) {
          errors.push(`${item.slug}: ${e.message}`);
        }
      }
      res.json({ imported, total: items.length, errors: errors.slice(0, 10) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
