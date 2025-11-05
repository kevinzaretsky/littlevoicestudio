import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

export default function ProductCard({ product, locale }: { product: any, locale: 'en'|'de' }) {
  return (
    <Link href={`/${locale}/product/${product.slug}`} className="card block hover:shadow-lg transition">
      {product.imageUrl && (
        <div className="relative w-full h-48 mb-3">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-xl" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>
        <div className="font-semibold">{formatCurrency(product.priceCents, 'EUR', locale==='de'?'de-DE':'en-US')}</div>
      </div>
    </Link>
  );
}
