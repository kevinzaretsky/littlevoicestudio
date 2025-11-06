// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      envHasDatabaseUrl: !!process.env.DATABASE_URL,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || 'Unknown DB error' },
      { status: 500 }
    );
  }
}
