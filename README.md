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
   - **Stripe**: secret key, webhook secret, publishable key, **Price ID** for your subscription product
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

## Build

```bash
npm run build
```

The marketing home page lives under `app/(public)/` and stays static. Clerk-wrapped routes are under `app/(clerk)/` so builds succeed without Clerk keys on prerendered shell pages.

## User flow

1. Landing → **Start Free** → `/sign-up` (Clerk)
2. After sign-up → `/onboarding` → profile saved to `userprofile`
3. → `/dashboard` with calculators, budget, SS comparison, ads, lead-gen modal, premium CTA
4. `/recommendations` — affiliate cards from Supabase
5. `/ai-assistant` — chat (messages stored in `messages`)

## Architecture notes

- **Supabase**: server actions use the **service role** client only after `auth()` / `requireUserId()` from Clerk. Do not expose the service role to the browser.
- **Premium**: Stripe Checkout → webhook updates `usersubscription`.
- **Advisor portal**: `/advisor-portal` (restricted by `ADVISOR_USER_IDS` or `publicMetadata.role === "advisor"`).
