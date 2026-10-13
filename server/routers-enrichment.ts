/**
 * Enrichment & Activities router — tutors, classes, sports, camps, youth
 * groups, music & arts, homeschool co-ops/resources.
 *
 * Mirrors the schools patterns:
 *  - public search with ZIP + 25-mile radius (see searchSchools in db.ts)
 *  - public submission with SoF + accuracy attestations (submission.submitSchool)
 *  - app-level promo codes stored on the listing row (NOT Stripe coupons);
 *    a 100% code activates premium directly with no card, exactly like the
 *    school path in server/_core/stripe-checkout.ts
 *  - premium checkout via Stripe (server/stripe/checkout.ts) with the
 *    webhook activating premium on checkout.session.completed
 *
 * Verification is admin-reviewed only (no external check APIs). A listing
 * earns a badge solely when an admin sets verificationStatus = "approved".
 * Badge wording lives in shared/enrichment.ts and must not be improvised.
 */
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "./rateLimit";
import { notifyAdminOfSubmission } from "./_core/emailNotifications";
import { createEnrichmentCheckout } from "./stripe/checkout";
import {
  searchEnrichmentListings,
  getEnrichmentBySlug,
  getEnrichmentCountsByCategory,
  createEnrichmentListing,
  updateEnrichmentListing,
  deleteEnrichmentListing,
  getPendingEnrichmentListings,
  getPendingEnrichmentVerifications,
  getAllEnrichmentAdmin,
  createEnrichmentReport,
  getEnrichmentReports,
  updateEnrichmentReport,
  getDb,
} from "./db";
import { enrichmentListings } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { ENRICHMENT_CATEGORY_KEYS, slugifyEnrichment } from "../shared/enrichment";

const categoryEnum = z.enum(ENRICHMENT_CATEGORY_KEYS as [string, ...string[]]);
const listerTypeEnum = z.enum(["individual", "business", "organization"]);

async function uniqueSlug(base: string): Promise<string> {
  const db = await getDb();
  if (!db) return base;
  let slug = base;
  let n = 2;
  // Bounded loop — slug collisions are rare.
  for (let i = 0; i < 50; i++) {
    const rows = await db
      .select({ id: enrichmentListings.id })
      .from(enrichmentListings)
      .where(eq(enrichmentListings.slug, slug))
      .limit(1);
    if (rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
  return `${base}-${Date.now()}`;
}

export const enrichmentRouter = router({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        category: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        zip: z.string().optional(),
        radius: z.number().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
    )
    .query(({ input }) => searchEnrichmentListings(input)),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => getEnrichmentBySlug(input.slug)),

  countsByCategory: publicProcedure.query(() => getEnrichmentCountsByCategory()),

  // ============ PUBLIC SUBMISSION ("List your program") ============
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: categoryEnum,
        subcategory: z.string().optional(),
        listerType: listerTypeEnum,
        description: z.string().optional(),
        address: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1),
        stateCode: z.string().length(2),
        zip: z.string().min(1),
        phone: z.string().optional(),
        website: z.string().optional(),
        email: z.string().optional(),
        contactName: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        agesOrGrades: z.string().optional(),
        denomination: z.string().optional(),
        logoUrl: z.string().optional(),
        coverImageUrl: z.string().optional(),
        statementOfFaith: z.string().min(1, "Statement of Faith is required"),
        // Attestations (required — enforced below, mirroring submitSchool)
        sofAttested: z.boolean().default(false),
        certifiedAccurate: z.boolean().default(false),
        // Verification — businesses/orgs: EIN + legal name (required)
        ein: z.string().optional(),
        legalName: z.string().optional(),
        // Verification — individuals: ID + background-check attestations,
        // background check date, two references (required)
        idAttested: z.boolean().default(false),
        backgroundCheckAttested: z.boolean().default(false),
        backgroundCheckDate: z.string().optional(),
        reference1Name: z.string().optional(),
        reference1Contact: z.string().optional(),
        reference2Name: z.string().optional(),
        reference2Contact: z.string().optional(),
        // Tier + payment
        listingType: z.enum(["free", "premium"]).optional().default("free"),
        promoCode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const key = getRateLimitKey("submission", undefined, ctx.req.ip);
      if (!checkRateLimit(key, RATE_LIMITS.submission)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many submissions. Please try again in an hour.",
        });
      }
      if (!input.certifiedAccurate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must certify that the information is accurate before submitting.",
        });
      }
      if (!input.sofAttested) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must affirm that the organization aligns with our Statement of Faith before submitting.",
        });
      }

      // Verification payload is captured at submission and queued for admin
      // review. Businesses/organizations verify documents (EIN + legal
      // name); individuals verify ID + background check attestations.
      const isIndividual = input.listerType === "individual";
      if (isIndividual) {
        if (!input.idAttested || !input.backgroundCheckAttested) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Individual listers must attest to their government ID and a current background check.",
          });
        }
        if (!input.backgroundCheckDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Please provide the date of your most recent background check.",
          });
        }
        if (!input.reference1Name || !input.reference2Name) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Individual listers must provide two references (church or school).",
          });
        }
      } else {
        if (!input.ein || !input.legalName) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Businesses and organizations must provide their EIN and legal business name for verification.",
          });
        }
      }

      // Validate any promo code BEFORE creating the listing so a bad code
      // doesn't leave an orphan submission. App-level promo codes live on a
      // listing row (admin-set), exactly like schools.promoCode; the code
      // must belong to a listing with the same name as the one submitted.
      let promoDiscountPercent = 0;
      if (input.listingType === "premium" && input.promoCode) {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const rows = await db
          .select()
          .from(enrichmentListings)
          .where(eq(enrichmentListings.promoCode, input.promoCode.toUpperCase()))
          .limit(1);
        const promoListing = rows[0];
        if (!promoListing || promoListing.name.trim().toLowerCase() !== input.name.trim().toLowerCase()) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid promo code" });
        }
        promoDiscountPercent = promoListing.promoDiscountPercent ?? 0;
      }

      const slug = await uniqueSlug(
        slugifyEnrichment(input.name, input.city, input.stateCode.toUpperCase()),
      );

      const created = await createEnrichmentListing({
        name: input.name,
        slug,
        category: input.category,
        subcategory: input.subcategory || undefined,
        listerType: input.listerType,
        description: input.description || undefined,
        address: input.address || undefined,
        city: input.city,
        state: input.state,
        stateCode: input.stateCode.toUpperCase(),
        zip: input.zip,
        phone: input.phone || undefined,
        website: input.website || undefined,
        email: input.email || undefined,
        contactName: input.contactName || undefined,
        contactEmail: input.contactEmail || undefined,
        contactPhone: input.contactPhone || undefined,
        agesOrGrades: input.agesOrGrades || undefined,
        denomination: input.denomination || undefined,
        logoUrl: input.logoUrl || undefined,
        coverImageUrl: input.coverImageUrl || undefined,
        statementOfFaith: input.statementOfFaith,
        sofAttested: true,
        sofAttestedAt: new Date(),
        certifiedAccurate: true,
        listingType: input.listingType || "free",
        isPremium: false,
        isApproved: false,
        listingStatus: "community_submitted",
        ownerId: ctx.user?.id,
        verificationStatus: "pending",
        verificationType: isIndividual ? "id_background" : "documents",
        ein: input.ein || undefined,
        legalName: input.legalName || undefined,
        idAttested: input.idAttested || false,
        backgroundCheckAttested: input.backgroundCheckAttested || false,
        backgroundCheckDate: input.backgroundCheckDate || undefined,
        reference1Name: input.reference1Name || undefined,
        reference1Contact: input.reference1Contact || undefined,
        reference2Name: input.reference2Name || undefined,
        reference2Contact: input.reference2Contact || undefined,
      } as any);

      const listingId = created.id;

      await notifyAdminOfSubmission(`New Enrichment Listing Submitted: ${input.name}`, {
        Listing: input.name,
        Category: input.category,
        "Lister type": input.listerType,
        City: input.city,
        State: input.state,
        Tier: input.listingType || "free",
        Verification: isIndividual ? "ID & background check (individual)" : "Documents — EIN + legal name (business/org)",
        Contact: input.contactName,
        Email: input.contactEmail || input.email,
      }).catch(() => {});

      // ---- Premium tier: 100% promo activates free; otherwise Stripe ----
      if (input.listingType === "premium") {
        const checkoutEmail = input.email || input.contactEmail;

        if (promoDiscountPercent >= 100) {
          // 100% promo: activate premium directly — no Stripe, no card.
          const premiumExpiresAt = new Date();
          premiumExpiresAt.setFullYear(premiumExpiresAt.getFullYear() + 1);
          await updateEnrichmentListing(listingId, {
            isPremium: true,
            featured: true,
            listingType: "premium",
            premiumExpiresAt,
          } as any);
          return {
            success: true,
            slug,
            id: listingId,
            free: true,
            message: "Promo code applied — your Premium listing is free for one year!",
          };
        }

        if (!checkoutEmail) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "An email address is required for a Premium listing checkout.",
          });
        }
        const origin = ctx.req.headers.origin || "https://www.findchristianschools.com";
        const { url } = await createEnrichmentCheckout({
          enrichmentId: listingId,
          listingName: input.name,
          listerType: input.listerType,
          userEmail: checkoutEmail,
          userId: ctx.user?.id,
          origin,
          discountPercent: promoDiscountPercent,
        });
        return { success: true, slug, id: listingId, checkoutUrl: url };
      }

      return { success: true, slug, id: listingId };
    }),

  // ============ OWNER UPGRADE (logged-in) ============
  createCheckout: protectedProcedure
    .input(
      z.object({
        listingId: z.number(),
        promoCode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const rows = await db
        .select()
        .from(enrichmentListings)
        .where(eq(enrichmentListings.id, input.listingId))
        .limit(1);
      const listing = rows[0];
      if (!listing) throw new TRPCError({ code: "NOT_FOUND", message: "Listing not found" });

      let discountPercent = 0;
      if (input.promoCode) {
        // A code only applies to the listing that owns it (school pattern).
        if (!listing.promoCode || listing.promoCode.toUpperCase() !== input.promoCode.toUpperCase()) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid promo code" });
        }
        discountPercent = listing.promoDiscountPercent ?? 0;
        if (discountPercent >= 100) {
          const premiumExpiresAt = new Date();
          premiumExpiresAt.setFullYear(premiumExpiresAt.getFullYear() + 1);
          await updateEnrichmentListing(listing.id, {
            isPremium: true,
            featured: true,
            listingType: "premium",
            premiumExpiresAt,
          } as any);
          const origin = ctx.req.headers.origin || "https://www.findchristianschools.com";
          return { url: `${origin}/enrichment?status=success&listing_id=${listing.id}&promo=applied` };
        }
      }

      const origin = ctx.req.headers.origin || "https://www.findchristianschools.com";
      return createEnrichmentCheckout({
        enrichmentId: listing.id,
        listingName: listing.name,
        listerType: listing.listerType as "individual" | "business" | "organization",
        userEmail: ctx.user.email || "",
        userId: ctx.user.id,
        origin,
        discountPercent,
      });
    }),

  // ============ REPORT A LISTING ============
  report: publicProcedure
    .input(
      z.object({
        listingId: z.number(),
        listingName: z.string().optional(),
        reason: z.enum(["fraudulent", "incorrect_info", "inappropriate", "closed", "safety_concern", "other"]),
        details: z.string().optional(),
        reporterName: z.string().optional(),
        reporterEmail: z.string().email().optional().or(z.literal("")),
      }),
    )
    .mutation(async ({ input }) => {
      await createEnrichmentReport({
        listingId: input.listingId,
        listingName: input.listingName,
        reason: input.reason,
        details: input.details,
        reporterName: input.reporterName,
        reporterEmail: input.reporterEmail || undefined,
      });
      await notifyAdminOfSubmission(`Enrichment Listing Report: ${input.listingName || `Listing #${input.listingId}`}`, {
        Listing: input.listingName || `ID ${input.listingId}`,
        Reason: input.reason,
        Details: input.details || "None provided",
        Reporter: input.reporterName || "Anonymous",
        Email: input.reporterEmail || "no email",
        Note: "REMOVAL-FIRST POLICY: if this report is credible, suspend the listing first and review after.",
      }).catch(() => {});
      return { success: true };
    }),
});

// ============ ADMIN ============
export const enrichmentAdminRouter = router({
  pendingListings: adminProcedure.query(() => getPendingEnrichmentListings()),
  pendingVerifications: adminProcedure.query(() => getPendingEnrichmentVerifications()),
  allListings: adminProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
    .query(({ input }) => getAllEnrichmentAdmin(input)),
  reports: adminProcedure
    .input(z.object({ status: z.string().optional() }))
    .query(({ input }) => getEnrichmentReports(input.status)),

  approveListing: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) =>
      updateEnrichmentListing(input.id, { isApproved: true, listingStatus: "active" } as any),
    ),
  rejectListing: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) =>
      updateEnrichmentListing(input.id, { isApproved: false, listingStatus: "removed" } as any),
    ),
  suspendListing: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => updateEnrichmentListing(input.id, { listingStatus: "suspended" } as any)),
  reactivateListing: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) =>
      updateEnrichmentListing(input.id, { isApproved: true, listingStatus: "active" } as any),
    ),

  approveVerification: adminProcedure
    .input(z.object({ id: z.number(), notes: z.string().optional() }))
    .mutation(({ ctx, input }) =>
      updateEnrichmentListing(input.id, {
        verificationStatus: "approved",
        verifiedAt: new Date(),
        verifiedBy: ctx.user.email || ctx.user.name || "admin",
        verificationNotes: input.notes || undefined,
      } as any),
    ),
  rejectVerification: adminProcedure
    .input(z.object({ id: z.number(), notes: z.string().optional() }))
    .mutation(({ input }) =>
      updateEnrichmentListing(input.id, {
        verificationStatus: "rejected",
        verificationNotes: input.notes || undefined,
      } as any),
    ),

  updateListing: adminProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          category: categoryEnum.optional(),
          subcategory: z.string().optional(),
          listerType: listerTypeEnum.optional(),
          description: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          stateCode: z.string().optional(),
          zip: z.string().optional(),
          phone: z.string().optional(),
          website: z.string().optional(),
          email: z.string().optional(),
          isPremium: z.boolean().optional(),
          featured: z.boolean().optional(),
          isApproved: z.boolean().optional(),
          listingStatus: z.enum(["pending", "active", "removed", "suspended", "community_submitted"]).optional(),
          promoCode: z.string().nullable().optional(),
          promoDiscountPercent: z.number().nullable().optional(),
          internalNotes: z.string().optional(),
        }),
      }),
    )
    .mutation(({ input }) => updateEnrichmentListing(input.id, input.data as any)),

  deleteListing: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteEnrichmentListing(input.id)),

  updateReport: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewed", "actioned", "dismissed"]),
        adminNotes: z.string().optional(),
      }),
    )
    .mutation(({ input }) =>
      updateEnrichmentReport(input.id, {
        status: input.status,
        adminNotes: input.adminNotes || undefined,
      } as any),
    ),
});
