// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { lineItems } = req.body;
    if (!Array.isArray(lineItems) || !lineItems.length) {
      return res.status(400).json({ error: 'Missing lineItems' });
    }

    // If Stripe isn’t configured yet, don’t crash builds
    if (stripeSecret === 'sk_test_placeholder' || !process.env.STRIPE_SECRET_KEY) {
      return res.status(200).json({ url: null, error: 'Set STRIPE_SECRET_KEY to enable checkout.' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems.map((li: any) => ({
        price_data: {
          currency: li.currency || 'eur',
          product_data: { name: li.name || 'Item' },
          unit_amount: li.amount,
        },
        quantity: li.quantity || 1,
      })),
      success_url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/?success=1',
      cancel_url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/?canceled=1',
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Stripe error' });
  }
}
