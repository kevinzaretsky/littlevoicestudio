'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/components/cartStore';

export default function Navbar({ locale, dict }: { locale: 'en'|'de', dict: any }) {
  const count = useCartStore(s => s.items.reduce((a, b) => a + b.quantity, 0));
  const pathname = usePathname();
  const switchLocalePath = (loc: 'en'|'de') => { const parts = pathname.split('/'); parts[1] = loc; return parts.join('/') || `/${loc}`; };
  function setLocaleCookie(loc: 'en'|'de') { document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000`; }
  return (
    <nav className="border-b bg-white/70 backdrop-blur sticky top-0 z-40">
      <div className="container flex items-center justify-between py-3">
        <Link href={`/${locale}`} className="font-bold text-xl">{dict.brand}</Link>
        <div className="flex gap-4 items-center">
          <Link href={`/${locale}/shop`} className="hover:underline">Shop</Link>
          <Link href={`/${locale}/admin`} className="hover:underline">{dict.admin}</Link>
          <Link href={`/${locale}/cart`} className="btn">{dict.cart} ({count})</Link>
          <div className="flex items-center gap-1 text-sm">
            <Link href={switchLocalePath('de')} onClick={()=>setLocaleCookie('de')} className={`px-2 py-1 rounded ${locale==='de'?'bg-gray-200':''}`}>DE</Link>
            <span>/</span>
            <Link href={switchLocalePath('en')} onClick={()=>setLocaleCookie('en')} className={`px-2 py-1 rounded ${locale==='en'?'bg-gray-200':''}`}>EN</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
