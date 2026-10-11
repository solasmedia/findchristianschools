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

  // sitemap.xml - dynamic, includes all public listings
  // NOTE: Uses the same "public" filters as the search endpoints:
  // schools exclude removed + Catholic/Mormon (per SoF policy).
  // isApproved is NOT used for schools because public search doesn't filter on it
  // and it defaults to false, which would hide nearly all schools from Google.
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) {
        res.status(500).send("Database unavailable");
        return;
      }
      const { schools, colleges, races } = await import("../drizzle/schema");
      const { and, ne, notLike, or, isNull, eq } = await import("drizzle-orm");

      // --- Schools: match publicSchoolConditions() in db.ts ---
      const schoolRows = await db
        .select({ slug: schools.slug })
        .from(schools)
        .where(
          and(
            ne(schools.listingStatus, "removed"),
            notLike(schools.name, "%Catholic%"),
            or(ne(schools.denomination, "Catholic"), isNull(schools.denomination)),
            notLike(schools.name, "%Mormon%"),
            notLike(schools.name, "%Latter-day Saints%"),
            notLike(schools.name, "%LDS%"),
            or(notLike(schools.denomination, "%Mormon%"), isNull(schools.denomination)),
            or(notLike(schools.denomination, "%Latter-day Saints%"), isNull(schools.denomination)),
            or(ne(schools.denomination, "LDS"), isNull(schools.denomination)),
          )
        )
        .limit(45000);

      const schoolUrls = schoolRows
        .filter(r => r.slug)
        .map(r => `  <url><loc>${SITE_URL}/school/${r.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
        .join("\n");

      // --- Colleges: match publicCollegeConditions() in db.ts ---
      let collegeUrls = "";
      try {
        const collegeRows = await db
          .select({ slug: colleges.slug })
          .from(colleges)
          .where(
            and(
              ne(colleges.listingStatus, "removed"),
              eq(colleges.isApproved, true),
              notLike(colleges.name, "%Catholic%"),
              notLike(colleges.denomination, "%Catholic%"),
              notLike(colleges.name, "%Mormon%"),
              notLike(colleges.name, "%Latter-day Saints%"),
              notLike(colleges.denomination, "%Mormon%"),
              notLike(colleges.denomination, "%Latter-day Saints%"),
            )
          )
          .limit(5000);
        collegeUrls = collegeRows
          .filter(r => r.slug)
          .map(r => `  <url><loc>${SITE_URL}/college/${r.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
          .join("\n");
      } catch {
        // colleges table may not exist yet if migration hasn't run
      }

      // --- Races: match publicRaceConditions() in db.ts ---
      let raceUrls = "";
      try {
        const raceRows = await db
          .select({ slug: races.slug })
          .from(races)
          .where(and(ne(races.listingStatus, "removed"), eq(races.isApproved, true)))
          .limit(5000);
        raceUrls = raceRows
          .filter(r => r.slug)
          .map(r => `  <url><loc>${SITE_URL}/race/${r.slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`)
          .join("\n");
      } catch {
        // races table may not exist yet if migration hasn't run
      }

      // --- Blog posts: only published ---
      let blogUrls = "";
      try {
        const { blogPosts } = await import("../drizzle/schema");
        const blogRows = await db
          .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
          .from(blogPosts)
          .where(eq(blogPosts.status, "published"))
          .limit(5000);
        blogUrls = blogRows
          .filter(r => r.slug)
          .map(r => `  <url><loc>${SITE_URL}/blog/${r.slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`)
          .join("\n");
      } catch {
        // blog_posts table may not exist yet if migration hasn't run
      }

      // --- News items: only active ---
      let newsUrls = "";
      try {
        const { newsItems } = await import("../drizzle/schema");
        const newsRows = await db
          .select({ slug: newsItems.slug })
          .from(newsItems)
          .where(eq(newsItems.isActive, true))
          .limit(5000);
        newsUrls = newsRows
          .filter(r => r.slug)
          .map(r => `  <url><loc>${SITE_URL}/news/${r.slug}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`)
          .join("\n");
      } catch {
        // news_items table may not exist yet if migration hasn't run
      }

      // Static pages
      // Static pages
      const staticPages = ["", "/search", "/states", "/colleges", "/races", "/jobs", "/events", "/blog", "/news", "/traveled", "/classical-christian-schools", "/book-club", "/videos", "/federal-tax-credit", "/teacher-resources", "/tools", "/tools/flashcards", "/tools/worksheet-generator", "/tools/math-worksheet-generator", "/tools/spelling-worksheet-generator", "/tools/handwriting-worksheet-generator", "/tools/reading-worksheet-generator", "/tools/bible-verse-maker", "/tools/vocabulary-worksheet-generator", "/lesson-planner", "/about", "/contact", "/mission", "/disclaimer", "/privacy", "/terms", "/statement-of-faith", "/dmca"]
        .map(p => `  <url><loc>${SITE_URL}${p}</loc><changefreq>weekly</changefreq><priority>${p === "" ? "1.0" : "0.5"}</priority></url>`)
        .join("\n");

      // TravelED destination pages (static content)
      const traveledSlugs = ["washington-dc","philadelphia","boston","colonial-williamsburg","gettysburg","mount-vernon","plymouth","st-augustine","san-antonio","charleston","new-orleans","santa-fe","yellowstone","ark-encounter","museum-of-the-bible"];
      const traveledUrls = traveledSlugs
        .map(s => `  <url><loc>${SITE_URL}/traveled/${s}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
        .join("\n");

      // Top cities by school count (for SEO landing pages)
      const cityRows = await db
        .select({ city: schools.city, stateCode: schools.stateCode })
        .from(schools)
        .where(ne(schools.listingStatus, "removed"))
        .limit(50000);

      const cityCounts = new Map<string, { city: string; stateCode: string; count: number }>();
      for (const r of cityRows) {
        if (!r.city || !r.stateCode) continue;
        const key = `${r.city}|${r.stateCode}`;
        const existing = cityCounts.get(key);
        if (existing) existing.count++;
        else cityCounts.set(key, { city: r.city, stateCode: r.stateCode, count: 1 });
      }
      const topCities = Array.from(cityCounts.values())
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
${traveledUrls}
${cityUrls}
${schoolUrls}
${collegeUrls}
${raceUrls}
${blogUrls}
${newsUrls}
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      console.error("Sitemap generation error:", err);
      res.status(500).send("Error generating sitemap");
    }
  });
}
