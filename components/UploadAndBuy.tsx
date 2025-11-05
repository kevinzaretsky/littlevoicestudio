'use client';
import { useState } from 'react';
import { useCartStore } from '@/components/cartStore';

export default function UploadAndBuy({ product, dict }: { product: any, dict: any }) {
  const add = useCartStore(s => s.add);
  const [color, setColor] = useState(product.colorOptions?.[0] || 'white');
  const [size, setSize] = useState(product.sizeOptions?.[0] || '40x40mm');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const colors = product.colorOptions || ['white','black','lime','orange','blue','yellow'];
  const sizes = product.sizeOptions || ['40x40mm','60x60mm'];

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const sigRes = await fetch('/api/upload/sign', { method: 'POST' });
    const sig = await sigRes.json();
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sig.apiKey);
    form.append('timestamp', sig.timestamp);
    form.append('signature', sig.signature);
    form.append('folder', sig.folder);
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, { method: 'POST', body: form });
    const data = await uploadRes.json();
    setImageUrl(data.secure_url);
    setUploading(false);
  }

  function addToCart() {
    add({
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents,
      quantity: 1,
      color, size,
      imageUrl: imageUrl || product.imageUrl || null,
      customizationUrl: imageUrl
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <select className="border rounded px-3 py-2" value={color} onChange={e=>setColor(e.target.value)}>
          {colors.map((c:string)=>(<option key={c} value={c}>{c}</option>))}
        </select>
        <select className="border rounded px-3 py-2" value={size} onChange={e=>setSize(e.target.value)}>
          {sizes.map((s:string)=>(<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <button className="btn" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? dict.uploading : dict.uploadToCloudinary}
        </button>
      </div>
      {imageUrl && <p className="text-sm text-green-600 break-all">Uploaded ✓ {imageUrl}</p>}

      <button className="btn" onClick={addToCart}>{dict.addToCart}</button>
    </div>
  );
}
