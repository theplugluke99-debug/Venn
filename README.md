# Venn — AI Prospect Intelligence

Venn finds local service businesses, scores their buying intent using Google data and website analysis, generates personalised prospect cards, and manages outreach sequences. Built for digital agencies.

## Stack

- **Next.js 15** (App Router) — frontend and API
- **PostgreSQL** via Supabase — primary database
- **Prisma** (v7) with PrismaPg adapter — ORM
- **BullMQ + Redis** — async scrape job queue
- **Clerk v7** — authentication
- **Stripe** — subscriptions and billing
- **Google Places API** — business discovery and data
- **Playwright** — website auditing (VPS only, gracefully skipped on Vercel)
- **Anthropic Claude** — AI intelligence generation

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (pooled, e.g. Supabase pooler) |
| `DIRECT_URL` | Direct PostgreSQL URL for migrations (Supabase direct connection) |
| `REDIS_URL` | Redis connection string (e.g. `redis://localhost:6379` or Upstash) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `GOOGLE_PLACES_API_KEY` | Google Places API key (enable Places API in GCP console) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_STARTER_PRICE_ID` | Stripe Price ID for Starter plan (£79/month) |
| `STRIPE_GROWTH_PRICE_ID` | Stripe Price ID for Growth plan (£149/month) |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for Pro plan (£249/month) |
| `NEXT_PUBLIC_APP_URL` | Full app URL, e.g. `https://app.venn.so` |
| `CRON_SECRET` | Optional — secures the `/api/worker` cron endpoint |
| `HUNTER_API_KEY` | Optional — Hunter.io API key for email discovery |

All variables except `CRON_SECRET` and `HUNTER_API_KEY` are required. The app throws a descriptive error at startup if any required variable is missing.

---

## Local Development

```bash
# Install dependencies
npm install

# Install Playwright browser (for website auditing)
npx playwright install chromium

# Set up environment
cp .env.local.example .env.local   # fill in your values

# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Start Next.js dev server
npm run dev

# In a separate terminal — start the BullMQ scrape worker
npm run worker
```

The app runs at http://localhost:3000. The worker process is required locally for search results to appear — it processes scrape jobs from Redis. On Vercel, a cron job handles this instead.

---

## Deployment — Vercel

### 1. Database (Supabase)

1. Create a Supabase project
2. Copy the **Connection Pooler** URL → `DATABASE_URL`
3. Copy the **Direct Connection** URL → `DIRECT_URL`

### 2. Redis (Upstash)

1. Create an Upstash Redis database (free tier works)
2. Copy the `rediss://` connection URL → `REDIS_URL`

### 3. Stripe

1. Create recurring products in Stripe Dashboard:
   - Starter — £79/month
   - Growth — £149/month
   - Pro — £249/month
2. Copy each Price ID to the matching env var
3. Create a webhook pointing to `https://your-domain/api/webhooks/stripe`
4. Enable events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

### 4. Deploy

```bash
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard. Set all environment variables in **Project → Settings → Environment Variables** before deploying.

### 5. Post-deployment checklist

- [ ] **Run database migration** — connect to production DB and run:
  ```bash
  DIRECT_URL="postgres://..." DATABASE_URL="postgres://..." npx prisma db push
  ```
- [ ] **Set `NEXT_PUBLIC_APP_URL`** to your production domain
- [ ] **Verify Stripe webhook** is pointing to the correct production URL
- [ ] **Test a search end to end** — search "Hair salon" in "London", verify a lead appears within ~60 seconds (next cron tick)

---

## Architecture

### Worker — Vercel vs VPS

On **Vercel**, the scrape worker runs as a serverless function triggered by a Vercel cron every minute (`vercel.json`). Each invocation picks one pending lead and processes it. Implications:

- Search results appear within ~60 seconds
- One lead processed per minute (suitable for low-to-medium volume)
- **Playwright website auditing is unavailable** — leads get Google data and Claude intelligence, but no website audit scores
- Vercel cron requires a **Pro plan**

For **production at scale** (high volume), run the persistent worker on a VPS or Railway alongside the Vercel deployment:

```bash
npm run worker
```

This processes 3 jobs concurrently, includes full Playwright website auditing, and responds in real time.

### Plan limits

| Plan | Leads/month | Cards | Sequences | Price |
|---|---|---|---|---|
| Starter | 100 | No | No | £79/month |
| Growth | 250 | Yes | Yes | £149/month |
| Pro | 500 | Yes | Yes | £249/month |
| Enterprise | Unlimited | Yes | Yes | £799/month |

Feature access is enforced server-side in `lib/stripe/gates.ts`.
