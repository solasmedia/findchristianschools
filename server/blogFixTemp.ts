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
      let updated = 0;
      const errors: string[] = [];
      for (const item of items) {
        try {
          // Only update content, leave heroImageUrl as-is (it's already correct)
          await db.execute(sql`
            UPDATE blog_posts SET content = ${item.content || ""}, updatedAt = NOW()
            WHERE slug = ${item.slug}
          `);
          updated++;
        } catch (e: any) {
          errors.push(`${item.slug}: ${e.message}`);
        }
      }
      res.json({ updated, total: items.length, errors: errors.slice(0, 10) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
