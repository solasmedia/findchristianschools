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
  // App-level promo discount (0-100), already validated by the caller against
  // the schools.promoCode / promoDiscountPercent columns. Applied by adjusting
  // the price_data amount — app promo codes are NOT Stripe coupons.
  discountPercent?: number;
}) {
  const listingType = params.collegeId ? 'college' : 'school';
  const listingId = params.collegeId || params.schoolId || 0;
  const product = params.collegeId ? PRODUCTS.premiumCollegeListing : PRODUCTS.premiumMembership;
  const discountPercent = Math.min(100, Math.max(0, params.discountPercent ?? 0));
  const unitAmount = Math.round(product.priceAmount * (100 - discountPercent) / 100);
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      school_id: listingId.toString(),
      listing_type: listingType,
      // The webhook's premium-activation branch keys off listingType /
      // schoolName — the contract set by the submit-school form path
      // (server/_core/stripe-checkout.ts). This function only ever sells
      // premium listings, so state that explicitly. Without these keys the
      // webhook stamped paid Membership/profile-path listings as "free"
      // and never activated premium.
      listingType: "premium",
      schoolName: params.schoolName,
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
    },
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: `Premium listing for ${params.schoolName}`,
          },
          unit_amount: unitAmount,
          recurring: { interval: product.interval },
        },
        quantity: 1,
      },
    ],
    success_url: `${params.origin}/membership?status=success&school_id=${listingId}&type=${listingType}`,
    cancel_url: `${params.origin}/membership`,
  });

  return { url: session.url };
}

/**
 * Premium checkout for Enrichment & Activities listings.
 *
 * The webhook's enrichment branch keys off metadata.listing_type ===
 * "enrichment" + metadata.enrichment_id + metadata.listingType ===
 * "premium". Keep those keys in sync with server/stripe/webhook.ts.
 * App-level promo discounts are applied by adjusting the price_data
 * amount (app promo codes are NOT Stripe coupons), same as schools.
 */
export async function createEnrichmentCheckout(params: {
  enrichmentId: number;
  listingName: string;
  listerType: "individual" | "business" | "organization";
  userEmail: string;
  userId?: number;
  origin: string;
  discountPercent?: number;
}) {
  const product =
    params.listerType === "individual"
      ? PRODUCTS.premiumTutorListing
      : params.listerType === "organization"
        ? PRODUCTS.premiumOrganizationListing
        : PRODUCTS.premiumEnrichmentProvider;
  const discountPercent = Math.min(100, Math.max(0, params.discountPercent ?? 0));
  const unitAmount = Math.round(product.priceAmount * (100 - discountPercent) / 100);
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer_email: params.userEmail || undefined,
    client_reference_id: params.userId?.toString(),
    allow_promotion_codes: true,
    metadata: {
      listing_type: "enrichment",
      enrichment_id: params.enrichmentId.toString(),
      listingType: "premium",
      listingName: params.listingName,
      lister_type: params.listerType,
      user_id: params.userId?.toString() || "anonymous",
      customer_email: params.userEmail,
    },
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: `Premium Enrichment & Activities listing for ${params.listingName}`,
          },
          unit_amount: unitAmount,
          recurring: { interval: product.interval },
        },
        quantity: 1,
      },
    ],
    success_url: `${params.origin}/enrichment?status=success&listing_id=${params.enrichmentId}`,
    cancel_url: `${params.origin}/enrichment/submit`,
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
            description: `Premium teaching resource from FindChristianSchools.com — "${params.postTitle}"`,
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
