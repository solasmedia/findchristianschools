// TEMPORARY one-time job runner — delete after the run completes.
//
// Design: completely inert unless the RUN_ONE_TIME_IMPORTS environment
// flag is set (a plain comma list, e.g. "blog,ipeds,nces" — a switch,
// not a secret). When set, the listed jobs run detached AFTER the server
// has started listening, so web serving is never blocked. Every job is
// idempotent (slug-keyed upsert for the blog post, upserts for the two
// federal-data imports), so an extra boot with the flag still set is
// harmless. All output is logged under the [OneTimeImports] prefix.
import { runBlogJob } from "./oneTimeJobs/blog";
import { runIpedsJob } from "./oneTimeJobs/ipeds";
import { runNcesJob } from "./oneTimeJobs/nces";

const LOG = "[OneTimeImports]";

const JOBS: Record<string, () => Promise<void>> = {
  blog: runBlogJob,
  ipeds: runIpedsJob,
  nces: runNcesJob,
};

export function maybeRunOneTimeImports(): void {
  const raw = process.env.RUN_ONE_TIME_IMPORTS;
  if (!raw || !raw.trim()) {
    console.log(`${LOG} module loaded, flag absent`);
    return;
  }
  const names = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  console.log(`${LOG} flag present, queued jobs: ${names.join(", ")}`);
  void (async () => {
    for (const name of names) {
      const job = JOBS[name];
      if (!job) {
        console.log(`${LOG} unknown job "${name}" skipped`);
        continue;
      }
      console.log(`${LOG} job "${name}" starting`);
      try {
        await job();
        console.log(`${LOG} job "${name}" completed`);
      } catch (err) {
        console.error(`${LOG} job "${name}" FAILED:`, err);
      }
    }
    console.log(`${LOG} all jobs finished`);
  })();
}
