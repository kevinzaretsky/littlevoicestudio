
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [size, setSize] = useState<'40x40'|'60x60'>('40x40');
  const [color, setColor] = useState('white');
  const [epoxy, setEpoxy] = useState(false);
  const [qty, setQty] = useState(1);

  const pricePerUnit = (size === '60x60' ? 18 : 12) + (epoxy ? 4 : 0);

  async function handleCheckout() {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lineItems: [{
          name: `Frame ${size}${epoxy ? ' + Epoxy' : ''} (${color})`,
          amount: Math.round(pricePerUnit * 100),
          quantity: qty,
          currency: 'eur'
        }]
      })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || 'Checkout error');
  }

  return (
    <main style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto', padding:24, maxWidth:900, margin:'0 auto'}}>
      <h1>Little Voice Studio</h1>
      <p>Configure your frame and proceed to checkout.</p>

      <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', margin:'20px 0'}}>
        <label>Size<br/>
          <select value={size} onChange={e=>setSize(e.target.value as any)}>
            <option value="40x40">40×40 mm</option>
            <option value="60x60">60×60 mm</option>
          </select>
        </label>
        <label>Color<br/>
          <select value={color} onChange={e=>setColor(e.target.value)}>
            <option>white</option>
            <option>black</option>
            <option>lime</option>
            <option>orange</option>
            <option>blue</option>
            <option>yellow</option>
          </select>
        </label>
        <label>Epoxy<br/>
          <select value={epoxy ? 'yes':'no'} onChange={e=>setEpoxy(e.target.value==='yes')}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <label>Quantity<br/>
          <input type="number" min={1} max={50} value={qty} onChange={e=>setQty(parseInt(e.target.value||'1'))}/>
        </label>
      </div>

      <p><b>Estimated price:</b> €{(pricePerUnit*qty).toFixed(2)}</p>
      <button onClick={handleCheckout} style={{padding:'10px 16px', borderRadius:12, border:'1px solid #ccc', cursor:'pointer'}}>Checkout</button>

      <hr style={{margin:'24px 0'}}/>
      <p><Link href="/admin">Go to Admin Uploads</Link></p>
      <p><Link href="/products">View Sample Products</Link></p>
    </main>
  );
}
