# His Will Fashion Club

Storefront for **His Will Fashion Club** (premium Christian clothing, Pan India
shipping) — built with Next.js 16, React 19, and Tailwind CSS v4. Includes a
full shop, cart, and checkout with three payment options: Cash on Delivery,
WhatsApp order handoff, and Razorpay online payments.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's included

- **Shop** (`/shop`), **product pages** (`/product/[slug]`) with size/quantity
  selection, **cart** (`/cart`), and **checkout** (`/checkout`).
- Cart state persists in the browser via `localStorage` (see `lib/cart-context.tsx`).
- **Orders** are created via `POST /api/orders`, validated and re-priced
  server-side from `data/products.ts` (the client can't manipulate prices),
  and stored as JSON in `.data/orders.json` (see `lib/orders.ts`).
- **Payment methods**, chosen at checkout:
  - **Cash on Delivery** — works out of the box, no setup required.
  - **WhatsApp order** — opens WhatsApp with a prefilled order summary to your
    business number, matching how the brand takes orders today.
  - **Razorpay (UPI/Card/Netbanking)** — fully wired (`/api/razorpay/create-order`,
    `/api/razorpay/verify`, signature verification), but stays disabled in the
    UI until you add real Razorpay keys (see below).

## Editing the product catalog

All products live in [`data/products.ts`](data/products.ts) — it's a plain
array, easy to edit by hand. Each product's `image` field points at a photo in
`public/products/` (all real product photography). **Prices are currently
placeholders (₹799 / ₹699)** — update them in `data/products.ts` to your real
pricing before launch.

To add a new design: drop the photo in `public/products/`, then add an entry
to the array in `data/products.ts` with a unique `slug`, `image` path, and the
other fields (name, price, sizes, description, optional `verse` — only used
when a verse/quote is actually printed on the garment).

## Configuring WhatsApp ordering

The business WhatsApp number and Instagram handle are set in
[`lib/site.ts`](lib/site.ts) (`SITE.whatsappNumber`, currently `919039199382`).
Update there if the number changes.

## Configuring Razorpay (online payments)

Online payment is optional and off by default. To enable it:

1. Create/activate a Razorpay account at https://dashboard.razorpay.com — this
   is a business step only you can complete (KYC, bank details, etc.).
2. Grab your API keys from **Settings → API Keys**.
3. Copy `.env.local.example` to `.env.local` and fill in:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
   ```
4. Restart the dev server. The "Pay Online" option will automatically appear
   enabled at checkout once both keys are present.

Start with Razorpay's **test mode** keys (`rzp_test_...`) to try the full
payment flow with [test card/UPI numbers](https://razorpay.com/docs/payments/payments/test-card-upi-details/)
before going live.

## Order storage note (important before you launch)

Orders are stored in a local JSON file (`.data/orders.json`) written by the
Next.js server. This is simple and works well if you self-host (a VPS,
Railway, Render, `npm run start` on your own machine, etc.) — **but on
serverless platforms like Vercel, the filesystem is read-only/ephemeral in
production, so orders written this way will not reliably persist.** If you
deploy to Vercel, swap `lib/orders.ts` for a real database (e.g. Supabase,
Postgres, PlanetScale) — the rest of the app (API routes, checkout form) can
stay the same, since they all go through `saveOrder` / `getOrder` /
`updateOrder` in that one file.

There is currently no admin/order-list page — orders can be read directly from
`.data/orders.json`, or you can build a simple authenticated `/admin` view on
top of `lib/orders.ts` (`readOrders()`) later.

## Tech stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Razorpay Node SDK
