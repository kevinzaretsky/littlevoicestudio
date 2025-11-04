import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { size, epoxy, color, quantity, imageUrl } = body;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

  // Demo pricing logic (EUR, cents)
  let unitAmount = 15000; // 150.00€ base for 40x40
  if (size === '60x60') unitAmount += 2000; // +20€
  if (epoxy) unitAmount += 500; // +5€

  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Custom Symbol Board (${size}${epoxy ? ', epoxy' : ''}, ${color})`,
          images: imageUrl ? [imageUrl] : undefined,
          metadata: { imageUrl: imageUrl || '' }
        },
        unit_amount: unitAmount,
      },
      quantity: Math.max(1, Number(quantity) || 1),
    }],
    success_url: `${siteUrl}/?success=1`,
    cancel_url: `${siteUrl}/?canceled=1`,
    metadata: {
      size, epoxy: epoxy ? 'yes' : 'no', color, imageUrl: imageUrl || ''
    }
  });

  return NextResponse.json({ url: session.url });
}
