# Little Voice Studio (Clean Base)

Minimal e‑commerce base using **Next.js 14 (App Router)** + **Cloudinary uploads** + **Stripe Checkout**.

## 1) Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
SITE_URL=http://localhost:3000
```

## 2) Run local
```bash
npm install
npm run dev
```

## 3) Deploy to Vercel
- Framework Preset: **Next.js**
- Add the same env vars in Project → Settings → Environment Variables
- Set `SITE_URL` to your production domain (e.g., https://littlevoicestudio.com)
- Deploy

## Files
- `app/page.tsx`: customizer UI (size, epoxy, color, quantity, upload)
- `app/api/checkout/route.ts`: Stripe Checkout session
- No `cart/`, `admin/`, or `product/` routes.
# redeploy test
