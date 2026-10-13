/**
 * Teacher Toolkit router — powers /teacher-toolkit.
 *
 * - overview: live counts + latest content for the dashboard. Every number
 *   comes from a real query (truth rule: no invented counts).
 * - joinForumWaitlist: phase 1 of the Teacher Forum. Teachers register
 *   interest and attest they teach at a Christian school. Entries land as
 *   status "pending"; forum access opens only after an admin validates the
 *   school (toolkitAdmin below). No forum software in phase 1.
 */
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { checkRateLimit, getRateLimitKey } from "./rateLimit";
import {
  getTeacherToolkitCounts,
  getLatestTeacherBlogPosts,
  getTeacherEvents,
  getProfessionalDevelopmentEvents,
  createTeacherForumWaitlistEntry,
  getTeacherForumWaitlist,
  updateTeacherForumWaitlistStatus,
} from "./db";
import { getJobs } from "./db";
import { notifyAdminOfSubmission } from "./_core/emailNotifications";

export const toolkitRouter = router({
  overview: publicProcedure.query(async () => {
    const [counts, posts, jobsResult, teacherEvents, pdEvents] = await Promise.all([
      getTeacherToolkitCounts(),
      getLatestTeacherBlogPosts(4),
      getJobs({ limit: 4 }),
      getTeacherEvents(6),
      getProfessionalDevelopmentEvents(6),
    ]);
    return {
      blogPostCount: counts.blogPostCount,
      openJobCount: counts.openJobCount,
      latestPosts: posts,
      latestJobs: jobsResult.jobs,
      teacherEvents,
      pdEvents,
    };
  }),

  joinForumWaitlist: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(255),
        email: z.string().email().max(320),
        schoolName: z.string().min(2).max(255),
        schoolCity: z.string().max(128).optional(),
        schoolState: z.string().max(64).optional(),
        role: z.enum(["teacher", "admin", "homeschool"]).default("teacher"),
        teachesAtChristianSchool: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const key = getRateLimitKey("forum_waitlist", undefined, ctx.req.ip);
      if (!checkRateLimit(key, { maxRequests: 5, windowMs: 60 * 60 * 1000 })) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many signups from this connection. Please try again later.",
        });
      }
      if (!input.teachesAtChristianSchool) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The Teacher Forum is for educators at Christian schools — please confirm you teach at one to join the founding list.",
        });
      }
      const result = await createTeacherForumWaitlistEntry(input);
      await notifyAdminOfSubmission("New Teacher Forum founding-teacher signup", {
        Name: input.name,
        Email: input.email,
        School: input.schoolName,
        City: input.schoolCity,
        State: input.schoolState,
        Role: input.role,
        Status: "Pending validation",
      }).catch(() => {});
      return result;
    }),
});

export const toolkitAdminRouter = router({
  forumWaitlist: adminProcedure
    .input(
      z
        .object({ status: z.enum(["pending", "validated", "rejected"]).optional() })
        .optional()
    )
    .query(({ input }) => getTeacherForumWaitlist(input?.status)),
  setForumWaitlistStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "validated", "rejected"]),
        adminNotes: z.string().max(2000).optional(),
      })
    )
    .mutation(({ input }) =>
      updateTeacherForumWaitlistStatus(input.id, input.status, input.adminNotes)
    ),
});
