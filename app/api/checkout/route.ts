import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { items } = await req.json();
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 });

  const line_items = items.map((i:any)=> ({
    price_data: {
      currency: 'eur',
      product_data: { name: i.name, metadata: { productId: i.productId, color: i.color||'', size: i.size||'', customizationUrl: i.customizationUrl||'' } },
      unit_amount: i.priceCents
    },
    quantity: i.quantity
  }));
  line_items.push({ price_data: { currency: 'eur', product_data: { name: 'Shipping (DHL)' }, unit_amount: 499 }, quantity: 1 });

  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    shipping_address_collection: { allowed_countries: ['DE','AT','CH','NL','FR','ES','IT','BE','DK','SE'] },
    success_url: `${origin}/en/success`,
    cancel_url: `${origin}/en/cart`,
  });

  await prisma.order.create({
    data: {
      stripeSession: session.id,
      amountTotal: line_items.reduce((a:any, b:any)=> a + b.price_data.unit_amount * (b.quantity||1), 0),
      currency: 'eur',
      items,
      status: 'pending'
    }
  });

  return NextResponse.json({ url: session.url });
}
