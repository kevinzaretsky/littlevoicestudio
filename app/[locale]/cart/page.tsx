'use client';
import { useCartStore } from '@/components/cartStore';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const { locale } = useParams() as { locale: 'en'|'de' };
  const dict = locale === 'de' ? {
    cartTitle: 'Warenkorb', yourCartIsEmpty: 'Dein Warenkorb ist leer.', clear: 'Leeren', checkout: 'Zur Kasse', remove: 'Entfernen'
  } : {
    cartTitle: 'Cart', yourCartIsEmpty: 'Your cart is empty.', clear: 'Clear', checkout: 'Checkout', remove: 'Remove'
  };

  const { items, clear, remove } = useCartStore();
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  }

  const total = items.reduce((a,b)=>a + b.priceCents*b.quantity, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{dict.cartTitle}</h1>
      {items.length === 0 && <p>{dict.yourCartIsEmpty}</p>}
      {items.map((i, idx)=>(
        <div className="card flex items-center justify-between" key={idx}>
          <div>
            <div className="font-medium">{i.name} × {i.quantity}</div>
            <div className="text-sm text-gray-500">{i.color} • {i.size}</div>
            {i.customizationUrl && <div className="text-xs text-gray-400 break-all">{i.customizationUrl}</div>}
          </div>
          <button className="btn" onClick={()=>remove(i.productId)}>{dict.remove}</button>
        </div>
      ))}
      {items.length>0 && (
        <div className="flex gap-3">
          <button className="btn" onClick={clear}>{dict.clear}</button>
          <button className="btn" onClick={checkout} disabled={loading}>{loading ? '…' : `${dict.checkout} (${(total/100).toFixed(2)} €)`}</button>
        </div>
      )}
    </div>
  );
}
