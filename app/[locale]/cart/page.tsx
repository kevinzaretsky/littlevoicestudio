'use client';

import { useEffect, useMemo, useState } from 'react';

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  color?: string | null;
  size?: string | null;
  customizationUrl?: string | null;
  quantity: number;
};

export default function CartPage({ params }: { params: { locale: 'en' | 'de' } }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  }

  function remove(i: number) {
    const next = items.slice();
    next.splice(i, 1);
    persist(next);
  }

  function clear() {
    persist([]);
  }

  function updateQty(i: number, q: number) {
    const next = items.slice();
    next[i] = { ...next[i], quantity: Math.max(1, q) };
    persist(next);
  }

  const subtotalCents = useMemo(
    () => items.reduce((sum, it) => sum + (it.priceCents || 0) * (it.quantity || 1), 0),
    [items]
  );
  const shippingCents = items.length > 0 ? 499 : 0; // 4.99€
  const totalCents = subtotalCents + shippingCents;

  async function checkout() {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items, locale: params.locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Checkout failed (${res.status})`);
      // Redirect to Stripe
      window.location.href = json.url;
    } catch (e: any) {
      setError(e?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{params.locale === 'de' ? 'Warenkorb' : 'Your cart'}</h1>

      {items.length === 0 ? (
        <p>{params.locale === 'de' ? 'Dein Warenkorb ist leer.' : 'Your cart is empty.'}</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((it, i) => (
              <div key={i} className="card flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">
                    {it.color ? `Color: ${it.color} ` : ''}{it.size ? `Size: ${it.size}` : ''}
                    {it.customizationUrl ? (
                      <>
                        {' '}- <a href={it.customizationUrl} className="underline" target="_blank" rel="noreferrer">
                          Upload
                        </a>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) => updateQty(i, Number(e.target.value || 1))}
                    className="w-20 border rounded px-2 py-1"
                  />
                  <div>{((it.priceCents * it.quantity) / 100).toFixed(2)} €</div>
                  <button className="btn" onClick={() => remove(i)}>
                    {params.locale === 'de' ? 'Löschen' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {params.locale === 'de' ? 'Versand (DHL)' : 'Shipping (DHL)'}
            </div>
            <div>{(shippingCents / 100).toFixed(2)} €</div>
          </div>

          <div className="flex items-center justify-between text-lg font-semibold">
            <div>{params.locale === 'de' ? 'Gesamt' : 'Total'}</div>
            <div>{(totalCents / 100).toFixed(2)} €</div>
          </div>

          {!!error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-3">
            <button className="btn" onClick={checkout} disabled={loading}>
              {loading ? (params.locale === 'de' ? 'Weiterleiten…' : 'Redirecting…') : 'Checkout'}
            </button>
            <button className="btn" onClick={clear}>
              {params.locale === 'de' ? 'Leeren' : 'Clear'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
