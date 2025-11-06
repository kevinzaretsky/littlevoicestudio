export const runtime = 'nodejs';

import { prisma } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export default async function ShopPage({ params }: { params: { locale: 'en' | 'de' } }) {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => <ProductCard key={p.id} product={p} locale={params.locale} />)}
      {products.length === 0 && <p>No products yet. Go to Admin to add one.</p>}
    </div>
  );
}
