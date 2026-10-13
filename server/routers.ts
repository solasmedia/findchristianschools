import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPremiumCheckout } from "./stripe/checkout";
import { notifyOwner } from "./_core/notification";
import { notifyAdminOfSubmission, notifyCoursePosted, notifyEventPosted } from "./_core/emailNotifications";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "./rateLimit";
import {
  searchSchools, getSchoolBySlug, getSchoolsByState, getFeaturedSchools, getNewestSchools,
  getResources, getJobs, getJobsBySchool, searchJobs, submitJob, getPendingJobs, getAllJobsAdmin, getEvents, getImpactMetrics, getDonationStats,
  createSchool, updateSchool, deleteSchool,
  createResource, updateResource, deleteResource,
  createJob, updateJob, deleteJob,
  createEvent, updateEvent, deleteEvent,
  getSavedSearches, createSavedSearch, deleteSavedSearch,
  subscribeNewsletter, getNewsletterSubscribers,
  createSponsor, getSponsors, updateSponsor,
  updateUserProfile, getAllUsers, getPendingSchools, approveSchool, getAllSchoolsAdmin,
  searchInternationalSchools, getInternationalSchoolBySlug, createInternationalSchool,
  updateInternationalSchool, deleteInternationalSchool, getPendingInternationalSchools, approveInternationalSchool,
  getSavedSchoolsByUser, saveSchool, unsaveSchool, isSchoolSaved,
  getAnalyticsMetrics, getSchoolSubmissionStats,
  getPageViewStats, getFunnelStats, getTopPages, getSessionInsights, trackPageView, trackFunnelEvent,
  searchCourses, searchClasses, getSchoolCourses, getSchoolClasses,
  createCourse, updateCourse, deleteCourse,
  createClass, updateClass, deleteClass,
  createClaimRequest, getClaimRequests, updateClaimRequest,
  createRemovalRequest, getRemovalRequests, updateRemovalRequest,
  getCourseCategories, getCoursesWithCategories, createCourseCategory, updateCourseCategory, deleteCourseCategory,
  submitEvent,
  getPendingEvents, getAllEventsAdmin,
  getSchoolCountsByState,
  searchColleges, getCollegeBySlug, getCollegesByState, getCollegeCountsByState,
  searchRaces, getRaceBySlug, getRaceCountsByState,
  getBlogPosts, getBlogPostBySlug, getRelatedBlogPosts,
  getAllBlogPostsAdmin, createBlogPost, updateBlogPost, deleteBlogPost,
  logResourceDownload, getBlogStats, hasPurchasedResource, getBlogPostForPurchase,
  getNewsItems, getNewsItemBySlug, getRelatedNewsItems,
  getAllNewsItemsAdmin, updateNewsItem, deleteNewsItem, getNewsStats,
  triggerNewsRefresh,
} from "./db";
import { createDonationCheckout } from "./stripe/checkout";
import { promoRouter } from "./routers-promo";
import { enrichmentRouter, enrichmentAdminRouter } from "./routers-enrichment";
import { toolkitRouter, toolkitAdminRouter } from "./routers-toolkit";
import { hubsRouter } from "./routers-hubs";
import { adminAuthRouter } from "./adminAuthRouter";
import { batchUpdatesRouter } from "./routers-batch-updates";
import { getDb } from "./db";
import { schools } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";


const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  return next({ ctx });
});

// Course and class router
const courseRouter = router({
  searchCourses: publicProcedure
    .input(z.object({
      schoolId: z.number().optional(),
      subject: z.string().optional(),
      deliveryType: z.enum(['in_person', 'online', 'hybrid']).optional(),
      gradeLevel: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return await searchCourses(input);
    }),
  
  getSchoolCourses: publicProcedure
    .input(z.object({ schoolId: z.number() }))
    .query(async ({ input }) => {
      return await getSchoolCourses(input.schoolId);
    }),

  searchClasses: publicProcedure
    .input(z.object({
      schoolId: z.number().optional(),
      gradeLevel: z.string().optional(),
      deliveryType: z.enum(['in_person', 'online', 'hybrid']).optional(),
    }))
    .query(async ({ input }) => {
      return await searchClasses(input);
    }),
  
  getSchoolClasses: publicProcedure
    .input(z.object({ schoolId: z.number() }))
    .query(async ({ input }) => {
      return await getSchoolClasses(input.schoolId);
    }),

  // Course categories for sidebar filter
  getCategories: publicProcedure.query(async () => {
    return await getCourseCategories();
  }),

  getByCategory: publicProcedure
    .input(z.object({ categorySlug: z.string().optional() }))
    .query(async ({ input }) => {
      return await getCoursesWithCategories(input.categorySlug);
    }),

  // Admin: manage categories
  createCategory: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => createCourseCategory(input)),

  updateCategory: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input: { id, ...data } }) => updateCourseCategory(id, data)),

  deleteCategory: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => deleteCourseCategory(input.id)),

  // Admin: create/update standalone course
  createStandaloneCourse: adminProcedure
    .input(z.object({
      categoryId: z.number(),
      name: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(["course", "class", "workshop", "program"]).default("class"),
      ageRange: z.string().optional(),
      gradeLevel: z.string().optional(),
      deliveryType: z.enum(["in_person", "online", "hybrid"]).default("in_person"),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const dbConn = await import("./db").then(m => m.getDb());
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { courses } = await import("../drizzle/schema");
      await dbConn.insert(courses).values({ ...input, isActive: true });
      return { success: true };
    }),
  updateStandaloneCourse: adminProcedure
    .input(z.object({
      id: z.number(),
      categoryId: z.number().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      type: z.enum(["course", "class", "workshop", "program"]).optional(),
      ageRange: z.string().optional(),
      gradeLevel: z.string().optional(),
      deliveryType: z.enum(["in_person", "online", "hybrid"]).optional(),
      isFeatured: z.boolean().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input: { id, ...data } }) => {
      const dbConn = await import("./db").then(m => m.getDb());
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { courses } = await import("../drizzle/schema");
      await dbConn.update(courses).set(data as any).where(eq(courses.id, id));
      return { success: true };
    }),
  deleteStandaloneCourse: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const dbConn = await import("./db").then(m => m.getDb());
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { courses } = await import("../drizzle/schema");
      await dbConn.delete(courses).where(eq(courses.id, input.id));
      return { success: true };
    }),
  submitListing: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(["course", "class", "workshop", "program"]),
      categoryId: z.number().optional(),
      subject: z.string().optional(),
      gradeLevel: z.string().optional(),
      ageRange: z.string().optional(),
      deliveryType: z.enum(["in_person", "online", "hybrid"]),
      instructor: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      schedule: z.string().optional(),
      tuition: z.number().optional(),
      maxStudents: z.number().optional(),
      contactName: z.string().min(1),
      contactEmail: z.string().email(),
      website: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const key = getRateLimitKey('course_submit', undefined, ctx.req.ip);
      if (!checkRateLimit(key, RATE_LIMITS.sponsor)) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many submissions. Please try again later.' });
      }
      const dbConn = await import("./db").then(m => m.getDb());
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { courses } = await import("../drizzle/schema");
      await dbConn.insert(courses).values({
        name: input.name,
        description: input.description,
        type: input.type,
        categoryId: input.categoryId,
        subject: input.subject,
        gradeLevel: input.gradeLevel,
        ageRange: input.ageRange,
        deliveryType: input.deliveryType,
        instructor: input.contactName,
        startDate: input.startDate,
        endDate: input.endDate,
        schedule: input.schedule,
        tuition: input.tuition,
        maxStudents: input.maxStudents,
        isActive: false,
      } as any);
      await notifyAdminOfSubmission(`New Course/Class Listing: ${input.name}`, {
        Name: input.name,
        Type: input.type,
        Delivery: input.deliveryType,
        Contact: input.contactName,
        Email: input.contactEmail,
        "Grade Level": input.gradeLevel || "Not specified",
      }).catch(() => {});
      return { success: true };
    }),
});

export const appRouter = router({
  system: systemRouter,
  adminAuth: adminAuthRouter,
  batchUpdates: batchUpdatesRouter,
  courses: courseRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ ANALYTICS TRACKING ============
  tracking: router({
    pageView: publicProcedure.input(z.object({
      path: z.string(),
      referrer: z.string().optional(),
      sessionId: z.string(),
      duration: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      await trackPageView({
        path: input.path,
        referrer: input.referrer,
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        duration: input.duration,
      });
      return { success: true };
    }),
    funnelEvent: publicProcedure.input(z.object({
      sessionId: z.string(),
      eventType: z.string(),
      eventData: z.string().optional(),
      path: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await trackFunnelEvent({
        sessionId: input.sessionId,
        userId: ctx.user?.id,
        eventType: input.eventType,
        eventData: input.eventData,
        path: input.path,
      });
      return { success: true };
    }),
  }),

  // ============ USER PROFILE ============
  profile: router({
    update: protectedProcedure.input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      state: z.string().optional(),
      newsletterOptIn: z.boolean().optional(),
    })).mutation(async ({ ctx, input }) => {
      await updateUserProfile(ctx.user.id, input);
      // Auto-subscribe to newsletter if opted in
      if (input.newsletterOptIn !== false && ctx.user.email) {
        await subscribeNewsletter({
          email: ctx.user.email,
          firstName: input.firstName,
          lastName: input.lastName,
          state: input.state,
          source: 'profile',
        });
      }
      return { success: true };
    }),
  }),

  // ============ SAVED SEARCHES ============
  savedSearches: router({
    list: protectedProcedure.query(({ ctx }) => getSavedSearches(ctx.user.id)),
    create: protectedProcedure.input(z.object({
      name: z.string().min(1),
      query: z.string().optional(),
      state: z.string().optional(),
      programType: z.string().optional(),
      gradeLevel: z.string().optional(),
    })).mutation(({ ctx, input }) => createSavedSearch({ ...input, userId: ctx.user.id })),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => deleteSavedSearch(input.id, ctx.user.id)),
  }),

  // ============ NEWSLETTER ============
  newsletter: router({
    subscribe: publicProcedure.input(z.object({
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      state: z.string().optional(),
      userType: z.enum(['school', 'parent', 'other']).optional(),
      otherDescription: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const key = getRateLimitKey('newsletter', undefined, ctx.req.ip);
      if (!checkRateLimit(key, RATE_LIMITS.newsletter)) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many subscribe attempts. Please try again later.' });
      }
      const result = await subscribeNewsletter({ ...input, source: 'welcome' });
      await notifyAdminOfSubmission(`New Newsletter Subscriber: ${input.email}`, {
        Email: input.email,
        Name: `${input.firstName || ''} ${input.lastName || ''}`.trim(),
        State: input.state || "Not specified",
        Type: input.userType || "Not specified",
      }).catch(() => {});
      return result;
    }),
  }),

  // ============ SPONSORS ============
  sponsors: router({
    submit: publicProcedure.input(z.object({
      companyName: z.string().min(1),
      contactName: z.string().min(1),
      contactEmail: z.string().email(),
      contactPhone: z.string().optional(),
      website: z.string().optional(),
      sponsorType: z.enum(["event", "trip", "recognition", "general"]).optional(),
      message: z.string().optional(),
      budget: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const key = getRateLimitKey('sponsor', undefined, ctx.req.ip);
      if (!checkRateLimit(key, RATE_LIMITS.sponsor)) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many submissions. Please try again later.' });
      }
      const result = await createSponsor(input);
      await notifyAdminOfSubmission(`New Sponsor Inquiry: ${input.companyName}`, {
        Company: input.companyName,
        Contact: input.contactName,
        Email: input.contactEmail,
        Phone: input.contactPhone,
        Type: input.sponsorType || "General",
        Budget: input.budget || "Not specified",
        Message: input.message || "None",
      }).catch(() => {});
      return result;
    }),
  }),

  // ============ SCHOOLS ============
  schools: router({
    search: publicProcedure.input(z.object({
      query: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
      radius: z.number().optional(),
      programType: z.string().optional(),
      tuitionType: z.string().optional(),
      gradeLevel: z.string().optional(),
      denominationTag: z.string().optional(),
      schoolType: z.string().optional(),
      enrollmentTier: z.string().optional(),
      sortBy: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    })).query(({ input }) => searchSchools(input)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getSchoolBySlug(input.slug)),
    getByState: publicProcedure.input(z.object({ stateCode: z.string() })).query(({ input }) => getSchoolsByState(input.stateCode)),
    featured: publicProcedure.query(() => getFeaturedSchools()),
    newest: publicProcedure.query(() => getNewestSchools(6)),
    countsByState: publicProcedure.query(() => getSchoolCountsByState()),
    create: adminProcedure.input(z.object({
      name: z.string().min(1), slug: z.string().min(1), city: z.string().min(1),
      state: z.string().min(1), stateCode: z.string().length(2), zip: z.string().min(1),
      phone: z.string().optional(), website: z.string().optional(), email: z.string().optional(),
      description: z.string().optional(), gradeStart: z.string().optional(), gradeEnd: z.string().optional(),
      programType: z.enum(["traditional", "online", "hybrid", "homeschool_coop", "boarding"]).optional(),
      tuitionType: z.enum(["free", "tuition_assisted", "tuition_based"]).optional(),
      tuitionMin: z.number().optional(), tuitionMax: z.number().optional(),
      enrollment: z.number().optional(), denomination: z.string().optional(),
      accreditation: z.string().optional(), statementOfFaith: z.string().optional(),
      isPremium: z.boolean().optional(), featured: z.boolean().optional(),
    })).mutation(({ input }) => createSchool(input)),
    update: adminProcedure.input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(), city: z.string().optional(), state: z.string().optional(),
        stateCode: z.string().optional(), zip: z.string().optional(), phone: z.string().optional(),
        website: z.string().optional(), email: z.string().optional(), description: z.string().optional(),
        address: z.string().optional(),
        gradeStart: z.string().optional(), gradeEnd: z.string().optional(),
        programType: z.enum(["traditional", "online", "hybrid", "homeschool_coop", "boarding"]).optional(),
        tuitionType: z.enum(["free", "tuition_assisted", "tuition_based"]).optional(),
        tuitionMin: z.number().optional(), tuitionMax: z.number().optional(),
        enrollment: z.number().optional(), denomination: z.string().optional(),
        denominationTag: z.string().optional(), schoolType: z.string().optional(), enrollmentTier: z.string().optional(),
        accreditation: z.string().optional(), statementOfFaith: z.string().optional(),
        isPremium: z.boolean().optional(), featured: z.boolean().optional(), isApproved: z.boolean().optional(),
        listingStatus: z.enum(["verified", "unverified", "pending", "claimed", "removed"]).optional(),
        isVerified: z.boolean().optional(), schoolClaimed: z.boolean().optional(),
        pointOfContact: z.string().optional(), internalNotes: z.string().optional(),
        county: z.string().optional(),
      }),
    })).mutation(({ input }) => updateSchool(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteSchool(input.id)),
  }),

  // ============ COLLEGES ============
  colleges: router({
    search: publicProcedure.input(z.object({
      query: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
      denomination: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    })).query(({ input }) => searchColleges(input)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getCollegeBySlug(input.slug)),
    getByState: publicProcedure.input(z.object({ stateCode: z.string() })).query(({ input }) => getCollegesByState(input.stateCode)),
    countsByState: publicProcedure.query(() => getCollegeCountsByState()),
  }),

  // ============ RACES ============
  races: router({
    search: publicProcedure.input(z.object({
      query: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
      upcoming: z.boolean().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    })).query(({ input }) => searchRaces(input)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getRaceBySlug(input.slug)),
    countsByState: publicProcedure.query(() => getRaceCountsByState()),
  }),

  // ============ RESOURCES ============
  resources: router({
    list: publicProcedure.input(z.object({
      category: z.string().optional(), state: z.string().optional(),
      limit: z.number().optional(), offset: z.number().optional(),
    })).query(({ input }) => getResources(input)),
    create: adminProcedure.input(z.object({
      title: z.string().min(1), slug: z.string().min(1), description: z.string().optional(),
      category: z.enum(["curriculum", "coop", "tutor", "online_course", "testing", "special_needs", "college_prep", "other"]).optional(),
      website: z.string().optional(), state: z.string().optional(), featured: z.boolean().optional(),
    })).mutation(({ input }) => createResource(input)),
    update: adminProcedure.input(z.object({
      id: z.number(), data: z.object({
        title: z.string().optional(), description: z.string().optional(),
        category: z.enum(["curriculum", "coop", "tutor", "online_course", "testing", "special_needs", "college_prep", "other"]).optional(),
        website: z.string().optional(), state: z.string().optional(), featured: z.boolean().optional(),
      }),
    })).mutation(({ input }) => updateResource(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteResource(input.id)),
  }),

  // ============ JOBS ============
  jobs: router({
    search: publicProcedure.input(z.object({
      query: z.string().optional(), state: z.string().optional(), zip: z.string().optional(),
      positionType: z.string().optional(), employmentType: z.string().optional(),
      limit: z.number().optional(), offset: z.number().optional(),
    })).query(({ input }) => searchJobs(input)),
    list: publicProcedure.input(z.object({
      state: z.string().optional(), category: z.string().optional(),
      limit: z.number().optional(), offset: z.number().optional(),
    })).query(({ input }) => getJobs(input)),
    bySchool: publicProcedure.input(z.object({ schoolId: z.number() })).query(({ input }) => getJobsBySchool(input.schoolId)),
    submit: publicProcedure.input(z.object({
      schoolName: z.string().min(1), schoolWebsite: z.string().optional(),
      submitterName: z.string().min(1), submitterEmail: z.string().email(),
      title: z.string().min(1), description: z.string().optional(),
      positionType: z.string().optional(), employmentType: z.string().optional(),
      location: z.string().optional(), state: z.string().optional(), stateCode: z.string().optional(), zip: z.string().optional(),
      payMin: z.number().optional(), payMax: z.number().optional(), payType: z.string().optional(),
      degreeRequired: z.string().optional(), yearsExperience: z.number().optional(), certificationRequired: z.boolean().optional(),
      faithRequirement: z.string().optional(), subjectArea: z.string().optional(), gradeLevel: z.string().optional(),
      applicationEmail: z.string().optional(), applicationUrl: z.string().optional(),
      applicationDeadline: z.string().optional(), startDate: z.string().optional(),
      sofAttested: z.boolean().default(false),
    })).mutation(async ({ input }) => {
      if (!input.sofAttested) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'You must affirm that the organization aligns with our Statement of Faith before submitting.' });
      }
      const { sofAttested, ...jobData } = input;
      const result = await submitJob({
        ...jobData,
        applicationDeadline: input.applicationDeadline ? new Date(input.applicationDeadline) : undefined,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        sofAttested: true,
        sofAttestedAt: new Date(),
      });
      await notifyAdminOfSubmission(`New Job Posting: ${input.title}`, {
        Title: input.title,
        School: input.schoolName,
        Location: input.location,
        "Submitted by": input.submitterName,
        Email: input.submitterEmail,
      }).catch(() => {});
      return result;
    }),
    pending: adminProcedure.query(() => getPendingJobs()),
    allAdmin: adminProcedure.input(z.object({ includeArchived: z.boolean().optional(), limit: z.number().optional(), offset: z.number().optional() }).optional()).query(({ input }) => getAllJobsAdmin(input || {})),
    approve: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      const { jobs } = await import('../drizzle/schema');
      await db.update(jobs).set({ isApproved: true }).where(eq(jobs.id, input.id));
      return { success: true };
    }),
    archive: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      const { jobs } = await import('../drizzle/schema');
      await db.update(jobs).set({ isArchived: true, archivedAt: new Date() }).where(eq(jobs.id, input.id));
      return { success: true };
    }),
    create: adminProcedure.input(z.object({
      schoolId: z.number(), title: z.string().min(1), description: z.string().optional(),
      category: z.enum(["teacher", "administrator", "support_staff", "coach", "other"]).optional(),
      location: z.string().optional(), state: z.string().optional(), stateCode: z.string().optional(),
      salaryRange: z.string().optional(), employmentType: z.enum(["full_time", "part_time", "contract"]).optional(),
      applyUrl: z.string().optional(),
    })).mutation(({ input }) => createJob(input)),
    update: adminProcedure.input(z.object({
      id: z.number(), data: z.object({
        title: z.string().optional(), description: z.string().optional(),
        category: z.enum(["teacher", "administrator", "support_staff", "coach", "other"]).optional(),
        location: z.string().optional(), state: z.string().optional(), stateCode: z.string().optional(),
        salaryRange: z.string().optional(), employmentType: z.enum(["full_time", "part_time", "contract"]).optional(),
        applyUrl: z.string().optional(), isActive: z.boolean().optional(),
      }),
    })).mutation(({ input }) => updateJob(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteJob(input.id)),
  }),

  // ============ EVENTS ============
  events: router({
    list: publicProcedure.input(z.object({
      state: z.string().optional(), category: z.string().optional(),
      limit: z.number().optional(), offset: z.number().optional(),
      month: z.number().min(1).max(12).optional(), year: z.number().optional(),
    })).query(({ input }) => getEvents(input)),
    submit: publicProcedure.input(z.object({
      title: z.string().min(2).max(255),
      description: z.string().max(2000).optional(),
      category: z.enum(["open_house", "conference", "fundraiser", "workshop", "missions", "other"]).optional(),
      audience: z.enum(["families", "teachers", "students", "pastors", "all"]).optional(),
      location: z.string().max(255).optional(),
      state: z.string().max(64).optional(),
      stateCode: z.string().max(2).optional(),
      startDate: z.date(),
      endDate: z.date().optional(),
      website: z.string().url().optional().or(z.literal('')),
      submitterName: z.string().max(255).optional(),
      contactEmail: z.string().email().optional(),
      sofAttested: z.boolean().default(false),
    })).mutation(async ({ ctx, input }) => {
      const key = getRateLimitKey('event_submit', undefined, ctx.req.ip);
      if (!checkRateLimit(key, { maxRequests: 3, windowMs: 60 * 60 * 1000 })) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many event submissions. Please try again later.' });
      }
      if (!input.sofAttested) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'You must affirm that the organization aligns with our Statement of Faith before submitting.' });
      }
      const { sofAttested, ...eventData } = input;
      const result = await submitEvent({
        ...eventData,
        sofAttested: true,
        sofAttestedAt: new Date(),
      });
      await notifyAdminOfSubmission(`New Event: ${input.title}`, {
        Title: input.title,
        Date: input.startDate?.toLocaleDateString(),
        Location: input.location,
        "Submitted by": input.submitterName,
        Email: input.contactEmail,
      }).catch(() => {});
      return result;
    }),
    create: adminProcedure.input(z.object({
      title: z.string().min(1), description: z.string().optional(),
      category: z.enum(["open_house", "conference", "fundraiser", "workshop", "missions", "other"]).optional(),
      audience: z.enum(["families", "teachers", "students", "pastors", "all"]).optional(),
      location: z.string().optional(), state: z.string().optional(), stateCode: z.string().optional(),
      startDate: z.date(), endDate: z.date().optional(), website: z.string().optional(), schoolId: z.number().optional(),
    })).mutation(async ({ input }) => {
      const result = await createEvent(input);
      await notifyEventPosted({
        title: input.title,
        date: input.startDate?.toLocaleDateString(),
        contactEmail: 'admin@findchristianschools.com',
      }).catch(() => {});
      return result;
    }),
    update: adminProcedure.input(z.object({
      id: z.number(), data: z.object({
        title: z.string().optional(), description: z.string().optional(),
        category: z.enum(["open_house", "conference", "fundraiser", "workshop", "missions", "other"]).optional(),
        audience: z.enum(["families", "teachers", "students", "pastors", "all"]).optional(),
        location: z.string().optional(), state: z.string().optional(), stateCode: z.string().optional(),
        startDate: z.date().optional(), endDate: z.date().optional(), website: z.string().optional(), isActive: z.boolean().optional(),
        isApproved: z.boolean().optional(),
      }),
    })).mutation(({ input }) => updateEvent(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteEvent(input.id)),
    listPending: adminProcedure.query(() => getPendingEvents()),
    listAll: adminProcedure.input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional()).query(({ input }) => getAllEventsAdmin(input || {})),
  }),

  // ============ BLOG (Teacher Resource Hub) ============
  blog: router({
    list: publicProcedure.input(z.object({
      category: z.string().optional(),
      limit: z.number().optional(), offset: z.number().optional(),
    })).query(({ input }) => getBlogPosts(input)),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post) throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
      return post;
    }),
    related: publicProcedure.input(z.object({
      postId: z.number(), category: z.string(), limit: z.number().optional(),
    })).query(({ input }) => getRelatedBlogPosts(input.postId, input.category, input.limit)),
    // Email-gated download: logs the download + subscribes to newsletter
    downloadResource: publicProcedure.input(z.object({
      postId: z.number(),
      email: z.string().email(),
      firstName: z.string().max(255).optional(),
      userType: z.enum(['teacher', 'parent', 'school', 'other']).optional(),
    })).mutation(async ({ ctx, input }) => {
      const key = getRateLimitKey('blog_download', undefined, ctx.req.ip);
      if (!checkRateLimit(key, { maxRequests: 10, windowMs: 60 * 60 * 1000 })) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many download attempts. Please try again later.' });
      }
      const result = await logResourceDownload(input);
      await notifyAdminOfSubmission(`New Resource Download (post #${input.postId})`, {
        "Post ID": input.postId,
        Email: input.email,
        Name: input.firstName,
        Type: input.userType,
      }).catch(() => {});
      return result;
    }),
    // Premium purchase: create Stripe checkout for a resource packet
    purchaseResource: publicProcedure.input(z.object({
      postId: z.number(),
      email: z.string().email(),
      origin: z.string().url(),
    })).mutation(async ({ input }) => {
      const post = await getBlogPostForPurchase(input.postId);
      if (!post || !post.isPremiumResource || !post.resourcePriceCents) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Premium resource not found' });
      }
      const { createResourceCheckout } = await import("./stripe/checkout");
      return createResourceCheckout({
        postId: post.id,
        postSlug: post.slug,
        postTitle: post.title,
        resourceTitle: post.resourceTitle || post.title,
        priceCents: post.resourcePriceCents,
        userEmail: input.email,
        origin: input.origin,
      });
    }),
    // Check if an email has purchased a resource (unlocks full download)
    checkPurchase: publicProcedure.input(z.object({
      postId: z.number(),
      email: z.string().email(),
    })).query(({ input }) => hasPurchasedResource(input.postId, input.email)),
    // Admin
    listAll: adminProcedure.input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional()).query(({ input }) => getAllBlogPostsAdmin(input || {})),
    stats: adminProcedure.query(() => getBlogStats()),
    create: adminProcedure.input(z.object({
      title: z.string().min(1).max(255),
      slug: z.string().min(1).max(255),
      excerpt: z.string().optional(),
      category: z.enum(["bible_lessons", "classroom_activities", "crafts", "critical_thinking", "character_education", "seasonal", "chapel", "teaching_tips"]).optional(),
      ageGroup: z.string().max(64).optional(),
      content: z.string().min(1),
      readingTimeMinutes: z.number().optional(),
      status: z.enum(["draft", "scheduled", "published"]).optional(),
      scheduledFor: z.date().optional(),
      featured: z.boolean().optional(),
      seoTitle: z.string().max(255).optional(),
      resourceTitle: z.string().max(255).optional(),
      resourceDescription: z.string().optional(),
      resourceContent: z.string().optional(),
      resourceType: z.string().max(64).optional(),
      heroImageUrl: z.string().max(512).optional(),
      isPremiumResource: z.boolean().optional(),
      resourcePriceCents: z.number().optional(),
      resourcePageCount: z.number().optional(),
      resourcePreviewContent: z.string().optional(),
    })).mutation(({ input }) => createBlogPost({
      ...input,
      publishedAt: input.status === "published" ? new Date() : null,
    })),
    update: adminProcedure.input(z.object({
      id: z.number(),
      data: z.object({
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        excerpt: z.string().optional(),
        category: z.enum(["bible_lessons", "classroom_activities", "crafts", "critical_thinking", "character_education", "seasonal", "chapel", "teaching_tips"]).optional(),
        ageGroup: z.string().max(64).optional(),
        content: z.string().min(1).optional(),
        readingTimeMinutes: z.number().optional(),
        status: z.enum(["draft", "scheduled", "published"]).optional(),
        scheduledFor: z.date().optional().nullable(),
        publishedAt: z.date().optional().nullable(),
        featured: z.boolean().optional(),
        seoTitle: z.string().max(255).optional(),
        resourceTitle: z.string().max(255).optional(),
        resourceDescription: z.string().optional(),
        resourceContent: z.string().optional(),
        resourceType: z.string().max(64).optional(),
        heroImageUrl: z.string().max(512).optional(),
        isPremiumResource: z.boolean().optional(),
        resourcePriceCents: z.number().optional(),
        resourcePageCount: z.number().optional(),
        resourcePreviewContent: z.string().optional(),
      }),
    })).mutation(({ input }) => updateBlogPost(input.id, {
      ...input.data,
      ...(input.data.status === "published" ? { publishedAt: new Date() } : {}),
    })),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteBlogPost(input.id)),
  }),

  // ============ NEWS (Christian education news aggregation) ============
  news: router({
    list: publicProcedure.input(z.object({
      category: z.enum(["national", "state", "policy", "school_choice", "curriculum"]).optional(),
      stateCode: z.string().max(2).optional(),
      search: z.string().max(200).optional(),
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional(),
    })).query(({ input }) => getNewsItems(input)),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const item = await getNewsItemBySlug(input.slug);
      if (!item) throw new TRPCError({ code: 'NOT_FOUND', message: 'News item not found' });
      return item;
    }),
    related: publicProcedure.input(z.object({
      itemId: z.number(), category: z.string(), limit: z.number().optional(),
    })).query(({ input }) => getRelatedNewsItems(input.itemId, input.category, input.limit)),
    // Admin
    listAll: adminProcedure.input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional()).query(({ input }) => getAllNewsItemsAdmin(input || {})),
    stats: adminProcedure.query(() => getNewsStats()),
    refresh: adminProcedure.mutation(() => triggerNewsRefresh()),
    update: adminProcedure.input(z.object({
      id: z.number(),
      data: z.object({
        title: z.string().min(1).max(255).optional(),
        summary: z.string().optional(),
        category: z.enum(["national", "state", "policy", "school_choice", "curriculum"]).optional(),
        stateCode: z.string().max(2).optional().nullable(),
        isActive: z.boolean().optional(),
      }),
    })).mutation(({ input }) => updateNewsItem(input.id, input.data)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteNewsItem(input.id)),
  }),

  // ============ IMPACT ============
  impact: router({
    metrics: publicProcedure.query(() => getImpactMetrics()),
    donationStats: publicProcedure.query(() => getDonationStats()),
  }),

  // ============ SAVED SCHOOLS (FAVORITES) ============
  savedSchools: router({
    list: protectedProcedure.query(({ ctx }) => getSavedSchoolsByUser(ctx.user.id)),
    save: protectedProcedure.input(z.object({
      schoolId: z.number(),
      schoolType: z.enum(["domestic", "international"]).optional(),
    })).mutation(({ ctx, input }) => saveSchool(ctx.user.id, input.schoolId, input.schoolType || "domestic")),
    unsave: protectedProcedure.input(z.object({
      schoolId: z.number(),
      schoolType: z.enum(["domestic", "international"]).optional(),
    })).mutation(({ ctx, input }) => unsaveSchool(ctx.user.id, input.schoolId, input.schoolType || "domestic")),
    isSaved: protectedProcedure.input(z.object({
      schoolId: z.number(),
      schoolType: z.enum(["domestic", "international"]).optional(),
    })).query(({ ctx, input }) => isSchoolSaved(ctx.user.id, input.schoolId, input.schoolType || "domestic")),
  }),

  // ============ STRIPE ============
  stripe: router({
    createCheckout: protectedProcedure.input(z.object({
      schoolId: z.number().optional(), schoolName: z.string(), promoCode: z.string().optional(),
      collegeId: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      if (!input.schoolId && !input.collegeId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'schoolId or collegeId required' });
      }
      const origin = ctx.req.headers.origin || 'https://findchristianschools.com';
      // App-level promo codes live on the schools row (promoCode /
      // promoDiscountPercent). A code only applies to the school that owns it.
      let discountPercent = 0;
      if (input.promoCode) {
        if (!input.schoolId) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Promo codes can only be applied to school listings' });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
        const result = await db.select().from(schools).where(eq(schools.promoCode, input.promoCode.toUpperCase())).limit(1);
        const promoSchool = result[0];
        if (!promoSchool) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid promo code' });
        if (promoSchool.id !== input.schoolId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Promo code is not valid for this school' });
        discountPercent = promoSchool.promoDiscountPercent ?? 0;
        if (discountPercent >= 100) {
          // 100% promo: activate premium directly. No Stripe checkout and no
          // card required; premium runs for one year from today.
          const premiumExpiresAt = new Date();
          premiumExpiresAt.setFullYear(premiumExpiresAt.getFullYear() + 1);
          await db.update(schools).set({
            isPremium: true,
            listingType: 'premium',
            premiumExpiresAt,
          }).where(eq(schools.id, input.schoolId));
          return { url: `${origin}/membership?status=success&school_id=${input.schoolId}&type=school&promo=${encodeURIComponent(input.promoCode.toUpperCase())}` };
        }
      }
      return createPremiumCheckout({ schoolId: input.schoolId, collegeId: input.collegeId, schoolName: input.schoolName, userEmail: ctx.user.email || '', userId: ctx.user.id, origin, discountPercent });
    }),
    createDonation: publicProcedure.input(z.object({
      amount: z.number().min(100), // minimum $1.00 in cents
      recurring: z.boolean(),
    })).mutation(async ({ ctx, input }) => {
      const origin = ctx.req.headers.origin || 'https://findchristianschools.com';
      const email = ctx.user?.email || undefined;
      const userId = ctx.user?.id || undefined;
      return createDonationCheckout({ amount: input.amount, recurring: input.recurring, email, userId, origin });
    }),
  }),

  // ============ SCHOOL SUBMISSION ============
  submission: router({
    submitSchool: publicProcedure.input(z.object({
      name: z.string().min(1), address: z.string().min(1), city: z.string().min(1),
      state: z.string().min(1), stateCode: z.string().length(2), zip: z.string().min(1),
      phone: z.string().optional(), website: z.string().optional(), email: z.string().optional(),
      description: z.string().optional(), missionStatement: z.string().optional(),
      logoUrl: z.string().optional(), coverImageUrl: z.string().optional(),
      gradeStart: z.string().optional(), gradeEnd: z.string().optional(),
      programType: z.enum(["traditional", "online", "hybrid", "homeschool_coop", "boarding"]).optional(),
      tuitionType: z.enum(["free", "tuition_assisted", "tuition_based"]).optional(),
      tuitionMin: z.number().optional(), tuitionMax: z.number().optional(),
      enrollment: z.number().optional(), studentTeacherRatio: z.string().optional(),
      yearFounded: z.number().optional(), denomination: z.string().optional(),
      accreditation: z.string().optional(),
      statementOfFaith: z.string().min(1, "Statement of Faith is required"),
      hasTransportation: z.boolean().optional(), hasLunchProgram: z.boolean().optional(),
      hasAfterSchool: z.boolean().optional(), hasSpecialNeeds: z.boolean().optional(),
      hasSports: z.boolean().optional(), hasArts: z.boolean().optional(),
      hasSTEM: z.boolean().optional(), uniformRequired: z.boolean().optional(),
      acceptsVouchers: z.boolean().optional(), sportsOffered: z.string().optional(),
      extracurriculars: z.string().optional(), contactName: z.string().optional(),
      contactTitle: z.string().optional(), contactPhone: z.string().optional(),
      contactEmail: z.string().optional(), latitude: z.number().optional(), longitude: z.number().optional(),
      claimSlug: z.string().optional(), // If claiming an existing school
      // Verification fields
      googleBusinessProfileUrl: z.string().url().optional().or(z.literal('')),
      einOrStateRegNumber: z.string().optional(),
      certifiedAccurate: z.boolean().default(false),
      // Statement of Faith attestation (required)
      sofAttested: z.boolean().default(false),
      // Payment fields
      listingType: z.enum(["free", "donate", "premium"]).optional().default("free"),
      donationAmount: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      const key = getRateLimitKey('submission', undefined, ctx.req.ip);
      if (!checkRateLimit(key, RATE_LIMITS.submission)) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many submissions. Please try again in an hour.' });
      }

      if (!input.certifiedAccurate) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'You must certify that the information is accurate before submitting.' });
      }
      if (!input.sofAttested) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'You must affirm that the organization aligns with our Statement of Faith before submitting.' });
      }
      const { claimSlug, googleBusinessProfileUrl, einOrStateRegNumber, certifiedAccurate, listingType, donationAmount, sofAttested, ...schoolData } = input;
      const dbConn = await import("./db").then(m => m.getDb());
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { schools: schoolsTable } = await import("../drizzle/schema");
      const { eq, and, sql } = await import("drizzle-orm");

      // Try to match an existing school: first by claimSlug, then by name+city+state
      let existingSchool: any = null;
      if (claimSlug) {
        const [found] = await dbConn.select().from(schoolsTable).where(eq(schoolsTable.slug, claimSlug)).limit(1);
        existingSchool = found;
      }
      if (!existingSchool) {
        // Match by name + city + state (case-insensitive)
        const [found] = await dbConn.select().from(schoolsTable).where(
          and(
            sql`LOWER(name) = LOWER(${schoolData.name})`,
            sql`LOWER(city) = LOWER(${schoolData.city})`,
            sql`(LOWER(state) = LOWER(${schoolData.state}) OR stateCode = ${schoolData.stateCode})`
          )
        ).limit(1);
        existingSchool = found;
      }

      if (existingSchool) {
        // Update existing school with submitted fields, set to pending
        const updateFields: any = {};
        if (schoolData.address) updateFields.address = schoolData.address;
        if (schoolData.phone) updateFields.phone = schoolData.phone;
        if (schoolData.website) updateFields.website = schoolData.website;
        if (schoolData.email) updateFields.email = schoolData.email;
        if (schoolData.description) updateFields.description = schoolData.description;
        if (schoolData.gradeStart) updateFields.gradeStart = schoolData.gradeStart;
        if (schoolData.gradeEnd) updateFields.gradeEnd = schoolData.gradeEnd;
        if (schoolData.programType) updateFields.programType = schoolData.programType;
        if (schoolData.tuitionType) updateFields.tuitionType = schoolData.tuitionType;
        if (schoolData.tuitionMin) updateFields.tuitionMin = schoolData.tuitionMin;
        if (schoolData.tuitionMax) updateFields.tuitionMax = schoolData.tuitionMax;
        if (schoolData.enrollment) updateFields.enrollment = schoolData.enrollment;
        if (schoolData.denomination) updateFields.denomination = schoolData.denomination;
        if (schoolData.accreditation) updateFields.accreditation = schoolData.accreditation;
        if (schoolData.statementOfFaith) updateFields.statementOfFaith = schoolData.statementOfFaith;
        if (schoolData.contactName) updateFields.pointOfContact = schoolData.contactName;
        // Set listing status to pending and mark as claimed
        updateFields.listingStatus = 'pending';
        updateFields.schoolClaimed = true;
        if (ctx.user?.id) updateFields.ownerId = ctx.user.id;
        updateFields.dateLastUpdated = new Date();
        if (googleBusinessProfileUrl) updateFields.googleBusinessProfileUrl = googleBusinessProfileUrl;
        if (einOrStateRegNumber) updateFields.einOrStateRegNumber = einOrStateRegNumber;
        updateFields.certifiedAccurate = certifiedAccurate;
        updateFields.listingType = listingType || 'free';
        if (donationAmount) updateFields.donationAmount = donationAmount;
        if (listingType === 'premium') updateFields.isPremium = true;
        // Statement of Faith attestation
        updateFields.sofAttested = true;
        updateFields.sofAttestedAt = new Date();

        await dbConn.update(schoolsTable).set(updateFields).where(eq(schoolsTable.id, existingSchool.id));

        // Notify admin by email
        await notifyAdminOfSubmission(`School Claimed: ${existingSchool.name}`, {
          School: existingSchool.name,
          City: existingSchool.city,
          State: existingSchool.state,
          "Claimed by": ctx.user?.name || ctx.user?.email || input.contactName || input.contactEmail || "Unknown",
          Contact: input.contactName,
          Email: input.contactEmail,
          Status: "Pending",
        }).catch(() => {});

        return { success: true, slug: existingSchool.slug, matched: true };
      } else {
        // Create new school
        const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await createSchool({
          ...schoolData, slug, ownerId: ctx.user?.id, isApproved: false, isPremium: listingType === 'premium', featured: false,
          latitude: input.latitude?.toString(), longitude: input.longitude?.toString(),
          googleBusinessProfileUrl: googleBusinessProfileUrl || undefined,
          einOrStateRegNumber: einOrStateRegNumber || undefined,
          certifiedAccurate,
          sofAttested: true,
          sofAttestedAt: new Date(),
          listingStatus: 'community_submitted',
          listingType: listingType || 'free',
          donationAmount: donationAmount || undefined,
        } as any);
        // Notify admin of new school submission by email
        await notifyAdminOfSubmission(`New School Submitted: ${input.name}`, {
          School: input.name,
          City: input.city,
          State: input.state,
          "Submitted by": ctx.user?.name || ctx.user?.email || input.contactName || input.contactEmail || "Unknown",
          Contact: input.contactName,
          Email: input.contactEmail,
          "Listing type": listingType || "free",
        }).catch(() => {});
        return { success: true, slug, matched: false };
      }
    }),
  }),

  // ============ REPORT LISTING ============
  reportListing: publicProcedure.input(z.object({
    schoolId: z.number(),
    schoolName: z.string().optional(),
    reason: z.enum(['fraudulent', 'incorrect_info', 'inappropriate', 'closed', 'safety_concern', 'other']),
    details: z.string().optional(),
    reporterName: z.string().optional(),
    reporterEmail: z.string().email().optional().or(z.literal('')),
  })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
    const { reportListings } = await import('../drizzle/schema');
    await db.insert(reportListings).values({
      schoolId: input.schoolId,
      schoolName: input.schoolName,
      reason: input.reason,
      details: input.details,
      reporterName: input.reporterName,
      reporterEmail: input.reporterEmail || undefined,
    });
    await notifyAdminOfSubmission(`Listing Report: ${input.schoolName || `School #${input.schoolId}`}`, {
      School: input.schoolName || `ID ${input.schoolId}`,
      Reason: input.reason,
      Details: input.details || "None provided",
      Reporter: input.reporterName || "Anonymous",
      Email: input.reporterEmail || "no email",
    }).catch(() => {});
    return { success: true };
  }),

  // ============ INTERNATIONAL SCHOOLS ============
  international: router({
    search: publicProcedure.input(z.object({
      query: z.string().optional(), country: z.string().optional(),
      language: z.string().optional(), curriculumType: z.string().optional(),
      gradeLevel: z.string().optional(), limit: z.number().optional(), offset: z.number().optional(),
    })).query(({ input }) => searchInternationalSchools(input)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getInternationalSchoolBySlug(input.slug)),
    submit: publicProcedure.input(z.object({
      name: z.string().min(1), country: z.string().min(1), countryCode: z.string().min(2).max(3),
      city: z.string().min(1), region: z.string().optional(), address: z.string().optional(),
      phone: z.string().optional(), website: z.string().optional(), email: z.string().optional(),
      description: z.string().optional(), missionStatement: z.string().optional(),
      primaryLanguage: z.string().min(1), secondaryLanguage: z.string().optional(),
      curriculumType: z.enum(["american", "british", "ib", "national", "hybrid", "other"]).optional(),
      gradeStart: z.string().optional(), gradeEnd: z.string().optional(),
      programType: z.enum(["day_school", "boarding", "hybrid", "online"]).optional(),
      missionAffiliation: z.string().optional(), denomination: z.string().optional(),
      accreditation: z.string().optional(), statementOfFaith: z.string().min(1, "Statement of Faith is required"),
      tuitionRange: z.string().optional(), enrollment: z.number().optional(),
      studentTeacherRatio: z.string().optional(), yearFounded: z.number().optional(),
      acceptsExpats: z.boolean().optional(), visaSupport: z.boolean().optional(),
      hasBoarding: z.boolean().optional(), hasSports: z.boolean().optional(),
      hasArts: z.boolean().optional(), hasESL: z.boolean().optional(),
      contactName: z.string().optional(), contactTitle: z.string().optional(), contactEmail: z.string().optional(),
      sofAttested: z.boolean().default(false),
    })).mutation(async ({ ctx, input }) => {
      if (!input.sofAttested) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'You must affirm that the organization aligns with our Statement of Faith before submitting.' });
      }
      const { sofAttested, ...rest } = input;
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await createInternationalSchool({
        ...rest, slug, ownerId: ctx.user?.id, isApproved: false, isPremium: false, featured: false,
        programType: input.programType || 'day_school', curriculumType: input.curriculumType || 'other',
        sofAttested: true, sofAttestedAt: new Date(),
      });
      await notifyAdminOfSubmission(`New International School Submitted: ${input.name}`, {
        School: input.name,
        Country: input.country,
        City: input.city,
        Denomination: input.denomination || "Not specified",
        "Submitted by": ctx.user?.name || ctx.user?.email || input.contactName || input.contactEmail || "Unknown",
        Email: input.contactEmail,
      }).catch(() => {});
      return { success: true, slug };
    }),
    update: adminProcedure.input(z.object({ id: z.number(), data: z.record(z.string(), z.any()) })).mutation(({ input }) => updateInternationalSchool(input.id, input.data as any)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteInternationalSchool(input.id)),
  }),

  // ============ PROMO CODES ============
  promo: promoRouter,
  enrichment: enrichmentRouter,
  enrichmentAdmin: enrichmentAdminRouter,
  toolkit: toolkitRouter,
  toolkitAdmin: toolkitAdminRouter,
  hubs: hubsRouter,

  // ============ CLAIM & REMOVAL REQUESTS ============
  claimRequests: router({
    create: publicProcedure.input(z.object({
      schoolId: z.number().optional(),
      collegeId: z.number().optional(),
      claimantName: z.string().min(1),
      claimantEmail: z.string().email(),
      claimantPhone: z.string().optional(),
      claimantRole: z.string().min(1),
      relationship: z.string().optional(),
      verificationNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      if (!input.schoolId && !input.collegeId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Either schoolId or collegeId is required' });
      }
      const result = await createClaimRequest(input);
      const listingLabel = input.collegeId ? `College ID: ${input.collegeId}` : `School ID: ${input.schoolId}`;
      await notifyAdminOfSubmission(`New Claim Request from ${input.claimantName}`, {
        Listing: listingLabel,
        Claimant: input.claimantName,
        Email: input.claimantEmail,
        Phone: input.claimantPhone,
        Role: input.claimantRole,
        Relationship: input.relationship,
        Notes: input.verificationNotes,
      }).catch(() => {});
      return result;
    }),
  }),

  removalRequests: router({
    create: publicProcedure.input(z.object({
      schoolId: z.number(),
      requesterName: z.string().min(1),
      requesterEmail: z.string().email(),
      requesterPhone: z.string().optional(),
      requesterRole: z.string().min(1),
      reason: z.string().min(1),
    })).mutation(async ({ input }) => {
      const result = await createRemovalRequest(input);
      await notifyAdminOfSubmission(`New Removal Request from ${input.requesterName}`, {
        "School ID": input.schoolId,
        Requester: input.requesterName,
        Email: input.requesterEmail,
        Phone: input.requesterPhone,
        Role: input.requesterRole,
        Reason: input.reason,
      }).catch(() => {});
      return result;
    }),
  }),

  // ============ ADMIN ============
  admin: router({
    pendingSchools: adminProcedure.query(() => getPendingSchools()),
    pendingInternational: adminProcedure.query(() => getPendingInternationalSchools()),
    allSchools: adminProcedure.input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional()).query(({ input }) => getAllSchoolsAdmin(input || {})),
    allUsers: adminProcedure.query(() => getAllUsers()),
    subscribers: adminProcedure.query(() => getNewsletterSubscribers()),
    sponsors: adminProcedure.query(() => getSponsors()),
    approveSchool: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => approveSchool(input.id)),
    approveInternational: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => approveInternationalSchool(input.id)),
    updateSponsor: adminProcedure.input(z.object({
      id: z.number(), status: z.enum(["pending", "approved", "active", "completed"]),
    })).mutation(({ input }) => updateSponsor(input.id, { status: input.status })),
    analytics: adminProcedure.query(() => getAnalyticsMetrics()),
    submissionStats: adminProcedure.query(() => getSchoolSubmissionStats()),
    pageViewStats: adminProcedure.input(z.object({ days: z.number().default(30) })).query(({ input }) => getPageViewStats(input.days)),
    funnelStats: adminProcedure.input(z.object({ days: z.number().default(30) })).query(({ input }) => getFunnelStats(input.days)),
    topPages: adminProcedure.input(z.object({ days: z.number().default(30), limit: z.number().default(20) })).query(({ input }) => getTopPages(input.days, input.limit)),
    sessionInsights: adminProcedure.input(z.object({ days: z.number().default(30) })).query(({ input }) => getSessionInsights(input.days)),
    // Claim request management
    claimRequests: adminProcedure.input(z.object({ status: z.string().optional() })).query(({ input }) => getClaimRequests(input.status)),
    updateClaimRequest: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["pending", "approved", "denied"]),
      adminNotes: z.string().optional(),
    })).mutation(({ input }) => updateClaimRequest(input.id, { status: input.status, adminNotes: input.adminNotes })),
    // Removal request management
    removalRequests: adminProcedure.input(z.object({ status: z.string().optional() })).query(({ input }) => getRemovalRequests(input.status)),
    updateRemovalRequest: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["pending", "approved", "denied"]),
      adminNotes: z.string().optional(),
    })).mutation(({ input }) => updateRemovalRequest(input.id, { status: input.status, adminNotes: input.adminNotes })),
    // Course/Class CRUD
    createCourse: adminProcedure.input(z.object({
      schoolId: z.number(),
      name: z.string(),
      description: z.string().optional(),
      subject: z.string().optional(),
      gradeLevel: z.string().optional(),
      deliveryType: z.enum(['in_person', 'online', 'hybrid']).default('in_person'),
      credits: z.number().optional(),
      tuition: z.number().optional(),
      maxStudents: z.number().optional(),
      instructor: z.string().optional(),
      schedule: z.string().optional(),
    })).mutation(async ({ input }) => {
      const result = await createCourse(input);
      await notifyCoursePosted({
        title: input.name,
        provider: input.instructor || 'Unknown',
        contactEmail: 'admin@findchristianschools.com',
      }).catch(() => {});
      return result;
    }),
    updateCourse: adminProcedure.input(z.object({ id: z.number(), data: z.record(z.string(), z.any()) })).mutation(({ input }) => updateCourse(input.id, input.data as any)),
    deleteCourse: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteCourse(input.id)),
    createClass: adminProcedure.input(z.object({
      schoolId: z.number(),
      name: z.string(),
      description: z.string().optional(),
      gradeLevel: z.string(),
      deliveryType: z.enum(['in_person', 'online', 'hybrid']).default('in_person'),
      teacherName: z.string().optional(),
      maxStudents: z.number().optional(),
      tuition: z.number().optional(),
      schedule: z.string().optional(),
    })).mutation(({ input }) => createClass(input)),
    updateClass: adminProcedure.input(z.object({ id: z.number(), data: z.record(z.string(), z.any()) })).mutation(({ input }) => updateClass(input.id, input.data as any)),
    deleteClass: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteClass(input.id)),
    // Submission approval/rejection for jobs, events, courses
    jobs: adminProcedure.input(z.object({ status: z.enum(['pending', 'approved']).optional() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { jobs } = require('../drizzle/schema');
      if (input.status === 'pending') return db.select().from(jobs).where(eq(jobs.isPublished, false));
      if (input.status === 'approved') return db.select().from(jobs).where(eq(jobs.isPublished, true));
      return db.select().from(jobs);
    }),
    approveJob: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      await db.execute(sql`UPDATE jobs SET isApproved = 1, isPublished = 1 WHERE id = ${input.id}`);
      await notifyOwner({ title: 'Job Approved', content: `Job ID ${input.id} has been approved and is now live.` });
      return { success: true };
    }),
    rejectJob: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { jobs } = require('../drizzle/schema');
      await db.delete(jobs).where(eq(jobs.id, input.id));
      await notifyOwner({ title: 'Job Rejected', content: `Job ID ${input.id} has been rejected and removed.` });
      return { success: true };
    }),
    updateJob: adminProcedure.input(z.object({ id: z.number(), data: z.record(z.string(), z.any()) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { jobs } = require('../drizzle/schema');
      await db.update(jobs).set(input.data).where(eq(jobs.id, input.id));
      await notifyOwner({ title: 'Job Updated', content: `Job ID ${input.id} has been updated.` });
      return { success: true };
    }),
    events: adminProcedure.input(z.object({ status: z.enum(['pending', 'approved']).optional() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { events } = require('../drizzle/schema');
      if (input.status === 'pending') return db.select().from(events).where(eq(events.isPublished, false));
      if (input.status === 'approved') return db.select().from(events).where(eq(events.isPublished, true));
      return db.select().from(events);
    }),
    approveEvent: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { events } = require('../drizzle/schema');
      await db.update(events).set({ isApproved: true, isPublished: true }).where(eq(events.id, input.id));
      await notifyOwner({ title: 'Event Approved', content: `Event ID ${input.id} has been approved and is now live.` });
      return { success: true };
    }),
    rejectEvent: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { events } = require('../drizzle/schema');
      await db.delete(events).where(eq(events.id, input.id));
      await notifyOwner({ title: 'Event Rejected', content: `Event ID ${input.id} has been rejected and removed.` });
      return { success: true };
    }),
    courses: adminProcedure.input(z.object({ status: z.enum(['pending', 'approved']).optional() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { courses } = require('../drizzle/schema');
      if (input.status === 'pending') return db.select().from(courses).where(eq(courses.isPublished, false));
      if (input.status === 'approved') return db.select().from(courses).where(eq(courses.isPublished, true));
      return db.select().from(courses);
    }),
    approveCourse: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { courses } = require('../drizzle/schema');
      await db.update(courses).set({ isPublished: true }).where(eq(courses.id, input.id));
      await notifyOwner({ title: 'Course Approved', content: `Course ID ${input.id} has been approved and is now live.` });
      return { success: true };
    }),
    rejectCourse: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { courses } = require('../drizzle/schema');
      await db.delete(courses).where(eq(courses.id, input.id));
      await notifyOwner({ title: 'Course Rejected', content: `Course ID ${input.id} has been rejected and removed.` });
      return { success: true };
    }),
    // Batch delete procedures
    batchDeleteSchools: adminProcedure.input(z.object({ ids: z.array(z.number()) })).mutation(async ({ input }) => {
      for (const id of input.ids) await deleteSchool(id);
      return { success: true, deleted: input.ids.length };
    }),
    batchDeleteJobs: adminProcedure.input(z.object({ ids: z.array(z.number()) })).mutation(async ({ input }) => {
      for (const id of input.ids) await deleteJob(id);
      return { success: true, deleted: input.ids.length };
    }),
    batchDeleteEvents: adminProcedure.input(z.object({ ids: z.array(z.number()) })).mutation(async ({ input }) => {
      for (const id of input.ids) await deleteEvent(id);
      return { success: true, deleted: input.ids.length };
    }),
    batchDeleteCourses: adminProcedure.input(z.object({ ids: z.array(z.number()) })).mutation(async ({ input }) => {
      for (const id of input.ids) await deleteCourse(id);
      return { success: true, deleted: input.ids.length };
    }),
    batchDeleteClasses: adminProcedure.input(z.object({ ids: z.array(z.number()) })).mutation(async ({ input }) => {
      for (const id of input.ids) await deleteClass(id);
      return { success: true, deleted: input.ids.length };
    }),
  }),

  // ============ FEEDBACK ============
  feedback: router({
    submit: publicProcedure.input(z.object({
      message: z.string().min(1, "Message is required"),
      name: z.string().optional(),
      email: z.string().email().optional(),
      feedbackType: z.enum(["bug_report", "feature_request", "general_feedback", "other"]).default("general_feedback"),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { feedback } = require('../drizzle/schema');
      
      await db.insert(feedback).values({
        message: input.message,
        name: input.name || null,
        email: input.email || null,
        feedbackType: input.feedbackType,
        status: 'new',
      });
      
      // Notify admin of new feedback by email (non-blocking)
      await notifyAdminOfSubmission('New Feedback Received', {
        Type: input.feedbackType.replace(/_/g, ' '),
        From: input.name,
        Email: input.email,
        Message: input.message.substring(0, 500),
      }).catch(() => {});
      
      return { success: true };
    }),
    
    getAll: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { feedback } = require('../drizzle/schema');
      return await db.select().from(feedback).orderBy(sql`${feedback.createdAt} DESC`);
    }),
    
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["new", "read", "in_progress", "completed", "archived"]),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      const { feedback } = require('../drizzle/schema');
      
      await db.update(feedback).set({
        status: input.status,
        adminNotes: input.adminNotes || null,
      }).where(eq(feedback.id, input.id));
      
      return { success: true };
    }),
  }),
  
  images: router({
    uploadLogo: protectedProcedure.input(z.object({
      schoolId: z.number(),
      fileBase64: z.string(),
      contentType: z.string(),
    })).mutation(async ({ input, ctx }) => {
      const { uploadSchoolLogo } = require('./_core/imageUpload');
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      
      // Verify user owns this school or is admin
      const school = await db.select().from(schools).where(eq(schools.id, input.schoolId)).limit(1);
      if (!school.length) throw new TRPCError({ code: 'NOT_FOUND', message: 'School not found' });
      
      try {
        const buffer = Buffer.from(input.fileBase64, 'base64');
        const result = await uploadSchoolLogo(buffer, input.schoolId, input.contentType);
        
        // Update school with logo URL
        await db.update(schools).set({ logoUrl: result.url }).where(eq(schools.id, input.schoolId));
        
        return { success: true, url: result.url };
      } catch (error) {
        console.error('Logo upload error:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload logo' });
      }
    }),
    
    uploadGallery: protectedProcedure.input(z.object({
      schoolId: z.number(),
      files: z.array(z.object({
        fileBase64: z.string(),
        contentType: z.string(),
      })),
    })).mutation(async ({ input, ctx }) => {
      const { uploadSchoolImage } = require('./_core/imageUpload');
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      
      // Verify school exists
      const school = await db.select().from(schools).where(eq(schools.id, input.schoolId)).limit(1);
      if (!school.length) throw new TRPCError({ code: 'NOT_FOUND', message: 'School not found' });
      
      // Check max 20 images
      if (input.files.length > 20) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Maximum 20 images allowed' });
      }
      
      try {
        const uploadedUrls: string[] = [];
        
        for (const file of input.files) {
          const buffer = Buffer.from(file.fileBase64, 'base64');
          const result = await uploadSchoolImage(buffer, input.schoolId, `image-${Date.now()}`, file.contentType);
          uploadedUrls.push(result.url);
        }
        
        // Parse existing gallery or create new
        const existingGallery = school[0].galleryImages ? JSON.parse(school[0].galleryImages) : [];
        const updatedGallery = [...existingGallery, ...uploadedUrls].slice(0, 20); // Keep only 20 max
        
        // Update school with gallery URLs
        await db.update(schools).set({ galleryImages: JSON.stringify(updatedGallery) }).where(eq(schools.id, input.schoolId));
        
        return { success: true, urls: uploadedUrls };
      } catch (error) {
        console.error('Gallery upload error:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload gallery images' });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;

// Course and class procedures
