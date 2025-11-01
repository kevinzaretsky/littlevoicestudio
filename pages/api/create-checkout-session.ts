// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock checkout disabled for now
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simply return a success message (no Stripe call)
  return res.status(200).json({
    message: 'Stripe checkout temporarily disabled — site running without payment.',
    url: null
  });
}
