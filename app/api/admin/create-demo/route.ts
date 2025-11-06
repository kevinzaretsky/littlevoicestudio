import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // avoid duplicate slug
    const existing = await prisma.product.findUnique({
      where: { slug: 'symbol-board' },
    });
    if (existing) {
      return NextResponse.json({ ok: true, message: 'demo product already exists' });
    }

    const created = await prisma.product.create({
      data: {
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

    return NextResponse.json({ ok: true, created });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
