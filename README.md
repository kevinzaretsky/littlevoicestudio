# Little Voice Studio — Unified Storefront + Admin (Next.js + Prisma + Stripe + Cloudinary + DHL)
Features:
- Storefront with **variants** + **bulk image upload** during add-to-cart
- Admin: products, DHL shipping options, orders, invoice PDFs, CSV export
- **Stripe Checkout** + **webhook** (auto-mark PAID, store shipping address)
- **Cloudinary** uploads + thumbnails
- **DHL Parcel DE** label creation (real via API or demo fallback)

## Quickstart
```bash
npm i
npm run prisma:generate
npm run prisma:push
# optional
curl -X POST http://localhost:3000/api/admin/seed
npm run dev
```

Create `.env.local` from `.env.local.example` and fill keys.

Open:
- Storefront: `http://localhost:3000/de`
- Admin: `http://localhost:3000/admin/login` (password = `ADMIN_PASSWORD`)

## Stripe webhook
Create endpoint at `/api/stripe/webhook` listening to `checkout.session.completed`, and set `STRIPE_WEBHOOK_SECRET`.

## DHL Integration
Two modes:
- **Demo (default):** mock label + dummy tracking
- **Real:** set `DHL_MODE=dhl` + required DHL env vars (see example)
The label endpoint uses the **shipping address from Stripe** (saved at webhook) to create the label, and stores the tracking number on the order.
