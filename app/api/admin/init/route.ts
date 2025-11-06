import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        slug          TEXT NOT NULL UNIQUE,
        description   TEXT,
        priceCents    INTEGER NOT NULL,
        colorOptions  TEXT[] NOT NULL,
        sizeOptions   TEXT[] NOT NULL,
        hasUpload     BOOLEAN NOT NULL DEFAULT TRUE,
        imageUrl      TEXT,
        createdAt     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS "Order" (
        id              TEXT PRIMARY KEY,
        stripeSession   TEXT NOT NULL UNIQUE,
        amountTotal     INTEGER NOT NULL,
        currency        TEXT NOT NULL,
        items           JSONB NOT NULL,
        email           TEXT,
        shippingName    TEXT,
        shippingPhone   TEXT,
        shippingAddr    JSONB,
        status          TEXT NOT NULL DEFAULT 'pending',
        trackingNumber  TEXT,
        labelUrl        TEXT,
        createdAt       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, message: e.message }, { status: 500 });
  }
}
