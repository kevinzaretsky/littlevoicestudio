export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  color?: string | null;
  size?: string | null;
  customizationUrl?: string | null;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const { items, locale = 'en' } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i: CartItem) => ({
      quantity: i.quantity || 1,
      price_data: {
        currency: 'eur',
        product_data: {
          name: i.name,
          metadata: {
            productId: i.productId || '',
            color: i.color || '',
            size: i.size || '',
            customizationUrl: i.customizationUrl || '',
            slug: i.slug || '',
          },
        },
        unit_amount: i.priceCents,
      },
    }));

    // Add shipping as a line item (4.99€) with minimal metadata fields your TS expects
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        product_data: {
          name: locale === 'de' ? 'Versand (DHL)' : 'Shipping (DHL)',
          metadata: {
            productId: 'shipping',
            color: '',
            size: '',
            customizationUrl: '',
            slug: 'shipping',
          },
        },
        unit_amount: 499,
      },
    });

    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${origin}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cart`,
      shipping_address_collection: { allowed_countries: ['DE', 'AT', 'CH', 'NL', 'BE', 'LU', 'FR', 'IT', 'ES'] },
      metadata: {
        locale,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Checkout failed' }, { status: 500 });
  }
}
