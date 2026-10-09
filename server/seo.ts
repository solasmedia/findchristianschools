import type { Express, Request, Response } from "express";

const SITE_URL = process.env.SITE_URL || "https://www.findchristianschools.com";

export function registerSeoRoutes(app: Express) {
  // robots.txt
  app.get("/robots.txt", (_req: Request, res: Response) => {
    res.type("text/plain").send(
`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml`
    );
  });

  // sitemap.xml - dynamic, includes all public schools
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) {
        res.status(500).send("Database unavailable");
        return;
      }
      const { schools } = await import("../drizzle/schema");
      const { eq, and, ne } = await import("drizzle-orm");

      // Get all public, non-removed schools (just slug for sitemap)
      const rows = await db
        .select({ slug: schools.slug })
        .from(schools)
        .where(and(ne(schools.listingStatus, "removed"), eq(schools.isApproved, true)))
        .limit(50000);

      const urls = rows
        .filter(r => r.slug)
        .map(r => `  <url><loc>${SITE_URL}/school/${r.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
        .join("\n");

      // Static pages
      const staticPages = ["", "/search", "/about", "/contact", "/mission", "/disclaimer", "/privacy", "/terms", "/states"]
        .map(p => `  <url><loc>${SITE_URL}${p}</loc><changefreq>weekly</changefreq><priority>${p === "" ? "1.0" : "0.5"}</priority></url>`)
        .join("\n");

      // Top cities by school count (for SEO landing pages)
      const cityRows = await db
        .select({ city: schools.city, stateCode: schools.stateCode })
        .from(schools)
        .where(and(ne(schools.listingStatus, "removed"), eq(schools.isApproved, true)))
        .limit(50000);

      // Group by city+state, count, take top 200
      const cityCounts = new Map<string, { city: string; stateCode: string; count: number }>();
      for (const r of cityRows) {
        if (!r.city || !r.stateCode) continue;
        const key = `${r.city}|${r.stateCode}`;
        const existing = cityCounts.get(key);
        if (existing) existing.count++;
        else cityCounts.set(key, { city: r.city, stateCode: r.stateCode, count: 1 });
      }
      const topCities = [...cityCounts.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 200);

      const cityUrls = topCities
        .map(c => {
          const slug = c.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return `  <url><loc>${SITE_URL}/city/${c.stateCode}/${slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`;
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages}
${cityUrls}
${urls}
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      console.error("Sitemap generation error:", err);
      res.status(500).send("Error generating sitemap");
    }
  });
}
