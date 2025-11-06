export const runtime = 'nodejs';

import { prisma } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function initDbAction() {
  'use server';
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://littlevoicestudio.vercel.app'}/api/admin/init`, {
    method: 'POST',
    cache: 'no-store',
  });
  revalidatePath('/en/admin'); revalidatePath('/de/admin');
  revalidatePath('/en/shop');  revalidatePath('/de/shop');
}

async function createDemo() {
  'use server';
  const existing = await prisma.product.findUnique({ where: { slug: 'symbol-board' } });
  if (!existing) {
    await prisma.product.create({
      data: {
        name: 'Symbol Board',
        slug: 'symbol-board',
        description: 'A customizable symbol board',
        priceCents: 14900,
        colorOptions: ['white','black','lime','orange','blue','yellow'],
        sizeOptions: ['40x40mm','60x60mm'],
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1699999999/sample.jpg',
      },
    });
  }
  revalidatePath('/en/admin'); revalidatePath('/de/admin');
  revalidatePath('/en/shop');  revalidatePath('/de/shop');
}

export default async function AdminPage({ params }: { params: { locale: 'en'|'de' } }) {
  let products: any[] = [];
  let errorMessage: string | null = null;
  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (e:any) {
    errorMessage = e?.message || String(e);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Admin</h1>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700">
          <b>Server Error:</b>
          <pre className="whitespace-pre-wrap text-sm">{errorMessage}</pre>
          <form action={initDbAction} className="mt-3">
            <button className="btn">Initialize DB (create tables)</button>
          </form>
        </div>
      )}

      <form action={createDemo}>
        <button className="btn">+ Create demo product</button>
      </form>

      {!errorMessage && (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.slug}</div>
              </div>
              <Link className="btn" href={`/${params.locale}/product/${p.slug}`}>View</Link>
            </div>
          ))}
          {products.length === 0 && <p>No products yet.</p>}
        </div>
      )}
    </div>
  );
}
