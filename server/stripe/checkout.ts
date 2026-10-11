import Stripe from "stripe";
import { PRODUCTS } from "./products";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  }
  return _stripe;
}

export async function createPremiumCheckout(params: {
  schoolId?: number;
  collegeId?: number;
  schoolName: string;
  userEmail: string;
  userId: number;
  origin: string;
  promoCode?: string;
}) {
  const listingType = params.collegeId ? 'college' : 'school';
  const listingId = params.collegeId || params.schoolId || 0;
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    allow_promotion_codes: true,
    discounts: params.promoCode ? [{ coupon: params.promoCode }] : undefined,
    metadata: {
      school_id: listingId.toString(),
      listing_type: listingType,
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
    },
    line_items: [
      {
        price_data: {
          currency: PRODUCTS.premiumMembership.currency,
          product_data: {
            name: PRODUCTS.premiumMembership.name,
            description: `Premium listing for ${params.schoolName}`,
          },
          unit_amount: PRODUCTS.premiumMembership.priceAmount,
          recurring: { interval: PRODUCTS.premiumMembership.interval },
        },
        quantity: 1,
      },
    ],
    success_url: `${params.origin}/membership/success?school_id=${listingId}&type=${listingType}`,
    cancel_url: `${params.origin}/membership`,
  });

  return { url: session.url };
}

export async function createDonationCheckout(params: {
  amount: number; // in cents
  recurring: boolean;
  email?: string;
  userId?: number;
  origin: string;
}) {
  const product = params.recurring ? PRODUCTS.donationRecurring : PRODUCTS.donationOneTime;
  const mode = params.recurring ? "subscription" : "payment";

  const session = await getStripe().checkout.sessions.create({
    mode,
    customer_email: params.email || undefined,
    client_reference_id: params.userId?.toString(),
    allow_promotion_codes: false,
    metadata: {
      type: "donation",
      recurring: params.recurring.toString(),
      user_id: params.userId?.toString() || "anonymous",
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: params.amount,
          ...(params.recurring ? { recurring: { interval: "month" as const } } : {}),
        },
        quantity: 1,
      },
    ],
    success_url: `${params.origin}/mission?donated=true`,
    cancel_url: `${params.origin}/mission`,
  });

  return { url: session.url };
}

/**
 * One-time checkout for a premium teacher resource packet.
 * After payment, the Stripe webhook records the purchase keyed by
 * postId + email, unlocking the full download.
 */
export async function createResourceCheckout(params: {
  postId: number;
  postSlug: string;
  postTitle: string;
  resourceTitle: string;
  priceCents: number;
  userEmail: string;
  origin: string;
}) {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: params.userEmail,
    metadata: {
      purchase_type: "blog_resource",
      post_id: params.postId.toString(),
      post_title: params.postTitle,
      customer_email: params.userEmail,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: params.resourceTitle,
            description: `Premium teaching resource from FindChristianSchools.org — "${params.postTitle}"`,
          },
          unit_amount: params.priceCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${params.origin}/blog/${params.postSlug}?purchased=true&email=${encodeURIComponent(params.userEmail)}`,
    cancel_url: `${params.origin}/blog/${params.postSlug}`,
  });

  return { url: session.url, sessionId: session.id };
}
