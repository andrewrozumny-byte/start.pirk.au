This is a [Next.js](https://nextjs.org) project — Pirk surgeon matching funnel.

## Prerequisites

- **Node.js 20.19+, 22.12+, or 24.0+** (Prisma requirement — Node 23 is not supported)
- If using Homebrew: `brew install node@22` then `export PATH="/opt/homebrew/opt/node@22/bin:$PATH"`

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma client & set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Environment variables** — copy `.env.example` to `.env` and fill in values. Stripe keys are required for payments.

4. **Surgeon data** — Import surgeons via `/surgeons/import` (CSV/Excel) for matching to work. Without surgeons, quiz results will show placeholder cards.

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

SQLite doesn’t work on Vercel’s serverless platform. Use **Turso** (serverless SQLite) instead.

1. **Create a Turso database** at [turso.tech](https://turso.tech) or via CLI:
   ```bash
   npx turso db create pirk
   npx turso db tokens create pirk
   npx turso db show pirk --url  # get the URL
   ```

2. **Apply schema to Turso** — `prisma db push` doesn't work with remote Turso:
   ```bash
   turso db shell pirk < prisma/turso-init.sql
   ```

3. **Configure Vercel env vars** (Project → Settings → Environment Variables):
   - `TURSO_DATABASE_URL` — Turso database URL (e.g. `libsql://pirk-xxx.turso.io`)
   - `TURSO_AUTH_TOKEN` — Turso auth token

4. Deploy. The app uses Turso when these env vars are set; locally it uses SQLite (`pirk.db`).
