import Link from 'next/link';
import { getDict } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';

export default async function HomePage({ params }: { params: { locale: string }}) {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDict(locale as any);
  return (
    <div className="grid md:grid-cols-2 gap-6 items-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{dict.tagline}</h1>
        <p className="text-lg text-gray-600">{dict.subline}</p>
        <div className="flex gap-3">
          <Link href={`/${locale}/shop`} className="btn">{dict.shopNow}</Link>
          <Link href={`/${locale}/admin`} className="btn">{dict.admin}</Link>
        </div>
      </div>
      <div className="card"><p className="text-gray-500">Banner placeholder</p></div>
    </div>
  )
}
