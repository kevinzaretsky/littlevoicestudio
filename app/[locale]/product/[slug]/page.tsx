import { getDict } from '@/i18n/dictionaries';
import { prisma } from '@/lib/prisma';
import UploadAndBuy from '@/components/UploadAndBuy';

export default async function ProductPage({
  params,
}: {
  params: { locale: 'en' | 'de'; slug: string };
}) {
  const dict = await getDict(params.locale);

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return (
      <div className="p-6 text-center text-red-600">
        {dict?.notFound ?? 'Product not found.'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-6">{product.description}</p>

      <UploadAndBuy
        product={product}
        dict={dict}
        locale={params.locale}
      />
    </div>
  );
}
