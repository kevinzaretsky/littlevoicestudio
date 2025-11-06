export const runtime = 'nodejs';

import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import UploadAndBuy from '@/components/UploadAndBuy';
import { getDict } from '@/i18n/dictionaries';

export default async function ProductPage({ params }: { params: { locale: 'en'|'de'; slug: string } }) {
  const dict = await getDict(params.locale);
  let product: any = null;

  try {
    product = await prisma.product.findUnique({ where: { slug: params.slug } });
  } catch (e) {
    console.error('Product page DB error:', e);
    // Give a friendly page instead of hard crash
  }

  if (!product) notFound();

  // Defensive defaults (avoid .map on null)
  product.colorOptions = Array.isArray(product.colorOptions) ? product.colorOptions : [];
  product.sizeOptions  = Array.isArray(product.sizeOptions)  ? product.sizeOptions  : [];
  product.description  = product.description ?? '';

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-6">{product.description}</p>

      <UploadAndBuy product={product} dict={dict} />
    </div>
  );
}
