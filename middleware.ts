import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

function getPreferredLocale(request: NextRequest): string {
  const cookie = request.cookies.get('NEXT_LOCALE')?.value
  if (cookie && locales.includes(cookie as any)) return cookie
  const header = request.headers.get('accept-language') || ''
  const prefs = header.split(',').map(p => p.split(';')[0].trim().toLowerCase())
  for (const p of prefs) {
    if (p.startsWith('de')) return 'de'
    if (p.startsWith('en')) return 'en'
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|txt|webp|gif|css|js|map)$/)
  ) return

  if (locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return

  const url = request.nextUrl.clone()
  const pref = getPreferredLocale(request)
  url.pathname = `/${pref}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/((?!.*\.).*)'] }
