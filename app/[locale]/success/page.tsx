import { getDict } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';

export default async function SuccessPage({ params }: { params: { locale: string }}) {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const dict = await getDict(locale as any);
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{dict.thankYou}</h1>
      <p>{dict.successText}</p>
    </div>
  )
}
