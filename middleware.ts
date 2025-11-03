import { NextResponse } from 'next/server'; import type { NextRequest } from 'next/server';
export function middleware(req: NextRequest){
  if (req.nextUrl.pathname.startsWith('/admin')){
    const cookie = req.cookies.get('lvs_admin')?.value;
    if (!cookie || cookie !== process.env.ADMIN_PASSWORD){
      const url = new URL('/admin/login', req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*'] };