/**
 * One-shot news seed: downloads all verified feeds via curl and stores items.
 * Run where DATABASE_URL is set:  npx tsx server/scripts/seedNews.ts
 * (Production self-seeds on the first /news page load via refreshNewsIfStale;
 * this script is for an immediate, visible backfill.)
 */
import { execFileSync } from "child_process";
import { NEWS_FEEDS, parseAndStoreFeedXml } from "../newsFetcher";

function download(url: string): string {
  return execFileSync(
    "curl",
    ["-sS", "-L", "--max-time", "25", "-A", "Mozilla/5.0 (compatible; FCSNewsSeed/1.0)", url],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
  );
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  let total = 0;
  for (const feed of NEWS_FEEDS) {
    try {
      const xml = download(feed.url);
      const { fetched, inserted } = await parseAndStoreFeedXml(feed.name, xml);
      total += inserted;
      console.log(`${feed.name}: ${fetched} fetched, ${inserted} inserted`);
    } catch (e) {
      console.error(`${feed.name}: FAILED -`, e instanceof Error ? e.message : e);
    }
  }
  console.log(`Done. ${total} new items inserted.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
