import { NextResponse } from 'next/server';
import { getCloudinarySignature } from '@/lib/cloudinary';
export async function POST() {
  try { return NextResponse.json(getCloudinarySignature('customer-uploads')); }
  catch (e:any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
