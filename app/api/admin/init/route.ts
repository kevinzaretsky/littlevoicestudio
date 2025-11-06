import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Create tables if they don't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        slug          TEXT NOT NULL UNIQUE,
        description   TEXT,
        priceCents    INTEGER,
        colorOptions  TEXT[],
        sizeOptions   TEXT[],
        hasUpload     BOOLEAN,
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

    // Ensure all expected columns exist (idempotent)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "priceCents"   INTEGER        NOT NULL DEFAULT 0;
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "colorOptions" TEXT[]         NOT NULL DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sizeOptions"  TEXT[]         NOT NULL DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "hasUpload"    BOOLEAN        NOT NULL DEFAULT TRUE;
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "imageUrl"     TEXT;
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "description"  TEXT;
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "updatedAt"    TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP;

      -- ensure slug is unique (index is fine; Prisma also enforces at app level)
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_slug" ON "Product"("slug");
    `);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}
