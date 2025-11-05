import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.arrayBuffer();
  const payload = Buffer.from(buf);

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET || !sig) throw new Error('Missing webhook secret/signature');
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      await prisma.order.update({
        where: { stripeSession: session.id },
        data: {
          status: 'paid',
          email: session.customer_details?.email || null,
          shippingName: session.shipping_details?.name || null,
          shippingPhone: session.customer_details?.phone || null,
          shippingAddr: session.shipping_details?.address || null
        }
      });
    }
    return NextResponse.json({ received: true });
  } catch (err:any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
