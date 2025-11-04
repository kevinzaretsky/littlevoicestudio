# Little Voice Studio – Starter (Next.js + Stripe + Cloudinary)

A minimal e‑commerce starter using **Next.js (App Router)**, **Stripe Checkout**, and **Cloudinary** uploads.

## 1) Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_preset_name
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
SITE_URL=http://localhost:3000
```

> For production (Vercel), set the same variables in **Project → Settings → Environment Variables**.
> `SITE_URL` should be your https domain, e.g. `https://littlevoicestudio.com`.

## 2) Run locally

```bash
npm install
npm run dev
```

## 3) Deploy on Vercel
- Import the repo in Vercel
- Framework Preset: **Next.js**
- Add the environment variables
- Deploy

## Notes
- This starter uses **unsigned** Cloudinary uploads for simplicity. You can switch to signed uploads later for stricter security.
- Pricing logic is inside `app/api/checkout/route.ts` – adjust as needed.
