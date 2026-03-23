# RetireReady

Retirement forecasting web app: Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Clerk (auth), Supabase (data), Stripe (subscriptions), OpenAI (AI Q&A).

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env.local` and fill in:

   - **Clerk**: [Dashboard → API keys](https://dashboard.clerk.com) — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - **Supabase**: project URL, anon key (optional for client), **service role** for server actions (`SUPABASE_SERVICE_ROLE_KEY`)
   - **Stripe**: secret key, webhook secret, publishable key, **Price IDs** (`NEXT_PUBLIC_STRIPE_PRICE_ID` or separate monthly/annual `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY` / `NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL`)
   - **OpenAI**: API key for `/ai-assistant` and `/api/chat`
   - **ADVISOR_USER_IDS**: comma-separated Clerk user IDs allowed to access `/advisor-portal`

3. **Database** — in the **same** Supabase project as `NEXT_PUBLIC_SUPABASE_URL`, open **SQL Editor**, paste the full contents of `supabase/schema.sql`, and run it. Run **`supabase/seed.sql`** if you want sample rows in **`ads`** (dashboard sponsored blocks) and **`affiliateoffers`** (`/recommendations`). Without `ads` rows, those slots stay hidden. Confirm **Table Editor** shows `userprofile`, or run `supabase/verify.sql` (should return `userprofile`, not `null`).

4. **Stripe webhook** — in the Stripe Dashboard, add endpoint:

   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`

5. **Dev server** — after editing `.env.local`, restart it so Next.js picks up new variables:

   ```bash
   npm run dev
   ```

### Onboarding → dashboard not working?

There is **no extra npm script** beyond applying SQL in Supabase. The quiz saves via server actions using **`SUPABASE_SERVICE_ROLE_KEY`**.

**Error: “Could not find the table `public.userprofile` in the schema cache”** — PostgREST does not see that table in the project your app is calling. Usually: (1) `schema.sql` was not run, (2) it was run in a **different** Supabase project than the URL in `.env.local`, or (3) the SQL editor run failed partway (check for errors in the results). Fix: run **`supabase/schema.sql`** in the correct project’s SQL editor, confirm **`userprofile`** in Table Editor, restart **`npm run dev`**, try again. If the table exists but the error persists, wait a short time for the API schema cache to refresh.

### Vercel: `MIDDLEWARE_INVOCATION_FAILED` or 500 on every request

That usually means **Edge middleware** threw before returning (often **Clerk**). Check:

1. **All required env vars** are set in **Vercel → Project → Settings → Environment Variables** for **Production** and **Preview** (deployments do not use your laptop’s `.env.local`). At minimum: `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, plus Supabase/Stripe/OpenAI as you use them.
2. **Clerk allowed origins** — In the [Clerk Dashboard → configure URLs / domains](https://dashboard.clerk.com), add your production host (e.g. `https://your-app.vercel.app`) and preview hosts (`https://*.vercel.app` if your Clerk plan allows wildcards).
3. **`NEXT_PUBLIC_APP_URL`** — Set to your live URL so redirects (e.g. Stripe) point to the right host.
4. **Logs** — In Vercel, open the deployment → **Functions** / **Logs**, or use the log viewer documented in [Vercel’s middleware error doc](https://vercel.com/docs/errors/MIDDLEWARE_INVOCATION_FAILED), to see the real stack trace.

## Build

```bash
npm run build
```

The marketing home page lives under `app/(public)/` and stays static. Clerk-wrapped routes are under `app/(clerk)/` so builds succeed without Clerk keys on prerendered shell pages.

## User flow

1. Landing → **Start Free** → `/sign-up` (Clerk)
2. After sign-up → `/onboarding` → profile saved to `userprofile`
3. → `/dashboard` — calculators, budget, SS comparison, ads, advisor lead modal
4. `/upgrade` — Stripe **monthly** or **annual** subscription; **Premium** adds PDF snapshot export, saved scenarios, plan-aware AI
5. `/recommendations` — affiliate cards from Supabase
6. `/ai-assistant` — chat (messages in `messages`)

If you already ran an older `schema.sql`, apply `supabase/migrations/002_saved_scenarios.sql` for Premium scenario saving.

## Architecture notes

- **Supabase**: server actions use the **service role** client only after `auth()` / `requireUserId()` from Clerk. Do not expose the service role to the browser.
- **Premium**: Stripe Checkout → webhook updates `usersubscription`. Subscribers get PDF export (`/api/report/pdf`), saved scenarios (`saved_scenarios`), and plan-aware AI (`/api/chat` uses profile context; higher token limit).
- **Advisor portal**: `/advisor-portal` (restricted by `ADVISOR_USER_IDS` or `publicMetadata.role === "advisor"`).
