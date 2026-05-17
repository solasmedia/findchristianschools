import { Router, Request, Response } from 'express';
import { createCheckoutSession } from '../_core/stripe-checkout';

const router = Router();

// POST /api/stripe/checkout - Create a checkout session
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { amount, listingType, donationAmount, schoolName, contactEmail } = req.body;

    // Validate required fields
    if (!amount || !listingType || !schoolName || !contactEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create checkout session
    const { sessionId } = await createCheckoutSession({
      amount,
      listingType,
      donationAmount,
      schoolName,
      contactEmail,
    });

    res.json({ sessionId });
  } catch (error: any) {
    console.error('Checkout endpoint error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

export default router;
