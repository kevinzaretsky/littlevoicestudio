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

    // Ensure ALL expected columns exist with the right types/defaults
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        -- Product.priceCents
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='priceCents') THEN
          ALTER TABLE "Product" ADD COLUMN "priceCents" INTEGER NOT NULL DEFAULT 0;
        END IF;

        -- Product.colorOptions
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='colorOptions') THEN
          ALTER TABLE "Product" ADD COLUMN "colorOptions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
        END IF;

        -- Product.sizeOptions
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='sizeOptions') THEN
          ALTER TABLE "Product" ADD COLUMN "sizeOptions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
        END IF;

        -- Product.hasUpload
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='hasUpload') THEN
          ALTER TABLE "Product" ADD COLUMN "hasUpload" BOOLEAN NOT NULL DEFAULT TRUE;
        END IF;

        -- Product.imageUrl
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='imageUrl') THEN
          ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;
        END IF;

        -- Product.description
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='description') THEN
          ALTER TABLE "Product" ADD COLUMN "description" TEXT;
        END IF;

        -- Product.slug (ensure exists; unique constraint can be added later if missing)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='slug') THEN
          ALTER TABLE "Product" ADD COLUMN "slug" TEXT NOT NULL;
        END IF;

        -- Product.name
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='name') THEN
          ALTER TABLE "Product" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Product';
        END IF;

        -- Product.updatedAt (ensure present)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='Product' AND column_name='updatedAt') THEN
          ALTER TABLE "Product" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END
      $$;
    `);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}
