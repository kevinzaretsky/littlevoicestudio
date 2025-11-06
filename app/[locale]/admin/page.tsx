export const runtime = 'nodejs';

import { prisma } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function createDemo() {
  'use server';
  await fetch('/api/admin/create-demo', { method: 'POST', cache: 'no-store' });
  revalidatePath('/en/admin'); revalidatePath('/de/admin');
  revalidatePath('/en/shop');  revalidatePath('/de/shop');
}

export default async function AdminPage({ params }: { params: { locale: 'en'|'de' } }) {
  let products: any[] = [];
  let errorMessage: string | null = null;

  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (e: any) {
    errorMessage = e?.message || String(e);
    console.error('Admin render error:', e);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Admin</h1>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700">
          <b>Server Error:</b>
          <pre className="whitespace-pre-wrap text-sm">{errorMessage}</pre>
          <p className="text-sm mt-2">Check Vercel → Deployments → Functions logs for full stack.</p>
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
              <Link className="btn" href={`/${params.locale}/product/${p.slug}`}>
                View
              </Link>
            </div>
          ))}
          {products.length === 0 && <p>No products yet.</p>}
        </div>
      )}
    </div>
  );
}
