import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const created = await prisma.product.upsert({
      where: { slug: 'symbol-board' },       // slug is unique in Prisma schema
      update: {
        // keep it minimal; you can add fields to update later
        updatedAt: new Date(),
      },
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

    return NextResponse.json({ ok: true, created });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
