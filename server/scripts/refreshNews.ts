/**
 * Manual news ingest run — the same pipeline the daily cron triggers.
 * Run where DATABASE_URL is set: npx tsx server/scripts/refreshNews.ts
 * Prints the full run report: published count, held items (flag screen),
 * per-feed health, and pruned count. Contains no generative step — see
 * the content rule in server/newsFetcher.ts.
 */
import { fetchAllNewsFeeds } from "../newsFetcher";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  const report = await fetchAllNewsFeeds();
  for (const r of report.results) {
    console.log(
      `${r.feed}: ${r.fetched} fetched, ${r.inserted} published, ${r.held} held${r.error ? ` — ERROR: ${r.error}` : ""}`
    );
  }
  if (report.heldItems.length) {
    console.log("\nHeld for human review:");
    for (const h of report.heldItems) {
      console.log(`- [${h.sourceName}] ${h.title} (flags: ${h.flags.join(", ")})`);
    }
  }
  if (report.unhealthyFeeds.length) {
    console.log(`\nUnhealthy feeds: ${report.unhealthyFeeds.join("; ")}`);
  }
  console.log(
    `\nDone. ${report.totalInserted} published, ${report.totalHeld} held, ${report.pruned} pruned (90-day retention).`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
