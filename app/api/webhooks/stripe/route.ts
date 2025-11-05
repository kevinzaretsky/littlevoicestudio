import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

/**
 * Stripe webhook endpoint
 * Listens for checkout.session.completed events
 * Updates order status and shipping info
 */
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.arrayBuffer();
  const payload = Buffer.from(buf);

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET || !sig) {
      throw new Error('Missing webhook secret or signature');
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      await prisma.order.update({
        where: { stripeSession: session.id },
        data: {
          status: 'paid',
          email: session.customer_details?.email || null,
          shippingName: session.shipping_details?.name || null,
          shippingPhone: session.customer_details?.phone || null,
          shippingAddr: session.shipping_details?.address || null,
        },
      });

      console.log(`✅ Order updated to PAID: ${session.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('❌ Stripe webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
