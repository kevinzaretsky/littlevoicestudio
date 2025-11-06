// app/api/upload/sign/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import crypto from 'crypto';

function sign(params: Record<string, any>, apiSecret: string) {
  // Cloudinary signature: stringified params (alphabetical), joined by & + api_secret
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
}

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || 'littlevoicestudio/uploads';

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { ok: false, error: 'Missing Cloudinary env vars' },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000); // seconds
  const params = {
    timestamp,
    folder,
    // Optionally restrict transformations/eager here
    // eager: 'c_fill,w_1200,h_1200|c_limit,w_2000',
  };
  const signature = sign(params, apiSecret);

  return NextResponse.json({
    ok: true,
    cloudName,
    apiKey,
    folder,
    timestamp,
    signature,
  });
}
