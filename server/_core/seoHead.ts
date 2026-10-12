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
  "/tools/vocabulary-worksheet-generator", "/tools/flashcards",
  "/teacher-resources", "/federal-tax-credit",
  "/classical-christian-schools", "/book-club", "/videos", "/newsletter",
  "/enrichment", "/enrichment/submit", "/lister-terms",
  "/enrichment/tutors", "/enrichment/classes", "/enrichment/sports",
  "/enrichment/camps", "/enrichment/youth-groups", "/enrichment/music-arts",
  "/enrichment/homeschool",
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
  "/tools/vocabulary-worksheet-generator": {
    title: "Free Vocabulary Worksheet Generator | FindChristianSchools.com",
    description: "Printable vocabulary worksheets with definitions, sentence writing, and answer keys. Faith-inflected word lists for grades 3–8, fully customizable.",
  },
  "/tools/flashcards": {
    title: "Free Flashcard Maker for Teachers | FindChristianSchools.com",
    description: "Create printable flashcards and study in interactive mode. Perfect for vocabulary, Bible verses, math facts, and any subject. Free, no account needed.",
  },
  "/videos": {
    title: "Videos for Christian Educators | FindChristianSchools.com",
    description: "Free educational videos for Christian teachers and families — Bible book overviews, education news, and teaching tips.",
  },
  "/newsletter": {
    title: "The Christian Ed Weekly — Newsletter | FindChristianSchools.com",
    description: "Join The Christian Ed Weekly — free weekly updates on Christian education news, teaching tips, and resources.",
  },
  "/book-club": {
    title: "Book Club & Recommended Resources | FindChristianSchools.com",
    description: "Hand-picked books and teaching products recommended by Christian educators. Honest reviews, no fluff — every item earns its place.",
  },
  "/classical-christian-schools": {
    title: "Classical Christian Schools — Find One Near You | FindChristianSchools.com",
    description: "Find classical Christian schools near you. The trivium method — grammar, logic, rhetoric — grounded in a biblical worldview. Search our directory of classical Christian academies.",
  },
  "/teacher-resources": {
    title: "Teacher Resources — Free Worksheets, Lesson Plans & Tools | FindChristianSchools.com",
    description: "Free teacher resources for Christian educators: customizable worksheet generators, lesson plan builder, Bible verse maker, handwriting practice, and more. No account needed.",
  },
  "/federal-tax-credit": {
    title: "Federal Scholarship Tax Credit 2027: $1,700 for Christian School Families | FindChristianSchools.com",
    description: "A major change is coming that could open new doors for families considering Christian education. The new Federal Education Tax Credit could help make private Christian education more accessible and affordable for families across America.",
  },
  "/states": {
    title: "Browse Christian Schools by State | FindChristianSchools.com",
    description: "Explore Christian schools in every US state.",
  },
  "/enrichment": {
    title: "Enrichment & Activities — Christian Tutors, Camps, Sports & Youth Groups | FindChristianSchools.com",
    description: "Find Christian tutors, enrichment classes, sports leagues, camps, youth groups like American Heritage Girls and Trail Life USA, music and arts programs, and homeschool co-ops near you.",
  },
  "/enrichment/tutors": {
    title: "Christian Tutors Near You | FindChristianSchools.com",
    description: "Find individual Christian tutors for math, reading, writing, science, and test prep. Search by ZIP code with local results.",
  },
  "/enrichment/classes": {
    title: "Christian Classes & Tutoring Centers | FindChristianSchools.com",
    description: "Find Christian tutoring centers, enrichment classes, and learning programs near you. Search by ZIP code with local results.",
  },
  "/enrichment/sports": {
    title: "Christian Sports Leagues & Programs | FindChristianSchools.com",
    description: "Find Christian sports leagues, clinics, and athletic programs near you that build character alongside skill.",
  },
  "/enrichment/camps": {
    title: "Christian Camps Near You | FindChristianSchools.com",
    description: "Find Christian summer camps, retreats, and day camps near you. Search by ZIP code with local results.",
  },
  "/enrichment/youth-groups": {
    title: "Christian Youth Groups — AHG, Trail Life, Royal Rangers, Awana | FindChristianSchools.com",
    description: "Find American Heritage Girls troops, Trail Life USA troops, Royal Rangers outposts, Awana clubs, and other Christ-centered youth groups near you.",
  },
  "/enrichment/music-arts": {
    title: "Christian Music & Arts Programs | FindChristianSchools.com",
    description: "Find Christian music lessons, art classes, theater, and creative programs for students of all ages near you.",
  },
  "/enrichment/homeschool": {
    title: "Homeschool Co-ops & Resources | FindChristianSchools.com",
    description: "Find homeschool co-ops, curriculum resources, testing services, and support for home-educating Christian families near you.",
  },
  "/enrichment/submit": {
    title: "List Your Program — Enrichment & Activities | FindChristianSchools.com",
    description: "List your tutoring, class, camp, league, youth group, or homeschool program in the Enrichment & Activities directory. Free basic listings; premium featured listings from $49/year.",
  },
  "/lister-terms": {
    title: "Lister Terms | FindChristianSchools.com",
    description: "Terms for organizations and individuals listing on FindChristianSchools.com, including verification, accuracy, indemnification, and removal policies.",
  },
};

export type RouteMatch =
  | { kind: "static"; path: string }
  | { kind: "enrichment"; slug: string }
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

  const enrichment = path.match(/^\/enrichment\/listing\/([^/]+)$/);
  if (enrichment) return { kind: "enrichment", slug: decodeURIComponent(enrichment[1]) };

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
  ogImage?: string;
  /** JSON-LD objects to inject as structured data (AI search / rich results). */
  jsonLd?: unknown[];
  /** Server-rendered text content injected into #root for non-JS crawlers.
   *  React (createRoot) replaces it on mount for real users. */
  bodyHtml?: string;
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
    if (match.kind === "enrichment") {
      const { getEnrichmentBySlug } = await import("../db");
      const listing = await getEnrichmentBySlug(match.slug);
      if (!listing) return null;
      const loc = [listing.city, listing.state].filter(Boolean).join(", ");
      return {
        title: `${listing.name} - ${loc} | Enrichment & Activities | FindChristianSchools.com`,
        description: `${listing.name} is listed in Enrichment & Activities in ${loc}. View details, contact info, and more.`,
        canonical,
        ogType: "article",
      };
    }
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
        ogImage: post.heroImageUrl || undefined,
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


// ---------------------------------------------------------------------------
// AI-search visibility: structured data + server-rendered content blocks.
// GPTBot / ClaudeBot / PerplexityBot / ChatGPT-Search do not execute JS, so the
// SPA shell alone is invisible to them. resolveSeoContent() builds real text
// content + JSON-LD that injectHead() merges into the served HTML. React uses
// createRoot (not hydration), so injected #root content is replaced on mount.
// ---------------------------------------------------------------------------

export const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin",
  WY: "Wyoming",
};

// Verified against IRS announcements (IR-2026-76 + Oct 2026 Treasury update),
// matching the state directory on /federal-tax-credit. Arizona is NOT a
// participant (governor vetoed the opt-in legislation).
export const FSTC_PARTICIPATING_STATES: string[] = [
  "Alabama", "Alaska", "Arkansas", "Colorado", "Florida", "Georgia", "Idaho",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "West Virginia",
  "Wyoming",
];

// FAQ answers use only facts already verified on /federal-tax-credit.
// The $3,400 joint amount is from Oct 2026 PROPOSED regulations — labeled as such.
export const FSTC_FAQS: { q: string; a: string }[] = [
  {
    q: "What is the Federal Scholarship Tax Credit?",
    a: "The Education Freedom Tax Credit (also called the Federal Scholarship Tax Credit) is a federal program signed into law on July 4, 2025. It lets taxpayers donate to Scholarship Granting Organizations (SGOs) that fund K-12 scholarships, and receive a dollar-for-dollar federal tax credit for their donation. The program takes effect January 1, 2027.",
  },
  {
    q: "Which states participate in the Federal Scholarship Tax Credit?",
    a: "As of October 2026, 30 states have opted in, according to the IRS: Alabama, Alaska, Arkansas, Colorado, Florida, Georgia, Idaho, Indiana, Iowa, Kansas, Kentucky, Louisiana, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, North Carolina, North Dakota, Ohio, Oklahoma, South Carolina, South Dakota, Tennessee, Texas, Utah, Virginia, West Virginia, and Wyoming. Arizona is not participating. Students must live in a participating state to receive a scholarship, though donors can give from any state.",
  },
  {
    q: "How much is the Federal Scholarship Tax Credit?",
    a: "Individual taxpayers can donate up to $1,700 per year to a qualified Scholarship Granting Organization and claim a dollar-for-dollar, nonrefundable federal tax credit. Under the U.S. Treasury's October 2026 proposed regulations (not yet final), married couples filing jointly can donate up to $3,400. The $1,700 figure is the donor's tax credit limit — it is not the scholarship amount a student receives.",
  },
  {
    q: "When does the Federal Scholarship Tax Credit start?",
    a: "The program takes effect January 1, 2027. The U.S. Treasury released proposed regulations on October 1, 2026, and states must submit their lists of qualifying Scholarship Granting Organizations by February 15, 2027.",
  },
  {
    q: "Who qualifies for Federal Scholarship Tax Credit scholarships?",
    a: "Students from households earning up to 300% of the area median gross income who are eligible to enroll in K-12 school and live in a state that has opted into the program. Scholarship funds can be used for tuition, fees, tutoring, books, curriculum materials, special needs services, technology, and transportation.",
  },
];

function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function stripText(s: string, max = 400): string {
  const t = s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

function faqBodyHtml(heading: string, intro: string, faqs: { q: string; a: string }[]): string {
  const parts = [
    `<main><h1>${escapeHtml(heading)}</h1>`,
    `<p>${escapeHtml(intro)}</p>`,
    `<h2>Frequently Asked Questions</h2>`,
  ];
  for (const f of faqs) {
    parts.push(`<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`);
  }
  parts.push(`</main>`);
  return parts.join("");
}

// Small in-memory cache so state/city pages don't re-query the full state
// school list on every crawler hit.
const stateSchoolsCache = new Map<string, { at: number; rows: any[] }>();
const STATE_CACHE_TTL = 10 * 60 * 1000;
async function getStateSchoolsCached(code: string): Promise<any[]> {
  const hit = stateSchoolsCache.get(code);
  if (hit && Date.now() - hit.at < STATE_CACHE_TTL) return hit.rows;
  const { getSchoolsByState } = await import("../db");
  const rows = await getSchoolsByState(code);
  stateSchoolsCache.set(code, { at: Date.now(), rows });
  return rows;
}

function citySlugOf(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Build JSON-LD + crawler-visible body content for a route.
 * Returns empty object for routes without server content. Never throws.
 */
export async function resolveSeoContent(
  match: RouteMatch
): Promise<{ jsonLd?: unknown[]; bodyHtml?: string }> {
  try {
    if (match.kind === "static" && match.path === "/") {
      const org = {
        "@type": "Organization",
        name: "Find Christian Schools",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo-new.jpg`,
        description:
          "A searchable directory of 9,000+ Christian schools across all 50 US states, plus Christian colleges, races, jobs, and events.",
      };
      const website = {
        "@type": "WebSite",
        name: "Find Christian Schools",
        url: `${SITE_URL}/`,
        publisher: { "@type": "Organization", name: "Find Christian Schools" },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?query={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      };
      return {
        jsonLd: [{ "@context": "https://schema.org", "@graph": [org, website] }],
        bodyHtml:
          `<main><h1>Find Christian Schools</h1>` +
          `<p>Find Christian Schools is a free directory of 9,000+ Christian schools across all 50 US states, plus Christian colleges, Christian running races, education jobs, and events. Search by ZIP code, city, state, denomination, and program type to find faith-based education for your family.</p>` +
          `<p><a href="${SITE_URL}/states">Browse Christian schools by state</a> · ` +
          `<a href="${SITE_URL}/federal-tax-credit">Federal Scholarship Tax Credit</a> · ` +
          `<a href="${SITE_URL}/colleges">Christian colleges</a> · ` +
          `<a href="${SITE_URL}/classical-christian-schools">Classical Christian schools</a> · ` +
          `<a href="${SITE_URL}/search">Search Christian schools</a></p></main>`,
      };
    }

    if (match.kind === "static" && match.path === "/federal-tax-credit") {
      return {
        jsonLd: [faqPageJsonLd(FSTC_FAQS)],
        bodyHtml: faqBodyHtml(
          "Federal Scholarship Tax Credit",
          "The Education Freedom Tax Credit (Federal Scholarship Tax Credit) is the first federal tax credit for K-12 education scholarships. It was signed into law on July 4, 2025 and takes effect January 1, 2027. Taxpayers can donate up to $1,700 per year to Scholarship Granting Organizations and receive a dollar-for-dollar federal tax credit.",
          FSTC_FAQS
        ),
      };
    }

    if (match.kind === "static" && match.path === "/enrichment") {
      const { ENRICHMENT_CATEGORIES } = await import("@shared/enrichment");
      const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Enrichment & Activities Categories",
        itemListElement: ENRICHMENT_CATEGORIES.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.label,
          url: `${SITE_URL}/enrichment/${c.slug}`,
        })),
      };
      const crumbs = breadcrumbJsonLd([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Enrichment & Activities", url: `${SITE_URL}/enrichment` },
      ]);
      const links = ENRICHMENT_CATEGORIES.map(
        (c) => `<li><a href="${SITE_URL}/enrichment/${c.slug}">${escapeHtml(c.label)}</a> — ${escapeHtml(c.blurb)}</li>`
      ).join("");
      const bodyHtml =
        `<main><h1>Enrichment &amp; Activities</h1>` +
        `<p>Beyond the classroom: find Christian tutors, enrichment classes and tutoring centers, sports leagues, camps, youth groups like American Heritage Girls and Trail Life USA, music and arts programs, and homeschool co-ops and resources near you. Search by ZIP code for local results.</p>` +
        `<ul>${links}</ul>` +
        `<p><a href="${SITE_URL}/enrichment/submit">List your program</a></p></main>`;
      return { jsonLd: [itemList, crumbs], bodyHtml };
    }

    if (match.kind === "static" && match.path.startsWith("/enrichment/")) {
      const { categoryBySlug, listingPath } = await import("@shared/enrichment");
      const cat = categoryBySlug(match.path.replace("/enrichment/", ""));
      if (cat) {
        const { searchEnrichmentListings } = await import("../db");
        const result: any = await searchEnrichmentListings({ category: cat.key, limit: 10, offset: 0 });
        const rows: any[] = result?.listings ?? [];
        const total: number = result?.total ?? 0;
        const crumbs = breadcrumbJsonLd([
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Enrichment & Activities", url: `${SITE_URL}/enrichment` },
          { name: cat.label, url: `${SITE_URL}/enrichment/${cat.slug}` },
        ]);
        const list = rows.length
          ? `<ul>${rows
              .map(
                (l: any) =>
                  `<li><a href="${SITE_URL}${listingPath(l.slug)}">${escapeHtml(l.name)}</a> — ${escapeHtml(l.city)}, ${escapeHtml(l.state)}</li>`
              )
              .join("")}</ul>`
          : "";
        const bodyHtml =
          `<main><h1>${escapeHtml(cat.label)}</h1>` +
          `<p>${escapeHtml(cat.blurb)}</p>` +
          `<p>Find Christian Schools lists ${total} ${escapeHtml(cat.label.toLowerCase())} listing${total === 1 ? "" : "s"} in the Enrichment &amp; Activities directory. Search by ZIP code for local results near you.</p>` +
          list +
          `<p><a href="${SITE_URL}/enrichment/submit">List your program</a></p></main>`;
        return { jsonLd: [crumbs], bodyHtml };
      }
    }

    if (match.kind === "enrichment") {
      const { getEnrichmentBySlug } = await import("../db");
      const { categoryByKey, verificationBadgeLabel } = await import("@shared/enrichment");
      const listing: any = await getEnrichmentBySlug(match.slug);
      if (!listing) return {};
      const url = `${SITE_URL}/enrichment/listing/${listing.slug}`;
      const cat = categoryByKey(listing.category);
      const loc = [listing.city, listing.state].filter(Boolean).join(", ");
      const desc = listing.description ? stripText(String(listing.description)) : "";
      const lat = Number(listing.latitude);
      const lng = Number(listing.longitude);
      // LocalBusiness for individuals/businesses; Organization for orgs/camps.
      const ld: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": listing.listerType === "organization" ? "Organization" : "LocalBusiness",
        name: listing.name,
        url,
        description:
          desc ||
          `${listing.name} is a ${cat ? cat.label.toLowerCase() : "Christian enrichment"} listing in ${loc}.`,
        address: {
          "@type": "PostalAddress",
          ...(listing.address ? { streetAddress: listing.address } : {}),
          addressLocality: listing.city,
          addressRegion: listing.stateCode,
          ...(listing.zip ? { postalCode: listing.zip } : {}),
          addressCountry: "US",
        },
      };
      if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
        ld.geo = { "@type": "GeoCoordinates", latitude: lat, longitude: lng };
      }
      if (listing.phone) ld.telephone = listing.phone;
      if (listing.website) ld.sameAs = listing.website;
      if (desc) ld.description = desc;
      const crumbs = breadcrumbJsonLd([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Enrichment & Activities", url: `${SITE_URL}/enrichment` },
        ...(cat ? [{ name: cat.label, url: `${SITE_URL}/enrichment/${cat.slug}` }] : []),
        { name: listing.name, url },
      ]);
      const badge =
        listing.verificationStatus === "approved"
          ? verificationBadgeLabel(listing.verificationType, listing.verifiedAt)
          : null;
      const bodyHtml =
        `<main><h1>${escapeHtml(listing.name)}</h1>` +
        `<p>${escapeHtml(listing.name)} is a ${escapeHtml(cat ? cat.label.toLowerCase() : "Christian enrichment")} listing in ${escapeHtml(loc)}.${listing.subcategory ? ` ${escapeHtml(listing.subcategory)}.` : ""}</p>` +
        (desc ? `<p>${escapeHtml(desc)}</p>` : "") +
        (badge ? `<p>${escapeHtml(badge)}</p>` : "") +
        `<p>Listing is not an endorsement or recommendation. FindChristianSchools verifies documents only as described. Parents should do their own due diligence.</p>` +
        `<p><a href="${SITE_URL}/enrichment">More Enrichment &amp; Activities listings</a></p></main>`;
      return { jsonLd: [ld, crumbs], bodyHtml };
    }

    if (match.kind === "school") {
      const { getSchoolBySlug } = await import("../db");
      const school: any = await getSchoolBySlug(match.slug);
      if (!school) return {};
      const url = `${SITE_URL}/school/${school.slug}`;
      const stateName = US_STATE_NAMES[school.stateCode] || school.state;
      const loc = [school.city, school.state].filter(Boolean).join(", ");
      const grades =
        school.gradeStart && school.gradeEnd
          ? ` Grades ${school.gradeStart}–${school.gradeEnd}.`
          : "";
      const denom = school.denomination ? ` ${school.denomination}.` : "";
      const desc = school.description ? stripText(String(school.description)) : "";
      const lat = Number(school.latitude);
      const lng = Number(school.longitude);
      const schoolLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "School",
        name: school.name,
        url,
        description:
          desc ||
          `${school.name} is a Christian school in ${loc}.${grades}${denom}`,
        address: {
          "@type": "PostalAddress",
          ...(school.address ? { streetAddress: school.address } : {}),
          addressLocality: school.city,
          addressRegion: school.stateCode,
          ...(school.zip ? { postalCode: school.zip } : {}),
          addressCountry: "US",
        },
      };
      if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
        schoolLd.geo = { "@type": "GeoCoordinates", latitude: lat, longitude: lng };
      }
      if (school.phone) schoolLd.telephone = school.phone;
      if (school.website) schoolLd.sameAs = school.website;
      if (desc) schoolLd.description = desc;
      const crumbs = breadcrumbJsonLd([
        { name: "Home", url: `${SITE_URL}/` },
        { name: `Christian Schools in ${stateName}`, url: `${SITE_URL}/state/${school.stateCode}` },
        { name: school.name, url },
      ]);
      const bodyHtml =
        `<main><h1>${escapeHtml(school.name)}</h1>` +
        `<p>${escapeHtml(school.name)} is a Christian school in ${escapeHtml(loc)}.${escapeHtml(grades)}${escapeHtml(denom)}</p>` +
        (desc ? `<p>${escapeHtml(desc)}</p>` : "") +
        `<p><a href="${SITE_URL}/state/${school.stateCode}">More Christian schools in ${escapeHtml(stateName)}</a></p></main>`;
      return { jsonLd: [schoolLd, crumbs], bodyHtml };
    }

    if (match.kind === "college") {
      const { getCollegeBySlug } = await import("../db");
      const college: any = await getCollegeBySlug(match.slug);
      if (!college) return {};
      const url = `${SITE_URL}/college/${college.slug}`;
      const loc = [college.city, college.state].filter(Boolean).join(", ");
      const denom = college.denomination ? ` (${college.denomination})` : "";
      const collegeLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        name: college.name,
        url,
        description: `${college.name} is a Christian college in ${loc}${denom}.`,
        address: {
          "@type": "PostalAddress",
          ...(college.address ? { streetAddress: college.address } : {}),
          addressLocality: college.city,
          addressRegion: college.stateCode,
          ...(college.zip ? { postalCode: college.zip } : {}),
          addressCountry: "US",
        },
      };
      if (college.phone) collegeLd.telephone = college.phone;
      if (college.website) collegeLd.sameAs = college.website;
      const crumbs = breadcrumbJsonLd([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Christian Colleges", url: `${SITE_URL}/colleges` },
        { name: college.name, url },
      ]);
      const bodyHtml =
        `<main><h1>${escapeHtml(college.name)}</h1>` +
        `<p>${escapeHtml(college.name)} is a Christian college in ${escapeHtml(loc)}${escapeHtml(denom)}.</p>` +
        `<p><a href="${SITE_URL}/colleges">Browse Christian colleges</a></p></main>`;
      return { jsonLd: [collegeLd, crumbs], bodyHtml };
    }

    if (match.kind === "state") {
      const stateName = US_STATE_NAMES[match.code] || match.code;
      const rows = await getStateSchoolsCached(match.code);
      const count = rows.length;
      const top = rows.slice(0, 10);
      const crumbs = breadcrumbJsonLd([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Browse by State", url: `${SITE_URL}/states` },
        { name: `Christian Schools in ${stateName}`, url: `${SITE_URL}/state/${match.code}` },
      ]);
      const fstcNote = FSTC_PARTICIPATING_STATES.includes(stateName)
        ? `<p>${escapeHtml(stateName)} is one of 30 states participating in the <a href="${SITE_URL}/federal-tax-credit">Federal Scholarship Tax Credit</a>, which takes effect January 1, 2027.</p>`
        : "";
      const list = top.length
        ? `<ul>${top
            .map(
              (s: any) =>
                `<li><a href="${SITE_URL}/school/${escapeHtml(s.slug)}">${escapeHtml(s.name)}</a> — ${escapeHtml(s.city)}, ${escapeHtml(stateName)}</li>`
            )
            .join("")}</ul>`
        : "";
      const bodyHtml =
        `<main><h1>Christian Schools in ${escapeHtml(stateName)}</h1>` +
        `<p>Find Christian Schools lists ${count} Christian school${count === 1 ? "" : "s"} in ${escapeHtml(stateName)}. Search by city, denomination, grade level, and program type to compare faith-based education options for your family.</p>` +
        fstcNote +
        list +
        `</main>`;
      return { jsonLd: [crumbs], bodyHtml };
    }

    if (match.kind === "city") {
      const stateName = US_STATE_NAMES[match.code] || match.code;
      const cityName = match.city
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const rows = await getStateSchoolsCached(match.code);
      const inCity = rows.filter((s: any) => citySlugOf(String(s.city)) === match.city.toLowerCase());
      const top = inCity.slice(0, 10);
      const crumbs = breadcrumbJsonLd([
        { name: "Home", url: `${SITE_URL}/` },
        { name: `Christian Schools in ${stateName}`, url: `${SITE_URL}/state/${match.code}` },
        { name: `Christian Schools in ${cityName}, ${match.code}`, url: `${SITE_URL}/city/${match.code}/${match.city}` },
      ]);
      const countSentence = inCity.length
        ? `Find Christian Schools lists ${inCity.length} Christian school${inCity.length === 1 ? "" : "s"} in ${cityName}.`
        : `Find Christian schools in and around ${cityName}.`;
      const list = top.length
        ? `<ul>${top
            .map(
              (s: any) =>
                `<li><a href="${SITE_URL}/school/${escapeHtml(s.slug)}">${escapeHtml(s.name)}</a> — ${escapeHtml(s.city)}, ${escapeHtml(stateName)}</li>`
            )
            .join("")}</ul>`
        : "";
      const bodyHtml =
        `<main><h1>Christian Schools in ${escapeHtml(cityName)}, ${escapeHtml(match.code)}</h1>` +
        `<p>${escapeHtml(countSentence)} Compare denomination, grade levels, and program types to find the right faith-based education for your family.</p>` +
        list +
        `<p><a href="${SITE_URL}/state/${match.code}">All Christian schools in ${escapeHtml(stateName)}</a></p></main>`;
      return { jsonLd: [crumbs], bodyHtml };
    }
  } catch (e) {
    console.error("[seoHead] resolveSeoContent failed:", e);
  }
  return {};
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

  // Add/replace og:image if provided
  if (meta.ogImage) {
    const imgTag = `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`;
    if (/<meta property="og:image"/i.test(out)) {
      out = out.replace(
        /<meta property="og:image" content=".*?"\s*\/?>/i,
        imgTag
      );
    } else {
      out = out.replace(
        /<meta property="og:url" content=".*?"\s*\/?>/i,
        `$&\n    ${imgTag}`
      );
    }
    // Also add twitter:image for Twitter cards
    const twitterTag = `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />`;
    if (/<meta name="twitter:image"/i.test(out)) {
      out = out.replace(
        /<meta name="twitter:image" content=".*?"\s*\/?>/i,
        twitterTag
      );
    } else {
      out = out.replace(
        /<meta property="og:image" content=".*?"\s*\/?>/i,
        `$&\n    ${twitterTag}`
      );
    }
  }

  // JSON-LD structured data (AI search + rich results)
  if (meta.jsonLd && meta.jsonLd.length) {
    const tags = meta.jsonLd
      .map(
        (obj) =>
          `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`
      )
      .join("\n    ");
    if (/<\/head>/i.test(out)) {
      out = out.replace(/<\/head>/i, `    ${tags}\n  </head>`);
    }
  }

  // Server-rendered body content for non-JS crawlers. React createRoot
  // replaces #root contents on mount, so real users never see this block.
  if (meta.bodyHtml) {
    if (/<div id="root"><\/div>/.test(out)) {
      out = out.replace(/<div id="root"><\/div>/, `<div id="root">${meta.bodyHtml}</div>`);
    } else if (/<div id="root">/.test(out)) {
      out = out.replace(/<div id="root">/, `<div id="root">${meta.bodyHtml}`);
    }
  }

  return out;
}
