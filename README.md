# LittleVoiceStudio E-commerce (Next.js 14) — DE/EN + Auto Locale

- App Router + Tailwind
- Locales under `/en` and `/de`
- **Auto browser-language detection** on any non-localized path (middleware), with cookie `NEXT_LOCALE` remembered for 1 year
- Prisma models for Product & Order
- Stripe Checkout + webhook
- Cloudinary direct uploads
- DHL label **stub**

## Local quick start
```bash
pnpm i
cp .env.example .env
pnpm prisma:push
pnpm dev
```
Open http://localhost:3000 → you’ll be redirected to `/de` or `/en`.

## Deploy
Use Postgres in production (Vercel/Neon) and set `DATABASE_URL`; change `provider = "postgresql"` in `prisma/schema.prisma` and run `pnpm prisma:push`.
