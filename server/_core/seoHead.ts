/**
 * Server-side SEO head injection for the SPA shell.
 *
 * Fixes:
 * 1. Soft 404s — unknown routes return HTTP 404 (client still renders NotFound page)
 * 2. Canonical tags — every page gets a canonical link tag
 * 3. Duplicate titles — detail pages (/school/:slug, /college/:slug, /race/:slug)
 *    get unique title/meta/OG tags injected server-side via DB lookup
 */

const SITE_URL = process.env.SITE_URL || "https://www.findchristianschools.com";

// Static client routes (from client/src/App.tsx). Parameterized routes handled separately.
const STATIC_ROUTES = new Set([
  "/", "/search", "/map", "/resources", "/jobs", "/events", "/mission",
  "/membership", "/states", "/international", "/submit-school",
  "/submit-international", "/admin", "/sponsor", "/profile", "/compare",
  "/save-to-home-screen", "/welcome", "/learning-resources", "/admin-login",
  "/admin-setup", "/privacy", "/privacy-policy", "/terms-of-service", "/terms",
  "/legal-contact", "/disclaimer", "/dmca", "/statement-of-faith",
  "/colleges", "/races", "/signup", "/contact", "/list-course",
  "/curriculum-guide", "/curriculum-comparison", "/lesson-planning",
  "/lesson-planner", "/submit", "/feedback", "/404",
  "/blog",
  "/news",
  "/traveled",
  "/tools", "/tools/worksheet-generator", "/tools/math-worksheet-generator",
  "/tools/spelling-worksheet-generator", "/tools/handwriting-worksheet-generator",
  "/tools/reading-worksheet-generator", "/tools/bible-verse-maker",
  // Redirect aliases (client handles redirect, but they're valid URLs)
  "/donate", "/compare-schools", "/international-schools", "/list-your-school",
  "/become-a-sponsor", "/our-mission",
]);

// Per-route static titles/descriptions for key landing pages
const STATIC_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Find Christian Schools™ | Faith · Education · Future",
    description: "Find Christian schools, homeschool resources, and faith-based education programs near you. Every listing supports Christian education missions worldwide.",
  },
  "/search": {
    title: "Find a Christian School Near You | FindChristianSchools.com",
    description: "Search 9,000+ Christian schools by ZIP code, city, state, denomination, and program type. Find the right faith-based education for your family.",
  },
  "/colleges": {
    title: "Find a Christian College | FindChristianSchools.com",
    description: "Explore Christian colleges and universities across the US. Search by state, denomination, and more.",
  },
  "/races": {
    title: "Christian Races & Running Events | FindChristianSchools.com",
    description: "Find Christian 5Ks, half marathons, marathons, and charity runs near you, grouped by state.",
  },
  "/events": {
    title: "Christian Education Events | FindChristianSchools.com",
    description: "Upcoming Christian conferences, workshops, open houses, and education events.",
  },
  "/jobs": {
    title: "Christian Education Jobs | FindChristianSchools.com",
    description: "Find teaching and staff positions at Christian schools across the country.",
  },
  "/blog": {
    title: "Teacher Resource Blog | FindChristianSchools.com",
    description: "Bible lesson plans, classroom activities, crafts, and teaching ideas for Christian educators. Free downloadable resources.",
  },
  "/news": {
    title: "Christian Education News | FindChristianSchools.com",
    description: "Press releases, policy updates, and school choice news for Christian educators, homeschool parents, and school administrators.",
  },
  "/tools": {
    title: "Free Tools for Christian Teachers | FindChristianSchools.com",
    description: "Free printable worksheet generator, Bible memory verse maker, and lesson plan builder for Christian teachers and homeschool families. No account needed.",
  },
  "/tools/worksheet-generator": {
    title: "Free Printable Worksheet Generator | FindChristianSchools.com",
    description: "Generate free printable worksheets for grades K-8: math, spelling, handwriting, and reading comprehension. Includes answer keys. No account required.",
  },
  "/tools/math-worksheet-generator": {
    title: "Free Math Worksheet Generator (K-8) | FindChristianSchools.com",
    description: "Create free printable math worksheets: addition, subtraction, multiplication, division, and fractions. Grade-appropriate with full answer keys.",
  },
  "/tools/spelling-worksheet-generator": {
    title: "Free Spelling Worksheet Generator | FindChristianSchools.com",
    description: "Generate printable spelling practice sheets with grade-level Dolch-based word lists. Write-three-times drills and fill-in-the-blank exercises.",
  },
  "/tools/handwriting-worksheet-generator": {
    title: "Free Handwriting Practice Sheet Generator | FindChristianSchools.com",
    description: "Print traceable handwriting practice pages: uppercase, lowercase, numbers, words, and short Bible verses. Perfect for early writers.",
  },
  "/tools/reading-worksheet-generator": {
    title: "Free Reading Comprehension Worksheet Generator | FindChristianSchools.com",
    description: "Printable reading passages with comprehension questions and answer keys. Original wholesome stories for Christian families, grades K-8.",
  },
  "/tools/bible-verse-maker": {
    title: "Bible Memory Verse Worksheets (Printable) | FindChristianSchools.com",
    description: "Turn any KJV memory verse into printable trace sheets, fill-in-the-blank, word searches, and copywork pages. 50 kid-favorite verses. Free.",
  },
  "/traveled": {
    title: "TravelED — Educational Family Trips & Homeschool Field Trips | FindChristianSchools.com",
    description: "America's top history destinations for Christian families, with free printable study guides. Plan educational family trips and homeschool field trips.",
  },
  "/federal-tax-credit": {
    title: "Federal Scholarship Tax Credit 2027: $1,700 for Christian School Families | FindChristianSchools.com",
    description: "The Education Freedom Tax Credit launches January 1, 2027. Donate up to $1,700 and get it back dollar-for-dollar on your taxes. Learn how Christian families qualify for K-12 scholarships.",
  },
  "/states": {
    title: "Browse Christian Schools by State | FindChristianSchools.com",
    description: "Explore Christian schools in every US state.",
  },
};

export type RouteMatch =
  | { kind: "static"; path: string }
  | { kind: "school"; slug: string }
  | { kind: "college"; slug: string }
  | { kind: "race"; slug: string }
  | { kind: "blog"; slug: string }
  | { kind: "news"; slug: string }
  | { kind: "state"; code: string }
  | { kind: "city"; code: string; city: string }
  | { kind: "unknown" };

export function matchRoute(rawPath: string): RouteMatch {
  // Strip query string and trailing slash (except root)
  let path = rawPath.split("?")[0].split("#")[0];
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

  if (STATIC_ROUTES.has(path)) return { kind: "static", path };

  const school = path.match(/^\/school\/([^/]+)$/);
  if (school) return { kind: "school", slug: decodeURIComponent(school[1]) };

  const college = path.match(/^\/college\/([^/]+)$/);
  if (college) return { kind: "college", slug: decodeURIComponent(college[1]) };

  const race = path.match(/^\/race\/([^/]+)$/);
  if (race) return { kind: "race", slug: decodeURIComponent(race[1]) };

  const blog = path.match(/^\/blog\/([^/]+)$/);
  if (blog) return { kind: "blog", slug: decodeURIComponent(blog[1]) };

  const news = path.match(/^\/news\/([^/]+)$/);
  if (news) return { kind: "news", slug: decodeURIComponent(news[1]) };

  const state = path.match(/^\/state\/([a-zA-Z]{2})$/);
  if (state) return { kind: "state", code: state[1].toUpperCase() };

  const city = path.match(/^\/city\/([a-zA-Z]{2})\/([^/]+)$/);
  if (city) return { kind: "city", code: city[1].toUpperCase(), city: decodeURIComponent(city[2]) };

  return { kind: "unknown" };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
}

/**
 * Resolve meta for a route. For detail routes, does a DB lookup.
 * Returns null if the entity doesn't exist (caller should 404).
 */
export async function resolveMeta(match: RouteMatch, canonicalPath: string): Promise<PageMeta | null> {
  const canonical = `${SITE_URL}${canonicalPath}`;

  if (match.kind === "static") {
    const meta = STATIC_META[match.path] || {
      title: "FindChristianSchools.com | Faith · Education · Future",
      description: "Find Christian schools, colleges, and faith-based education resources.",
    };
    return { ...meta, canonical };
  }

  // Detail pages: look up from DB for unique titles
  try {
    if (match.kind === "school") {
      const { getSchoolBySlug } = await import("../db");
      const school = await getSchoolBySlug(match.slug);
      if (!school) return null;
      const loc = [school.city, school.state].filter(Boolean).join(", ");
      return {
        title: `${school.name} - Christian School in ${loc} | FindChristianSchools.com`,
        description: `${school.name} is a Christian school in ${loc}${school.denomination ? ` (${school.denomination})` : ""}. View details, contact info, and more.`,
        canonical,
        ogType: "article",
      };
    }
    if (match.kind === "college") {
      const { getCollegeBySlug } = await import("../db");
      const college = await getCollegeBySlug(match.slug);
      if (!college) return null;
      const loc = [college.city, college.state].filter(Boolean).join(", ");
      return {
        title: `${college.name} - Christian College in ${loc} | FindChristianSchools.com`,
        description: `${college.name} is a Christian college in ${loc}${college.denomination ? ` (${college.denomination})` : ""}. View details and contact info.`,
        canonical,
        ogType: "article",
      };
    }
    if (match.kind === "race") {
      const { getRaceBySlug } = await import("../db");
      const race = await getRaceBySlug(match.slug);
      if (!race) return null;
      const loc = [race.city, race.state].filter(Boolean).join(", ");
      return {
        title: `${race.name} - Christian Race in ${loc} | FindChristianSchools.com`,
        description: `${race.name} is a Christian running event in ${loc}. View race details, distances, and signup info.`,
        canonical,
        ogType: "article",
      };
    }
    if (match.kind === "blog") {
      const { getBlogPostBySlug } = await import("../db");
      const post = await getBlogPostBySlug(match.slug);
      if (!post) return null;
      return {
        title: post.seoTitle || `${post.title} | FindChristianSchools.com`,
        description: post.excerpt || "Christian teacher resources, Bible lesson plans, and classroom ideas from FindChristianSchools.com.",
        canonical,
        ogType: "article",
      };
    }
    if (match.kind === "news") {
      const { getNewsItemBySlug } = await import("../db");
      const item = await getNewsItemBySlug(match.slug);
      if (!item) return null;
      return {
        title: `${item.title} | FindChristianSchools.com`,
        description: item.summary || `Christian education news from ${item.sourceName}. Read the full story at the original source.`,
        canonical,
        ogType: "article",
      };
    }
    if (match.kind === "state") {
      return {
        title: `Christian Schools in ${match.code} | FindChristianSchools.com`,
        description: `Browse Christian schools in ${match.code}. Search by city, denomination, and program type.`,
        canonical,
      };
    }
    if (match.kind === "city") {
      const cityName = match.city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        title: `Christian Schools in ${cityName}, ${match.code} | FindChristianSchools.com`,
        description: `Find Christian schools in ${cityName}, ${match.code}. Compare faith-based education options.`,
        canonical,
      };
    }
  } catch (e) {
    console.error("[seoHead] DB lookup failed:", e);
    // Fall through to generic meta rather than 500
  }

  return {
    title: "FindChristianSchools.com | Faith · Education · Future",
    description: "Find Christian schools, colleges, and faith-based education resources.",
    canonical,
  };
}

/**
 * Inject SEO tags into the HTML shell. Replaces existing title/meta/OG tags
 * and adds a canonical link.
 */
export function injectHead(html: string, meta: PageMeta): string {
  const title = escapeHtml(meta.title);
  const desc = escapeHtml(meta.description);

  let out = html;

  // Replace <title>
  out = out.replace(
    /<title>.*?<\/title>/i,
    `<title>${title}</title>`
  );

  // Replace meta description
  out = out.replace(
    /<meta name="description" content=".*?"\s*\/?>/i,
    `<meta name="description" content="${desc}" />`
  );

  // Replace og:title
  out = out.replace(
    /<meta property="og:title" content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`
  );

  // Replace og:description
  out = out.replace(
    /<meta property="og:description" content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${desc}" />`
  );

  // Replace og:type if article
  if (meta.ogType) {
    out = out.replace(
      /<meta property="og:type" content=".*?"\s*\/?>/i,
      `<meta property="og:type" content="${meta.ogType}" />`
    );
  }

  // Add/replace canonical + og:url (insert after charset for early discovery)
  out = out.replace(
    /<meta charset="UTF-8"\s*\/?>/i,
    `<meta charset="UTF-8" />\n    <link rel="canonical" href="${meta.canonical}" />\n    <meta property="og:url" content="${meta.canonical}" />`
  );

  return out;
}
