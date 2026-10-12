import Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { schools } from '../../drizzle/schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export interface CheckoutSessionRequest {
  amount: number; // Amount in cents
  listingType: 'free' | 'donate' | 'premium';
  donationAmount?: number;
  schoolName: string;
  contactEmail: string;
  // App-level promo code (schools.promoCode / promoDiscountPercent). Only the
  // school that owns the code can use it. 100% codes skip Stripe entirely.
  promoCode?: string;
}

export interface CheckoutSessionResult {
  sessionId?: string;
  free?: boolean;
}

export async function createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResult> {
  const { listingType, schoolName, contactEmail } = req;
  let amount = req.amount;

  // Resolve app-level promo codes for premium listings.
  if (req.promoCode && listingType === 'premium') {
    const db = await getDb();
    if (!db) throw new Error('Database unavailable');
    const rows = await db.select().from(schools).where(eq(schools.promoCode, req.promoCode.toUpperCase())).limit(1);
    const promoSchool = rows[0];
    if (!promoSchool) throw new Error('Invalid promo code');
    if (promoSchool.name.trim().toLowerCase() !== schoolName.trim().toLowerCase()) {
      throw new Error('Promo code is not valid for this school');
    }
    const discountPercent = promoSchool.promoDiscountPercent ?? 0;
    if (discountPercent >= 100) {
      // 100% promo: activate premium directly — no Stripe session, no card.
      const premiumExpiresAt = new Date();
      premiumExpiresAt.setFullYear(premiumExpiresAt.getFullYear() + 1);
      await db.update(schools).set({
        isPremium: true,
        listingType: 'premium',
        premiumExpiresAt,
      }).where(eq(schools.id, promoSchool.id));
      return { free: true };
    }
    if (discountPercent > 0) {
      amount = Math.round(amount * (100 - discountPercent) / 100);
    }
  }

  // Create line item based on listing type
  let lineItems: Stripe.Checkout.SessionCreateParams['line_items'] = [];
  
  if (listingType === 'premium') {
    lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Premium School Listing',
            description: `Premium listing for ${schoolName} - 1 year subscription`,
          },
          unit_amount: amount,
          recurring: {
            interval: 'year',
            interval_count: 1,
          } as any,
        },
        quantity: 1,
      } as any,
    ];
  } else if (listingType === 'donate') {
    lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation to Christian Education Mission',
            description: `Donation from ${schoolName} to support Christian education missions globally`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      } as any,
    ];
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: listingType === 'premium' ? 'subscription' : 'payment',
      success_url: `${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/submit?success=true&listing=${listingType}`,
      cancel_url: `${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/submit?step=7`,
      customer_email: contactEmail,
      metadata: {
        schoolName,
        listingType,
        donationAmount: req.donationAmount?.toString() || '',
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    throw new Error('Failed to create payment session');
  }
}
