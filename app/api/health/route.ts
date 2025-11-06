export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: !!process.env.CLOUDINARY_API_KEY,
    apiSecret: !!process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'littlevoicestudio/uploads',
  });
}
