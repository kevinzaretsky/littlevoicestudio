'use client';

import { useState, useMemo } from 'react';

type Dict = { [k: string]: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  priceCents: number;
  colorOptions: string[];
  sizeOptions: string[];
  hasUpload: boolean;
  imageUrl?: string | null;
};

export default function UploadAndBuy({
  product,
  dict,
  locale,
}: {
  product: Product;
  dict: Dict;
  locale: 'en' | 'de';
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [color, setColor] = useState(product.colorOptions?.[0] ?? '');
  const [size, setSize] = useState(product.sizeOptions?.[0] ?? '');

  const priceEuro = useMemo(() => (product.priceCents ?? 0) / 100, [product.priceCents]);

  async function handleUpload() {
    try {
      setError(null);
      if (!file) {
        setError('Please choose a file first.');
        return;
      }
      setUploading(true);

      // 1) get signature
      const sigRes = await fetch('/api/upload/sign', { cache: 'no-store' });
      const sigJson = await sigRes.json();
      if (!sigRes.ok || !sigJson?.ok) throw new Error(sigJson?.error || 'Failed to get upload signature');

      const { cloudName, apiKey, folder, timestamp, signature } = sigJson;

      // 2) upload to Cloudinary
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', apiKey);
      fd.append('timestamp', String(timestamp));
      fd.append('folder', folder);
      fd.append('signature', signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const up = await fetch(uploadUrl, { method: 'POST', body: fd });
      const upJson = await up.json();
      if (!up.ok) throw new Error(upJson?.error?.message || 'Cloudinary upload failed');

      setUploadedUrl(upJson.secure_url);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function addToCart() {
    try {
      setError(null);
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      cart.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        color,
        size,
        customizationUrl: uploadedUrl || null,
        quantity: 1,
      });

      localStorage.setItem('cart', JSON.stringify(cart));
      window.location.href = `/${locale}/cart`;
    } catch (e: any) {
      setError(e?.message || 'Could not add to cart');
    }
  }

  return (
    <div className="space-y-4">
      {product.colorOptions?.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">{dict?.color || 'Color'}</label>
          <select className="border rounded px-3 py-2 w-full" value={color} onChange={(e) => setColor(e.target.value)}>
            {product.colorOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {product.sizeOptions?.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">{dict?.size || 'Size'}</label>
          <select className="border rounded px-3 py-2 w-full" value={size} onChange={(e) => setSize(e.target.value)}>
            {product.sizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {product.hasUpload && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">{dict?.uploadLabel || 'Upload your image (JPG/PNG/PDF)'}</label>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="flex gap-3">
            <button type="button" className="btn" onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? (dict?.uploading || 'Uploading…') : (dict?.upload || 'Upload')}
            </button>
            {uploadedUrl && (
              <a href={uploadedUrl} target="_blank" rel="noreferrer" className="text-sm underline">
                {dict?.viewUpload || 'View upload'}
              </a>
            )}
          </div>
          {!!error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{priceEuro.toFixed(2)} €</div>
        <button
          type="button"
          className="btn"
          onClick={addToCart}
          disabled={product.hasUpload && !uploadedUrl}
          title={product.hasUpload && !uploadedUrl ? 'Please upload an image first' : ''}
        >
          {dict?.addToCart || 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
