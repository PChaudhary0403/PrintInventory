# Digital Heroes — Web-to-Print Platform

A custom web-to-print ecommerce platform for a multi-division print business. Customers configure, design, proof, and order print products online; staff manage production from quote to completion.

## Product Divisions

1. **Labels & Stickers** — Custom printed labels and stickers
2. **Race & Event Numbers** — Professional race bibs with variable-data printing
3. **MTB Boards** — Mountain bike number boards and plates
4. **Stamps** — Self-inking and rubber stamps
5. **Trophies** — Engraved and printed awards
6. **Laser-Cut Work** — Precision signage and fabrication

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Next.js API Routes (Node.js)
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth with RLS
- **Storage:** Supabase Storage (artwork, proofs, production files)
- **Payments:** Stripe
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd digital-heroes
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your Supabase and Stripe credentials
4. Run database migrations in order against your Supabase project (SQL Editor):
   - `database/migrations/001_profiles_and_roles.sql`
   - `database/migrations/002_product_divisions_and_products.sql`
   - ... through `009_notifications.sql`
5. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Application URL |

> **Never commit `.env.local` or secrets to Git.**

## Project Structure

```
digital-heroes/
├── database/
│   └── migrations/          # SQL migration files (001-009)
├── src/
│   ├── app/
│   │   ├── (storefront)/    # Public pages (home, products, account)
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API route handlers
│   │   ├── auth/            # Auth callback
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── components/
│   │   ├── catalogue/       # Product catalogue components
│   │   ├── home/            # Homepage components
│   │   ├── layout/          # Header, Footer
│   │   └── product/         # Product detail components
│   ├── lib/
│   │   ├── auth/            # Auth context
│   │   └── supabase/        # Supabase client helpers
│   └── types/               # TypeScript type definitions
└── public/                  # Static assets
```

## Deployment

Deploy to a **new Vercel account** connected to a **new Supabase project**:

1. Create a new Supabase project
2. Run all migrations in the SQL Editor
3. Create storage buckets: `artwork`, `proofs`, `production`
4. Deploy to Vercel with environment variables configured
5. Set up Stripe webhook pointing to `your-domain.vercel.app/api/webhooks/stripe`

## License

Proprietary — Digital Heroes © 2026
