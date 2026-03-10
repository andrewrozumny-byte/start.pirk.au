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

3. **Environment variables** — copy `.env.example` to `.env` and fill in values. For local dev you can leave `TURSO_*` unset (uses SQLite). Stripe keys are required for payments.

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

SQLite doesn’t work on Vercel’s serverless platform. You **must** use **Turso** and set env vars, or the app will throw a clear error instead of opening a DB file.

### 1. Create Turso database

At [turso.tech](https://turso.tech) or via CLI:

```bash
npx turso db create pirk
npx turso db tokens create pirk
npx turso db show pirk --url   # copy the URL
```

### 2. Apply schema to Turso

`prisma db push` does not work with remote Turso. Use the included SQL file:

```bash
turso db shell pirk < prisma/turso-init.sql
```

### 3. Migrate existing local data (optional)

If you have data in local `prisma/pirk.db` (surgeons, matches, etc.):

```bash
# Unset Turso so the script uses local SQLite
unset TURSO_DATABASE_URL TURSO_AUTH_TOKEN
npx tsx scripts/export-local-to-turso.ts > turso-data.sql
turso db shell pirk < turso-data.sql
```

### 4. Set Vercel environment variables

In the Vercel project: **Settings → Environment Variables**. Add:

| Variable | Required | Description |
|----------|----------|-------------|
| `TURSO_DATABASE_URL` | **Yes** (on Vercel) | Turso URL, e.g. `libsql://pirk-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | **Yes** (on Vercel) | Turso auth token from `turso db tokens create` |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `STRIPE_PRICE_ID` | For payments | Default Stripe price ID |
| `NEXT_PUBLIC_BASE_URL` | Recommended | Production URL, e.g. `https://your-app.vercel.app` |
| `ANTHROPIC_API_KEY` | For AI matching | Anthropic API key |

Apply to **Production** and **Preview** as needed, then redeploy.

### 5. Redeploy

After saving env vars, trigger a new deployment (e.g. push a commit or **Redeploy** in the Vercel dashboard). The app will use Turso when `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set.

---

## Production checklist

- [ ] Turso database created and schema applied (`prisma/turso-init.sql`)
- [ ] Local data migrated to Turso if needed (`npm run export:turso` → `turso db shell pirk < turso-data.sql`)
- [ ] Vercel env vars set: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, plus Stripe / Anthropic / base URL as needed
- [ ] Surgeon data imported (e.g. via `/surgeons/import`) on production or migrated
- [ ] Preview PIN changed or removed in `src/middleware.ts` and `src/app/api/preview-auth/route.ts` if going fully public
