'use client';

import { useMemo, useState } from 'react';

type Dict = Record<string, string>;

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

  const t = (k: string, fallback: string) => dict?.[k] ?? fallback;

  const priceEuro = useMemo(
    () => (product.priceCents ?? 0) / 100,
    [product.priceCents]
  );

  async function handleUpload() {
    try {
      setError(null);
      if (!file) {
        setError(t('uploadChooseFile', 'Please choose a file first.'));
        return;
      }
      setUploading(true);

      // 1) Get a fresh signature (POST + cache-busting)
      const sigRes = await fetch(`/api/upload/sign?cb=${Date.now()}`, {
        method: 'POST',
        cache: 'no-store',
      });
      const sigJson = await sigRes.json();
      if (!sigRes.ok || !sigJson?.ok) {
        throw new Error(sigJson?.error || 'Failed to get upload signature');
      }

      const { cloudName, apiKey, folder, timestamp, signature } = sigJson;

      // 2) Upload file from browser directly to Cloudinary
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', apiKey);
      fd.append('timestamp', String(timestamp));
      fd.append('folder', folder);
      fd.append('signature', signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const up = await fetch(uploadUrl, { method: 'POST', body: fd });
      const upJson = await up.json();

      if (!up.ok) {
        // Cloudinary returns a specific message here; surface it
        throw new Error(upJson?.error?.message || 'Cloudinary upload failed');
      }

      setUploadedUrl(upJson.secure_url);
    } catch (e: any) {
      setError(e?.message || t('uploadFailed', 'Upload failed'));
      setUploadedUrl(null);
    } finally {
      setUploading(false);
    }
  }

  function addToCart() {
    try {
      setError(null);

      // If upload required, enforce it
      if (product.hasUpload && !uploadedUrl) {
        setError(t('pleaseUploadFirst', 'Please upload an image first.'));
        return;
      }

      const raw = localStorage.getItem('cart');
      const cart: any[] = raw ? JSON.parse(raw) : [];

      cart.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        color: color || null,
        size: size || null,
        customizationUrl: uploadedUrl || null,
        quantity: 1,
      });

      localStorage.setItem('cart', JSON.stringify(cart));
      // Navigate to locale cart page
      window.location.href = `/${locale}/cart`;
    } catch (e: any) {
      setError(e?.message || t('addToCartFailed', 'Could not add to cart'));
    }
  }

  return (
    <div className="space-y-4">
      {/* Color */}
      {product.colorOptions?.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('color', 'Color')}
          </label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            {product.colorOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Size */}
      {product.sizeOptions?.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('size', 'Size')}
          </label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {product.sizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Upload */}
      {product.hasUpload && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t('uploadLabel', 'Upload your image (JPG/PNG/PDF)')}
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <div className="flex gap-3">
            <button
              type="button"
              className="btn"
              onClick={handleUpload}
              disabled={!file || uploading}
              title={!file ? t('chooseAFile', 'Choose a file first') : ''}
            >
              {uploading ? t('uploading', 'Uploading…') : t('upload', 'Upload')}
            </button>

            {uploadedUrl && (
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline"
              >
                {t('viewUpload', 'View upload')}
              </a>
            )}
          </div>

          {!!error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      )}

      {/* Price + Add to cart */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{priceEuro.toFixed(2)} €</div>
        <button
          type="button"
          className="btn"
          onClick={addToCart}
          disabled={product.hasUpload && !uploadedUrl}
          title={
            product.hasUpload && !uploadedUrl
              ? t('pleaseUploadFirst', 'Please upload an image first.')
              : ''
          }
        >
          {t('addToCart', 'Add to cart')}
        </button>
      </div>
    </div>
  );
}
