import { prisma } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import { getDict } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';

export default async function ShopPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? (params.locale as 'en'|'de') : 'en';
  const dict = await getDict(locale);
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} locale={locale} />)}
      {products.length === 0 && <p>{dict.noProducts}</p>}
    </div>
  );
}
