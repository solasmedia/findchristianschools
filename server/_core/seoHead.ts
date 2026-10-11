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
