// app/api/upload/sign/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // never cache this route

import { NextResponse } from 'next/server';
import crypto from 'crypto';

function sign(params: Record<string, any>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
}

function noStoreJson(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // Aggressively disable any caching
      'cache-control':
        'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
      'x-no-cache': '1',
    },
  });
}

// Prefer POST to avoid “helpful” caches; keep GET for convenience if needed.
export async function POST() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || 'littlevoicestudio/uploads';

  if (!cloudName || !apiKey || !apiSecret) {
    return noStoreJson({ ok: false, error: 'Missing Cloudinary env vars' }, 500);
  }

  // Fresh timestamp every request
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, folder };
  const signature = sign(params, apiSecret);

  return noStoreJson({
    ok: true,
    cloudName,
    apiKey,
    folder,
    timestamp,
    signature,
  });
}

// Optional GET handler (also no-store). You can remove it if you want POST-only.
export async function GET() {
  return POST();
}
