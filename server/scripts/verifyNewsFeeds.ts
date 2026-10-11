/**
 * Real-data verification for the news fetcher (no DB required).
 * Downloads each verified feed via curl (sandbox-safe), parses with rss-parser,
 * and runs the real classification/summary/slug pipeline over the items.
 * Run: npx tsx server/scripts/verifyNewsFeeds.ts
 */
import { execFileSync } from "child_process";
import Parser from "rss-parser";
import {
  NEWS_FEEDS,
  makeSummary,
  slugify,
  classifyCategory,
  detectStateCode,
  matchesAny,
} from "../newsFetcher";

const parser = new Parser({ timeout: 20000 });

function download(url: string): string {
  return execFileSync(
    "curl",
    ["-sS", "-L", "--max-time", "25", "-A", "Mozilla/5.0 (compatible; NewsFeedVerifier/1.0)", url],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
  );
}

async function main() {
  let totalKept = 0;
  const seenSlugs = new Set<string>();
  for (const feed of NEWS_FEEDS) {
    let xml: string;
    try {
      xml = download(feed.url);
    } catch (e) {
      console.log(`FAIL download: ${feed.name} (${feed.url})`);
      continue;
    }
    let items: Parser.Item[];
    try {
      const parsed = await parser.parseString(xml);
      items = (parsed.items || []).slice(0, feed.maxItems ?? 15);
    } catch (e) {
      console.log(`FAIL parse: ${feed.name}`);
      continue;
    }
    let kept = 0;
    const samples: string[] = [];
    for (const item of items) {
      const title = (item.title || "").trim();
      const link = (item.link || "").trim();
      if (!title || !link) continue;
      const summary = makeSummary(item.contentSnippet || item.content || item.summary || "");
      if (feed.filterKeywords && !matchesAny(`${title} ${summary}`, feed.filterKeywords)) continue;
      const category = classifyCategory(title, summary, feed.defaultCategory);
      const stateCode = detectStateCode(title, summary);
      const slug = slugify(title, link);
      if (seenSlugs.has(slug)) {
        console.log(`  DUP SLUG: ${slug}`);
      }
      seenSlugs.add(slug);
      kept++;
      if (samples.length < 3) samples.push(`[${category}${stateCode ? "/" + stateCode : ""}] ${title.slice(0, 70)}`);
    }
    totalKept += kept;
    console.log(`OK ${feed.name}: ${items.length} fetched, ${kept} kept`);
    for (const s of samples) console.log(`    ${s}`);
  }
  console.log(`\nTOTAL items that would be inserted: ${totalKept}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
