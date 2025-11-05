import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required'}, { status: 400 });
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (!order.shippingAddr) return NextResponse.json({ error: 'Missing shipping address' }, { status: 400 });

  const trackingNumber = 'DHL' + Math.random().toString().slice(2,12);
  const labelUrl = `https://api.mock.local/labels/${trackingNumber}.pdf`;

  await prisma.order.update({ where: { id: orderId }, data: { trackingNumber, labelUrl, status: 'fulfilled' } });
  return NextResponse.json({ trackingNumber, labelUrl });
}
