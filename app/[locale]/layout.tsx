import Navbar from '@/components/Navbar';
import { getDict } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';

export default async function LocaleLayout({ children, params }: { children: React.ReactNode, params: { locale: string } }) {
  const locale = isLocale(params.locale) ? (params.locale as 'en'|'de') : 'en';
  const dict = await getDict(locale);
  return (<><Navbar locale={locale} dict={dict} /><main className="container py-6">{children}</main></>)
}
