import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export interface CheckoutSessionRequest {
  amount: number; // Amount in cents
  listingType: 'free' | 'donate' | 'premium';
  donationAmount?: number;
  schoolName: string;
  contactEmail: string;
}

export async function createCheckoutSession(req: CheckoutSessionRequest) {
  const { amount, listingType, schoolName, contactEmail } = req;

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
