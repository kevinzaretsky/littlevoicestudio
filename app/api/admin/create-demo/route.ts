// app/api/admin/create-demo/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

async function upsertDemo() {
  const created = await prisma.product.upsert({
    where: { slug: 'symbol-board' },        // requires unique slug (we have it)
    update: { updatedAt: new Date() },       // idempotent
    create: {
      name: 'Symbol Board',
      slug: 'symbol-board',
      description: 'A customizable symbol board',
      priceCents: 14900,
      colorOptions: ['white','black','lime','orange','blue','yellow'],
      sizeOptions: ['40x40mm','60x60mm'],
      hasUpload: true,
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1699999999/sample.jpg',
    },
  });
  return created;
}

export async function GET() {
  try {
    const created = await upsertDemo();
    return NextResponse.json({ ok: true, created });
  } catch (e: any) {
    console.error('create-demo GET error:', e);
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

export async function POST() {
  try {
    const created = await upsertDemo();
    return NextResponse.json({ ok: true, created });
  } catch (e: any) {
    console.error('create-demo POST error:', e);
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
