export const runtime = 'nodejs';

import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function ShopPage({ params }: { params: { locale: 'en'|'de' } }) {
  let products: any[] = [];
  let error: string | null = null;

  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (e: any) {
    error = e?.message || String(e);
    console.error('Shop render error:', e);
  }

  if (error) {
    return (
      <div className="p-4 rounded bg-red-100 text-red-700">
        <b>Shop error:</b>
        <pre className="whitespace-pre-wrap text-sm">{error}</pre>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <Link key={p.id} href={`/${params.locale}/product/${p.slug}`} className="card block">
          <div className="font-semibold">{p.name}</div>
          <div className="text-sm text-gray-500">{(p.priceCents ?? 0) / 100} €</div>
        </Link>
      ))}
      {products.length === 0 && <p>No products yet.</p>}
    </div>
  );
}
