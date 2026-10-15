/**
 * Christian education news aggregation.
 *
 * Fetches the verified RSS/Atom feeds on the curated allowlist below,
 * deduplicates by original article URL, and stores publisher-provided
 * excerpts (the feed's own description, truncated) in the `news_items`
 * table. Every stored item links back to the original article — we never
 * republish full content.
 *
 * CONTENT RULE (zero AI-generated news, by construction): this pipeline
 * contains NO language model and no generative step of any kind. Titles,
 * summaries, dates, and URLs are stored and displayed exactly as the
 * publisher's feed provides them. Relevance, topic, and faith-flag
 * decisions are deterministic keyword matching only (see the keyword
 * sets below). Nothing here writes, rewrites, or paraphrases news copy.
 *
 * FAITH-ALIGNMENT GUARDRAIL: sources sit on a curated allowlist (the
 * site owner holds final veto over the list). On top of that, a
 * deterministic flag-word screen (FLAG_TERMS) holds any item whose
 * framing may be hostile to Christian schooling, religious liberty, or
 * parental rights in education OUT of the public feed: it is stored
 * with reviewStatus = 'held' and isActive = false, appears in the
 * admin review queue (Admin -> News Review), and is named in the ingest
 * run report. A human approves or rejects every held item. Items that
 * pass appear automatically.
 *
 * FEED HEALTH: every run reports per-feed status (responded / items
 * yielded / inserted / held / error). A feed that fails, goes silent,
 * or starts yielding nothing is visible in the run report the same day
 * so a defaced or abandoned source gets caught fast.
 *
 * THUMBNAILS (rights rule, Dave 2026-10-15): we never store or display
 * publisher images — we have no rights to them. Every news card uses
 * our own generated topic illustration (client/public/news-art/,
 * chosen by the item's topic; see client/src/components/NewsThumb.tsx).
 * imageUrl therefore stays NULL in the database, and each refresh
 * clears any publisher URLs stored before this rule.
 *
 * RETENTION: items older than 90 days are pruned at the end of each run.
 *
 * Auto-update: a Muse cron POSTs daily to the protected endpoint
 * /api/cron/news-refresh (see server/newsRefresh.ts), and
 * `refreshNewsIfStale()` (server/db.ts) tops up on /news page loads when
 * the last successful run is older than 12 hours. If feeds fail, the
 * site keeps showing the last good items with their real dates.
 */
import Parser from "rss-parser";
import { getDb } from "./db";
import { newsItems, newsFetchLog } from "../drizzle/schema";
import { sql } from "drizzle-orm";

const parser = new Parser({
  timeout: 20000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; FCSNewsBot/1.0)" },
  customFields: {
    item: [
      ["media:thumbnail", "mediaThumbnail"],
      ["media:content", "mediaContent"],
      ["media:group", "mediaGroup"],
    ],
  },
});

export type NewsCategory = "national" | "state" | "policy" | "school_choice" | "curriculum";

export type NewsTopic =
  | "school_choice_policy"
  | "christian_schools"
  | "homeschooling"
  | "funding_tax_credit"
  | "accreditation"
  | "faith_culture"
  | "general";

export const NEWS_TOPICS: { value: NewsTopic; label: string }[] = [
  { value: "school_choice_policy", label: "School Choice & Policy" },
  { value: "christian_schools", label: "Christian Schools" },
  { value: "homeschooling", label: "Homeschooling" },
  { value: "funding_tax_credit", label: "Funding & the Tax Credit" },
  { value: "accreditation", label: "Accreditation & Standards" },
  { value: "faith_culture", label: "Faith & Culture in Education" },
  { value: "general", label: "More Education News" },
];

interface NewsFeedConfig {
  name: string;
  url: string;
  defaultCategory: NewsCategory;
  stateCode?: string;
  /** Only keep items whose title/summary matches one of these (for general-news feeds). */
  filterKeywords?: string[];
  maxItems?: number;
}

/** Topic filter so general Christian-news feeds only contribute education items. */
const EDUCATION_KEYWORDS = [
  "school", "schools", "education", "teacher", "teachers", "student", "students",
  "classroom", "curriculum", "homeschool", "charter school", "voucher", "principal",
  "superintendent", "college", "university", "literacy", "reading", "math",
  "kindergarten", "preschool", "graduation", "diploma", "textbook", "lesson",
  "tutoring", "scholarship", "school board", "department of education", "pell grant",
  "school choice",
];

const SCHOOL_CHOICE_KEYWORDS = [
  "school choice", "voucher", "education savings account", "esa program",
  "tax-credit scholarship", "tax credit scholarship", "education freedom",
];

const POLICY_KEYWORDS = [
  "legislation", "bill", "lawmaker", "department of education", "supreme court",
  "federal", "congress", "state board", "governor signs",
];

const CURRICULUM_KEYWORDS = [
  "curriculum", "textbook", "lesson plan", "reading program", "math curriculum", "phonics",
];

/**
 * Deterministic topic buckets for the /news page, derived from the same
 * keyword-matching approach as the relevance filter. First match wins,
 * most specific buckets first. Anything unmatched lands in "general".
 */
const TOPIC_KEYWORDS: { topic: NewsTopic; keywords: string[] }[] = [
  {
    topic: "accreditation",
    keywords: [
      "accredit", "academic standards", "state standards", "assessment",
      "accountability", "teacher certification", "licensure", "accreditation",
    ],
  },
  {
    topic: "funding_tax_credit",
    keywords: [
      "tax credit", "tax-credit", "federal scholarship tax credit", "529 plan",
      "treasury", "irs ", "appropriation", "funding formula", "education funding",
      "school funding", "federal funding", "per-pupil funding",
    ],
  },
  {
    topic: "homeschooling",
    keywords: [
      "homeschool", "home school", "homeschooler", "home education",
      "homeschooling", "home-educated",
    ],
  },
  {
    topic: "school_choice_policy",
    keywords: [
      ...SCHOOL_CHOICE_KEYWORDS,
      "charter school", "parental rights", "education bill", "school board",
      "open enrollment", "magnet school", "education policy", "governor signs",
      "supreme court", "department of education",
    ],
  },
  {
    topic: "christian_schools",
    keywords: [
      "christian school", "christian academy", "catholic school", "private school",
      "religious school", "faith-based school", "lutheran school", "acsi",
      "christian college", "christian education", "biblical worldview",
    ],
  },
  {
    topic: "faith_culture",
    keywords: [
      "religious liberty", "religious freedom", "first amendment", "title ix",
      "school prayer", "faith and education", "worldview", "church and state",
    ],
  },
];

/**
 * Faith-alignment flag screen (deterministic). An item whose title or
 * summary contains any of these terms is HELD for human review instead
 * of auto-publishing: the phrasing signals coverage that may frame
 * Christian schooling, religious liberty, or parental rights hostilely,
 * and that judgment stays human. This is a review trigger, not a ban —
 * an editor can approve a held item in Admin -> News Review.
 */
export const FLAG_TERMS = [
  "indoctrinat",
  "christian nationalis",
  "religious extremist",
  "religious extremism",
  "theocratic",
  "theocracy",
  "bible-thumping",
  "bible thumping",
  "religious right",
  "anti-lgbtq",
  "anti-gay",
  "book ban",
  "banned books",
  "extremist curriculum",
  "white christian",
  "cult",
];

export function flagScreen(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  return FLAG_TERMS.filter((t) => text.includes(t));
}

const STATE_NAMES: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO",
  montana: "MT", nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND",
  ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI",
  "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT",
  vermont: "VT", virginia: "VA", washington: "WA", "west virginia": "WV",
  wisconsin: "WI", wyoming: "WY", "district of columbia": "DC",
};

/**
 * Curated source allowlist — every feed verified live before inclusion.
 * The site owner holds final veto over this list. Dropped after
 * verification attempts (Oct 2026): U.S. Dept. of Education and IRS
 * (their servers refuse automated feed fetches), Education Week (no
 * public RSS endpoint), ACSI (no public RSS feed published).
 */
export const NEWS_FEEDS: NewsFeedConfig[] = [
  { name: "EdChoice", url: "https://www.edchoice.org/feed/", defaultCategory: "school_choice", maxItems: 15 },
  { name: "Herzog Foundation", url: "https://herzogfoundation.com/feed/", defaultCategory: "national", maxItems: 15 },
  { name: "ExcelinEd", url: "https://excelined.org/feed/", defaultCategory: "policy", maxItems: 15 },
  { name: "Step Up For Students", url: "https://www.stepupforstudents.org/feed/", defaultCategory: "school_choice", maxItems: 10 },
  { name: "Chalkbeat", url: "https://www.chalkbeat.org/arc/outboundfeeds/rss/", defaultCategory: "national", maxItems: 15 },
  { name: "The 74", url: "https://www.the74million.org/feed/", defaultCategory: "national", maxItems: 15 },
  { name: "Christian Post", url: "https://www.christianpost.com/rss/", defaultCategory: "national", filterKeywords: EDUCATION_KEYWORDS, maxItems: 30 },
  { name: "Christianity Today", url: "https://www.christianitytoday.com/rss/", defaultCategory: "national", filterKeywords: EDUCATION_KEYWORDS, maxItems: 30 },
  { name: "WORLD News Group", url: "https://wng.org/rss.xml", defaultCategory: "national", filterKeywords: EDUCATION_KEYWORDS, maxItems: 30 },
];

/** Strip HTML tags and decode common entities for a plain-text summary. */
export function plainText(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Publisher-provided excerpt only — the feed's own description text,
 * truncated at a word boundary to at most ~200 characters. Never
 * rewritten, never extended, never paraphrased (see content rule above).
 */
export function makeSummary(description: string): string {
  const text = plainText(description);
  if (text.length <= 200) return text;
  const cut = text.slice(0, 200);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 110 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export function slugify(title: string, url: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "news";
  // Deterministic short hash of the URL guarantees slug uniqueness
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
  return `${base}-${h.toString(36)}`;
}

export function matchesAny(haystack: string, keywords: string[]): boolean {
  const lower = haystack.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

export function detectStateCode(title: string, summary: string): string | null {
  const text = ` ${title} ${summary} `.toLowerCase().replace(/[^a-z ]/g, " ");
  // Earliest mention wins ("Missouri ... Kansas City ..." -> MO, not KS).
  // A state name followed by "city" ("Kansas City") doesn't count on its own.
  let best: { code: string; pos: number } | null = null;
  for (const [name, code] of Object.entries(STATE_NAMES)) {
    const re = new RegExp(`\\b${name.replace(/ /g, "\\s+")}\\b(?!\\s+city\\b)`, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (!best || m.index < best.pos) best = { code, pos: m.index };
      break; // earliest occurrence of this state is enough
    }
  }
  return best?.code ?? null;
}

export function classifyCategory(title: string, summary: string, fallback: NewsCategory): NewsCategory {
  const text = `${title} ${summary}`;
  if (matchesAny(text, SCHOOL_CHOICE_KEYWORDS)) return "school_choice";
  if (matchesAny(text, POLICY_KEYWORDS)) return "policy";
  if (matchesAny(text, CURRICULUM_KEYWORDS)) return "curriculum";
  if (detectStateCode(title, summary)) return "state";
  return fallback;
}

export function classifyTopic(title: string, summary: string): NewsTopic {
  const text = `${title} ${summary}`;
  for (const bucket of TOPIC_KEYWORDS) {
    if (matchesAny(text, bucket.keywords)) return bucket.topic;
  }
  return "general";
}

export interface HeldItem {
  title: string;
  sourceName: string;
  sourceUrl: string;
  flags: string[];
}

export interface FetchResult {
  feed: string;
  /** Items the feed returned (before site-side filtering). */
  fetched: number;
  /** New items published automatically this run. */
  inserted: number;
  /** New items held for human review by the flag screen this run. */
  held: number;
  error?: string;
}

export interface NewsRunReport {
  results: FetchResult[];
  heldItems: HeldItem[];
  totalFetched: number;
  totalInserted: number;
  totalHeld: number;
  pruned: number;
  /** Feeds that errored or yielded zero items — the same-day warning list. */
  unhealthyFeeds: string[];
  /** Set when writing this run's news_fetch_log row failed. Log failures must surface here, never vanish. */
  logError?: string;
}

/** Insert parsed feed items for one feed config. Shared by URL and string parsing. */
async function storeFeedItems(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  existing: Set<string>,
  feed: NewsFeedConfig,
  items: Parser.Item[]
): Promise<{ fetched: number; inserted: number; held: number; heldItems: HeldItem[] }> {
  const sliced = items.slice(0, feed.maxItems ?? 15);
  let inserted = 0;
  let held = 0;
  const heldItems: HeldItem[] = [];
  for (const item of sliced) {
    const link = (item.link || "").trim();
    const title = (item.title || "").trim();
    if (!link || !title || existing.has(link)) continue;

    const summaryText = makeSummary(item.contentSnippet || item.content || item.summary || "");
    // Education filter for general-news feeds
    if (feed.filterKeywords && !matchesAny(`${title} ${summaryText}`, feed.filterKeywords)) continue;

    const category = classifyCategory(title, summaryText, feed.defaultCategory);
    const topic = classifyTopic(title, summaryText);
    const stateCode = feed.stateCode || detectStateCode(title, summaryText);

    const pubDate = item.isoDate || item.pubDate;
    const publishedAt = pubDate ? new Date(pubDate) : new Date();
    if (isNaN(publishedAt.getTime())) continue;

    // Faith-alignment flag screen: held items are stored inactive for a
    // human decision, never auto-published.
    const flags = flagScreen(title, summaryText);
    const isHeld = flags.length > 0;

    // Rights rule (Dave, 2026-10-15): publisher images are never stored
    // or displayed. Cards render our own generated topic illustration
    // client-side, so imageUrl stays null.
    const imageUrl: string | null = null;

    try {
      await db.insert(newsItems).values({
        title: title.slice(0, 255),
        slug: slugify(title, link),
        sourceName: feed.name,
        sourceUrl: link,
        summary: summaryText || null,
        category,
        topic,
        stateCode,
        publishedAt,
        imageUrl,
        isActive: !isHeld,
        reviewStatus: isHeld ? "held" : "published",
        holdReason: isHeld ? `Flag terms: ${flags.join(", ")}` : null,
      });
      existing.add(link);
      if (isHeld) {
        held++;
        heldItems.push({ title: title.slice(0, 255), sourceName: feed.name, sourceUrl: link, flags });
      } else {
        inserted++;
      }
    } catch (e: unknown) {
      // Duplicate slug/url race — skip quietly
      if (!(e instanceof Error && /Duplicate entry/i.test(e.message))) {
        console.error(`[news] insert failed for ${link}:`, e);
      }
    }
  }
  return { fetched: sliced.length, inserted, held, heldItems };
}

/**
 * Parse feed XML from a string and store items. Used by the seed script
 * (which downloads via curl) and anywhere parseURL is unavailable.
 */
export async function parseAndStoreFeedXml(
  feedName: string,
  xml: string
): Promise<{ fetched: number; inserted: number; held: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const feed = NEWS_FEEDS.find((f) => f.name === feedName);
  if (!feed) throw new Error(`Unknown feed: ${feedName}`);
  const parsed = await parser.parseString(xml);
  const existing = new Set(
    (await db.select({ sourceUrl: newsItems.sourceUrl }).from(newsItems).catch(() => []))
      .map((r) => r.sourceUrl)
  );
  const { fetched, inserted, held } = await storeFeedItems(db, existing, feed, parsed.items || []);
  return { fetched, inserted, held };
}

const RETENTION_DAYS = 90;

/**
 * Fetch every configured feed, deduplicate by original URL, insert new
 * items, hold flagged items for review, prune items older than 90 days.
 * Safe to run concurrently — DB unique constraint on sourceUrl is the
 * final guard. Returns the full run report (published / held / feed
 * health) used by the daily cron and the admin refresh.
 */
export async function fetchAllNewsFeeds(): Promise<NewsRunReport> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  let logId: number | null = null;
  let logError: string | undefined;
  try {
    const logResult = await db.insert(newsFetchLog).values({ status: "running" });
    logId = Number((logResult[0] as unknown as { insertId: number }).insertId) || null;
  } catch (e) {
    // Never swallow this: a broken news_fetch_log silently disables the
    // /news "Last updated" line (news.meta) and the staleness check.
    logError = `news_fetch_log insert failed: ${e instanceof Error ? e.message : String(e)}`;
    console.error(`[news] ${logError}`);
    logId = null;
  }

  const results: FetchResult[] = [];
  const heldItems: HeldItem[] = [];
  let totalFetched = 0;
  let totalInserted = 0;
  let totalHeld = 0;

  // Existing URLs for dedup (single query up front)
  const existing = new Set(
    (await db.select({ sourceUrl: newsItems.sourceUrl }).from(newsItems).catch(() => []))
      .map((r) => r.sourceUrl)
  );

  for (const feed of NEWS_FEEDS) {
    const result: FetchResult = { feed: feed.name, fetched: 0, inserted: 0, held: 0 };
    try {
      const parsed = await parser.parseURL(feed.url);
      const stored = await storeFeedItems(db, existing, feed, parsed.items || []);
      result.fetched = stored.fetched;
      result.inserted = stored.inserted;
      result.held = stored.held;
      heldItems.push(...stored.heldItems);
      totalFetched += stored.fetched;
      totalInserted += stored.inserted;
      totalHeld += stored.held;
    } catch (e) {
      result.error = e instanceof Error ? e.message : String(e);
      console.error(`[news] feed failed (${feed.name}):`, result.error);
    }
    results.push(result);
  }

  // Retention: keep the newest ~90 days only.
  let pruned = 0;
  try {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const del = await db
      .delete(newsItems)
      .where(sql`${newsItems.publishedAt} < ${cutoff}`);
    pruned = Number((del[0] as unknown as { affectedRows?: number }).affectedRows ?? 0) || 0;
  } catch (e) {
    console.error("[news] retention prune failed:", e);
  }

  // Rights rule (Dave, 2026-10-15): clear any publisher image URLs
  // stored before the rule. Idempotent — a no-op once the table is
  // clean, because ingest no longer writes imageUrl.
  try {
    await db
      .update(newsItems)
      .set({ imageUrl: null })
      .where(sql`${newsItems.imageUrl} IS NOT NULL`);
  } catch (e) {
    console.error("[news] imageUrl clear-out failed:", e);
  }

  const unhealthyFeeds = results
    .filter((r) => r.error || r.fetched === 0)
    .map((r) => (r.error ? `${r.feed} (error: ${r.error})` : `${r.feed} (yielded 0 items)`));

  if (logId) {
    try {
      await db
        .update(newsFetchLog)
        .set({
          finishedAt: sql`NOW()`,
          itemsFetched: totalFetched,
          itemsInserted: totalInserted,
          status: unhealthyFeeds.length === NEWS_FEEDS.length ? "error" : "success",
          errorMessage: unhealthyFeeds.length
            ? `Unhealthy feeds: ${unhealthyFeeds.join("; ")}`
            : null,
        })
        .where(sql`${newsFetchLog.id} = ${logId}`);
    } catch (e) {
      const msg = `news_fetch_log update failed: ${e instanceof Error ? e.message : String(e)}`;
      logError = logError ? `${logError}; ${msg}` : msg;
      console.error(`[news] ${msg}`);
    }
  }

  return { results, heldItems, totalFetched, totalInserted, totalHeld, pruned, unhealthyFeeds, logError };
}
