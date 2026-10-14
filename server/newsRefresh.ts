/**
 * Protected daily news-refresh endpoint.
 *
 * POST /api/cron/news-refresh with header `x-cron-key: <key>` runs the
 * full ingest (see server/newsFetcher.ts for the pipeline and its
 * guardrails) and returns the run report as JSON: how many items were
 * published, which items were held for human review and why, and the
 * health of every feed. A scheduled Muse cron calls this once a day;
 * the admin "Refresh now" button and the on-load staleness top-up cover
 * the gaps in between.
 *
 * The key can be overridden with the NEWS_CRON_KEY env var. The endpoint
 * only ever triggers the idempotent ingest (dedupe by article URL), so
 * a repeated call is a no-op beyond a fresh fetch-log row.
 */
import type { Express, Request, Response } from "express";

const CRON_KEY = process.env.NEWS_CRON_KEY || "acba2cbfc018410700654df826059ef260634c70d9ff8f12";

export function registerNewsRefreshRoute(app: Express) {
  app.post("/api/cron/news-refresh", async (req: Request, res: Response) => {
    if (req.headers["x-cron-key"] !== CRON_KEY) {
      res.status(404).end();
      return;
    }
    res.setHeader("Cache-Control", "no-store");
    try {
      const { fetchAllNewsFeeds } = await import("./newsFetcher");
      const report = await fetchAllNewsFeeds();
      res.json({
        ok: true,
        ranAt: new Date().toISOString(),
        published: report.totalInserted,
        held: report.totalHeld,
        fetched: report.totalFetched,
        pruned: report.pruned,
        heldItems: report.heldItems,
        unhealthyFeeds: report.unhealthyFeeds,
        feeds: report.results.map((r) => ({
          feed: r.feed,
          fetched: r.fetched,
          published: r.inserted,
          held: r.held,
          error: r.error ?? null,
        })),
      });
    } catch (e) {
      res.status(500).json({
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  });
}
