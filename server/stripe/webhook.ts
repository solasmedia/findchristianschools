import Stripe from "stripe";
import type { Request, Response } from "express";
import { getDb } from "../db";
import { schools, colleges, resourcePurchases, enrichmentListings } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { notifyPremiumPurchase } from "../_core/emailNotifications";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  }
  return _stripe;
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // --- Blog resource purchase (one-time) ---
      if (session.metadata?.purchase_type === "blog_resource") {
        const db = await getDb();
        if (db) {
          const postId = parseInt(session.metadata.post_id || "0");
          const email = session.metadata.customer_email || session.customer_email || "";
          const amountCents = session.amount_total ?? 0;
          if (postId && email) {
            // Idempotent: skip if already recorded
            const existing = await db
              .select()
              .from(resourcePurchases)
              .where(
                and(
                  eq(resourcePurchases.postId, postId),
                  eq(resourcePurchases.email, email)
                )
              )
              .limit(1);
            if (existing.length === 0) {
              await db.insert(resourcePurchases).values({
                postId,
                email,
                stripeSessionId: session.id,
                amountCents,
              });
              console.log(`[Webhook] Resource purchase recorded: post ${postId}, ${email}, $${(amountCents / 100).toFixed(2)}`);
            }
          }
        }
        return res.json({ received: true });
      }

      // --- Enrichment & Activities premium listing ---
      // Metadata contract set by createEnrichmentCheckout in
      // server/stripe/checkout.ts: listing_type=enrichment, enrichment_id,
      // listingType=premium. Handled before the school branch because these
      // sessions carry no school_id.
      if (session.metadata?.listing_type === "enrichment") {
        const db = await getDb();
        if (db) {
          const enrichmentId = parseInt(session.metadata.enrichment_id || "0");
          if (enrichmentId) {
            const updateData: any = {
              stripeCustomerId: session.customer as string,
              stripePaymentIntentId: session.payment_intent as string,
            };
            if (session.metadata.listingType === "premium") {
              updateData.isPremium = true;
              updateData.listingType = "premium";
              updateData.featured = true;
              const premiumExpiresAt = new Date();
              premiumExpiresAt.setFullYear(premiumExpiresAt.getFullYear() + 1);
              updateData.premiumExpiresAt = premiumExpiresAt;
              updateData.stripeSubscriptionId = session.subscription as string;
            }
            await db.update(enrichmentListings).set(updateData).where(eq(enrichmentListings.id, enrichmentId));
            console.log(`[Webhook] Enrichment listing ${enrichmentId} payment processed (${session.metadata.listingType})`);
          }
        }
        return res.json({ received: true });
      }

      const schoolId = session.metadata?.school_id;
      const schoolName = session.metadata?.schoolName;
      const listingType = session.metadata?.listingType;
      const stripeListingType = session.metadata?.listing_type; // entity kind: 'school' or 'college'
      const donationAmount = session.metadata?.donationAmount;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      const db = await getDb();
      if (!db) break;

      const isCollege = stripeListingType === 'college';

      // createPremiumCheckout (Membership / profile upgrade path) only ever
      // sells premium, and sessions created before it stamped listingType
      // into metadata carry only the entity kind (listing_type). Derive
      // "premium" from the entity kind when listingType is absent, or a
      // paid upgrade falls through to the free branch and premium never
      // activates.
      const effectiveListingType =
        listingType ??
        (stripeListingType === "school" || stripeListingType === "college"
          ? "premium"
          : undefined);

      // Handle both old (school_id) and new (schoolName) metadata formats
      let targetSchoolId: number | null = null;
      if (schoolId) {
        targetSchoolId = parseInt(schoolId);
      } else if (schoolName && !isCollege) {
        // Find school by name
        const schoolResult = await db.select().from(schools).where(eq(schools.name, schoolName)).limit(1);
        if (schoolResult.length > 0) {
          targetSchoolId = schoolResult[0].id;
        }
      }

      if (targetSchoolId) {
        if (isCollege) {
          // The colleges table has no listingType or donationAmount columns,
          // so its update payload is built separately — sending the
          // school-shaped payload would fail the whole update and premium
          // would never activate.
          const collegeUpdate: any = {
            stripeCustomerId: customerId,
            stripePaymentIntentId: session.payment_intent as string,
          };

          if (effectiveListingType === "premium") {
            collegeUpdate.isPremium = true;
            const premiumExpiresAt = new Date();
            premiumExpiresAt.setFullYear(premiumExpiresAt.getFullYear() + 1);
            collegeUpdate.premiumExpiresAt = premiumExpiresAt;
            collegeUpdate.stripeSubscriptionId = subscriptionId;
          }

          await db.update(colleges).set(collegeUpdate).where(eq(colleges.id, targetSchoolId));
          console.log(`[Webhook] College ${targetSchoolId} payment processed (${effectiveListingType})`);
        } else {
          const updateData: any = {
            stripeCustomerId: customerId,
            stripePaymentIntentId: session.payment_intent as string,
          };

          if (effectiveListingType === "premium") {
            updateData.isPremium = true;
            updateData.listingType = "premium";
            const premiumExpiresAt = new Date();
            premiumExpiresAt.setFullYear(premiumExpiresAt.getFullYear() + 1);
            updateData.premiumExpiresAt = premiumExpiresAt;
            updateData.stripeSubscriptionId = subscriptionId;
          } else if (effectiveListingType === "donate") {
            updateData.listingType = "donate";
            if (donationAmount) {
              updateData.donationAmount = parseInt(donationAmount);
            }
          } else {
            updateData.listingType = "free";
          }

          await db.update(schools).set(updateData).where(eq(schools.id, targetSchoolId));
          console.log(`[Webhook] School ${targetSchoolId} payment processed (${effectiveListingType})`);
        }

        // Send email notification
        try {
          if (!isCollege) {
            const schoolResult = await db.select().from(schools).where(eq(schools.id, targetSchoolId)).limit(1);
            if (schoolResult.length > 0) {
              const amount = session.amount_total ? session.amount_total / 100 : (effectiveListingType === "premium" ? 99 : parseInt(donationAmount || "0"));
              await notifyPremiumPurchase(schoolResult[0], amount).catch(() => {});
            }
          }
        } catch (err) {
          console.error('[Webhook] Failed to send purchase notification:', err);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const db = await getDb();
      if (db) {
        await db.update(schools).set({
          isPremium: false,
          premiumExpiresAt: null,
        }).where(eq(schools.stripeSubscriptionId, subscription.id));
        await db.update(colleges).set({
          isPremium: false,
          premiumExpiresAt: null,
        }).where(eq(colleges.stripeSubscriptionId, subscription.id));
        await db.update(enrichmentListings).set({
          isPremium: false,
          featured: false,
          premiumExpiresAt: null,
        }).where(eq(enrichmentListings.stripeSubscriptionId, subscription.id));
        console.log(`[Webhook] Subscription ${subscription.id} cancelled`);
      }
      break;
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}
