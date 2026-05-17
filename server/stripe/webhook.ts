import Stripe from "stripe";
import type { Request, Response } from "express";
import { getDb } from "../db";
import { schools } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
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
      const schoolId = session.metadata?.school_id;
      const schoolName = session.metadata?.schoolName;
      const listingType = session.metadata?.listingType;
      const donationAmount = session.metadata?.donationAmount;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      const db = await getDb();
      if (!db) break;

      // Handle both old (school_id) and new (schoolName) metadata formats
      let targetSchoolId: number | null = null;
      if (schoolId) {
        targetSchoolId = parseInt(schoolId);
      } else if (schoolName) {
        // Find school by name
        const schoolResult = await db.select().from(schools).where(eq(schools.name, schoolName)).limit(1);
        if (schoolResult.length > 0) {
          targetSchoolId = schoolResult[0].id;
        }
      }

      if (targetSchoolId) {
        const updateData: any = {
          stripeCustomerId: customerId,
          stripePaymentIntentId: session.payment_intent as string,
        };

        if (listingType === "premium") {
          updateData.isPremium = true;
          updateData.listingType = "premium";
          const premiumExpiresAt = new Date();
          premiumExpiresAt.setFullYear(premiumExpiresAt.getFullYear() + 1);
          updateData.premiumExpiresAt = premiumExpiresAt;
          updateData.stripeSubscriptionId = subscriptionId;
        } else if (listingType === "donate") {
          updateData.listingType = "donate";
          if (donationAmount) {
            updateData.donationAmount = parseInt(donationAmount);
          }
        } else {
          updateData.listingType = "free";
        }

        await db.update(schools).set(updateData).where(eq(schools.id, targetSchoolId));
        console.log(`[Webhook] School ${targetSchoolId} payment processed (${listingType})`);

        // Send email notification
        try {
          const schoolResult = await db.select().from(schools).where(eq(schools.id, targetSchoolId)).limit(1);
          if (schoolResult.length > 0) {
            const amount = session.amount_total ? session.amount_total / 100 : (listingType === "premium" ? 99 : parseInt(donationAmount || "0"));
            await notifyPremiumPurchase(schoolResult[0], amount).catch(() => {});
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
        console.log(`[Webhook] Subscription ${subscription.id} cancelled`);
      }
      break;
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}
