import { prisma } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { getDict } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';

async function createDemo() {
  'use server'
  await prisma.product.create({
    data: {
      name: 'Symbol Board',
      slug: 'symbol-board',
      description: 'A customizable symbol board',
      priceCents: 14900,
      colorOptions: ['white','black','lime','orange','blue','yellow'],
      sizeOptions: ['40x40mm','60x60mm'],
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1699999999/sample.jpg'
    }
  });
  revalidatePath('/en/shop'); revalidatePath('/de/shop');
}

export default async function AdminPage({ params }: { params: { locale: string }}) {
  const locale = isLocale(params.locale) ? (params.locale as 'en'|'de') : 'en';
  const dict = await getDict(locale);
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  async function deleteById(id: string) {
    'use server'
    await prisma.product.delete({ where: { id }});
    revalidatePath(`/${locale}/admin`); revalidatePath(`/${locale}/shop`);
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{dict.admin}</h1>
      <form action={createDemo}><button className="btn">+ Create demo product</button></form>
      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">{p.slug}</div>
            </div>
            <div className="flex gap-3">
              <Link className="btn" href={`/${locale}/product/${p.slug}`}>View</Link>
              <form action={deleteById.bind(null, p.id)}><button className="btn">Delete</button></form>
            </div>
          </div>
        ))}
        {products.length===0 && <p>No products yet.</p>}
      </div>
    </div>
  )
}
