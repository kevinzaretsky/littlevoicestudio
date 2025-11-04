import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { size, epoxy, color, quantity, imageUrl } = body || {};

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' });

    // Demo pricing logic (EUR, cents)
    let unitAmount = 15000; // 150.00€ base for 40x40
    if (size === '60x60') unitAmount += 2000; // +20€
    if (epoxy) unitAmount += 500; // +5€

    const qty = Math.max(1, Number(quantity) || 1);
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Custom Symbol Board (${size || '40x40'}${epoxy ? ', epoxy' : ''}, ${color || 'white'})`,
            images: imageUrl ? [imageUrl] : undefined,
            metadata: { imageUrl: imageUrl || '' }
          },
          unit_amount: unitAmount,
        },
        quantity: qty,
      }],
      success_url: `${siteUrl}/?success=1`,
      cancel_url: `${siteUrl}/?canceled=1`,
      metadata: { size: size || '', epoxy: epoxy ? 'yes' : 'no', color: color || '', imageUrl: imageUrl || '' }
    });

    return NextResponse.json({ url: session.url });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
