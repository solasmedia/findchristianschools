/**
 * Christian education news aggregation.
 *
 * Fetches the verified RSS/Atom feeds listed in news-sources.md, deduplicates
 * by original article URL, and stores neutral summaries (the feed's own
 * description, truncated) in the `news_items` table. Every stored item links
 * back to the original article — we never republish full content.
 *
 * Auto-update: `refreshNewsIfStale()` (defined in server/db.ts) is called on
 * every /news page load and triggers this fetcher in the background when the
 * last successful run is older than 12 hours. No cron needed.
 */
import Parser from "rss-parser";
import { getDb } from "./db";
import { newsItems, newsFetchLog } from "../drizzle/schema";
import { sql } from "drizzle-orm";

const parser = new Parser({ timeout: 20000 });

export type NewsCategory = "national" | "state" | "policy" | "school_choice" | "curriculum";

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

export const NEWS_FEEDS: NewsFeedConfig[] = [
  { name: "EdChoice", url: "https://www.edchoice.org/feed/", defaultCategory: "school_choice", maxItems: 15 },
  { name: "Herzog Foundation", url: "https://herzogfoundation.com/feed/", defaultCategory: "national", maxItems: 15 },
  { name: "ExcelinEd", url: "https://excelined.org/feed/", defaultCategory: "policy", maxItems: 15 },
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
 * Neutral 2-3 sentence summary from the feed's own description.
 * No editorializing — just the source's text, truncated at a word boundary.
 */
export function makeSummary(description: string): string {
  const text = plainText(description);
  if (text.length <= 220) return text;
  const cut = text.slice(0, 220);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trim() + "…";
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

export function extractImageUrl(item: Parser.Item): string | null {
  const enc = (item as { enclosure?: { url?: string; type?: string } }).enclosure;
  if (enc?.url && /\.(jpe?g|png|webp|gif)(\?|$)/i.test(enc.url)) return enc.url;
  return null;
}

export interface FetchResult {
  feed: string;
  fetched: number;
  inserted: number;
  error?: string;
}

/** Insert parsed feed items for one feed config. Shared by URL and string parsing. */
async function storeFeedItems(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  existing: Set<string>,
  feed: NewsFeedConfig,
  items: Parser.Item[]
): Promise<{ fetched: number; inserted: number }> {
  const sliced = items.slice(0, feed.maxItems ?? 15);
  let inserted = 0;
  for (const item of sliced) {
    const link = (item.link || "").trim();
    const title = (item.title || "").trim();
    if (!link || !title || existing.has(link)) continue;

    const summaryText = makeSummary(item.contentSnippet || item.content || item.summary || "");
    // Education filter for general-news feeds
    if (feed.filterKeywords && !matchesAny(`${title} ${summaryText}`, feed.filterKeywords)) continue;

    const category = classifyCategory(title, summaryText, feed.defaultCategory);
    const stateCode = feed.stateCode || detectStateCode(title, summaryText);

    const pubDate = item.isoDate || item.pubDate;
    const publishedAt = pubDate ? new Date(pubDate) : new Date();
    if (isNaN(publishedAt.getTime())) continue;

    try {
      await db.insert(newsItems).values({
        title: title.slice(0, 255),
        slug: slugify(title, link),
        sourceName: feed.name,
        sourceUrl: link,
        summary: summaryText || null,
        category,
        stateCode,
        publishedAt,
        imageUrl: extractImageUrl(item),
        isActive: true,
      });
      existing.add(link);
      inserted++;
    } catch (e: unknown) {
      // Duplicate slug/url race — skip quietly
      if (!(e instanceof Error && /Duplicate entry/i.test(e.message))) {
        console.error(`[news] insert failed for ${link}:`, e);
      }
    }
  }
  return { fetched: sliced.length, inserted };
}

/**
 * Parse feed XML from a string and store items. Used by the seed script
 * (which downloads via curl) and anywhere parseURL is unavailable.
 */
export async function parseAndStoreFeedXml(
  feedName: string,
  xml: string
): Promise<{ fetched: number; inserted: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const feed = NEWS_FEEDS.find((f) => f.name === feedName);
  if (!feed) throw new Error(`Unknown feed: ${feedName}`);
  const parsed = await parser.parseString(xml);
  const existing = new Set(
    (await db.select({ sourceUrl: newsItems.sourceUrl }).from(newsItems).catch(() => []))
      .map((r) => r.sourceUrl)
  );
  return storeFeedItems(db, existing, feed, parsed.items || []);
}

/**
 * Fetch every configured feed, deduplicate by original URL, insert new items.
 * Safe to run concurrently — DB unique constraint on sourceUrl is the final guard.
 */
export async function fetchAllNewsFeeds(): Promise<FetchResult[]> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  let logId: number | null = null;
  try {
    const logResult = await db.insert(newsFetchLog).values({ status: "running" });
    logId = Number((logResult[0] as unknown as { insertId: number }).insertId) || null;
  } catch {
    logId = null;
  }

  const results: FetchResult[] = [];
  let totalFetched = 0;
  let totalInserted = 0;

  // Existing URLs for dedup (single query up front)
  const existing = new Set(
    (await db.select({ sourceUrl: newsItems.sourceUrl }).from(newsItems).catch(() => []))
      .map((r) => r.sourceUrl)
  );

  for (const feed of NEWS_FEEDS) {
    const result: FetchResult = { feed: feed.name, fetched: 0, inserted: 0 };
    try {
      const parsed = await parser.parseURL(feed.url);
      const { fetched, inserted } = await storeFeedItems(db, existing, feed, parsed.items || []);
      result.fetched = fetched;
      result.inserted = inserted;
      totalFetched += fetched;
      totalInserted += inserted;
    } catch (e) {
      result.error = e instanceof Error ? e.message : String(e);
      console.error(`[news] feed failed (${feed.name}):`, result.error);
    }
    results.push(result);
  }

  if (logId) {
    await db
      .update(newsFetchLog)
      .set({
        finishedAt: sql`NOW()`,
        itemsFetched: totalFetched,
        itemsInserted: totalInserted,
        status: "success",
      })
      .where(sql`${newsFetchLog.id} = ${logId}`)
      .catch(() => {});
  }

  return results;
}
