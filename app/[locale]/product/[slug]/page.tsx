import { prisma } from '@/lib/db';
import Image from 'next/image';
import UploadAndBuy from '@/components/UploadAndBuy';
import { notFound } from 'next/navigation'
import { getDict } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';

export default async function ProductDetail({ params }: { params: { slug: string, locale: string } }) {
  const locale = isLocale(params.locale) ? (params.locale as 'en'|'de') : 'en';
  const dict = await getDict(locale);
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return notFound();
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card">
        {product.imageUrl ? (
          <div className="relative w-full h-96">
            <Image src={product.imageUrl} alt={product.name} fill className="object-contain" />
          </div>
        ) : <div className="h-96 grid place-items-center text-gray-400">{dict.noImage}</div>}
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <UploadAndBuy product={product} dict={dict} />
      </div>
    </div>
  )
}
