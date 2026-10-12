/**
 * Family hubs router — powers the two sister dashboards to the Teacher
 * Toolkit:
 *
 *   /homeschool-hub  "The Kitchen Table"   (homeschoolOverview)
 *   /parents         "The Parent Playbook" (parentsOverview)
 *
 * Every value returned here comes from a live query (truth rule: no
 * invented counts, posts, or events). Enrichment category counts are NOT
 * duplicated here — the pages read them from enrichment.countsByCategory,
 * the same public endpoint the directory itself uses.
 */
import { publicProcedure, router } from "./_core/trpc";
import {
  getFamilyEvents,
  getLatestHomeschoolBlogPosts,
  getLatestParentBlogPosts,
  getParentHubCounts,
} from "./db";

export const hubsRouter = router({
  /** The Kitchen Table: Morning Basket posts (tools/enrichment are client-side + enrichment router). */
  homeschoolOverview: publicProcedure.query(async () => {
    const morningBasketPosts = await getLatestHomeschoolBlogPosts(4);
    return { morningBasketPosts };
  }),

  /** The Parent Playbook: directory counts, family events, parent posts. */
  parentsOverview: publicProcedure.query(async () => {
    const [counts, familyEvents, latestPosts] = await Promise.all([
      getParentHubCounts(),
      getFamilyEvents(6),
      getLatestParentBlogPosts(4),
    ]);
    return {
      schoolCount: counts.schoolCount,
      collegeCount: counts.collegeCount,
      familyEvents,
      latestPosts,
    };
  }),
});
