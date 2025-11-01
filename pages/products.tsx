
import { useEffect, useState } from 'react';
type Product = { id: string; name: string; description: string; price: number; image?: string };

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const seed: Product[] = [
      { id:'p1', name:'Frame 40×40', description:'Classic, no epoxy', price:12 },
      { id:'p2', name:'Frame 60×60', description:'Larger size, epoxy optional', price:18 }
    ];
    setItems(seed);
  }, []);

  return (
    <main style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto', padding:24, maxWidth:1000, margin:'0 auto'}}>
      <h1>Products</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:16}}>
        {items.map(p => (
          <div key={p.id} style={{border:'1px solid #e5e7eb', borderRadius:16, padding:12}}>
            <div style={{background:'#f8fafc', height:160, borderRadius:12, marginBottom:8, display:'grid', placeItems:'center'}}>
              <span role="img" aria-label="frame">🖼️</span>
            </div>
            <h3 style={{margin:'6px 0'}}>{p.name}</h3>
            <p style={{margin:'6px 0', color:'#475569'}}>{p.description}</p>
            <p><b>€{p.price.toFixed(2)}</b></p>
          </div>
        ))}
      </div>
    </main>
  );
}
