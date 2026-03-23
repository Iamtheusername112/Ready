import Link from "next/link";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpgradePage() {
  const monthly =
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? "";
  const annual = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL ?? "";
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY && (monthly || annual));

  const features = [
    "PDF plan snapshot — download a professional summary you can share with a spouse or advisor",
    "Saved scenarios — store slider assumptions (return, inflation, SS) and reload them anytime",
    "Plan-aware AI — the assistant uses your onboarding profile for relevant examples (still educational)",
    "Full Social Security comparison table tied to your estimated monthly benefit",
    "Supports our ongoing product — calculators, privacy, and improvements",
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-center text-sm font-medium uppercase tracking-wide text-emerald-800">
        RetireReady Premium
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
        Everything you need to stress-test your plan
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-lg text-emerald-900/85">
        One subscription for exports, saved “what-if” runs, and smarter coaching — priced like a few cups of
        coffee a month, or less when you pay yearly.
      </p>

      <ul className="mx-auto mt-10 max-w-xl space-y-3 text-base text-emerald-950">
        {features.map((f) => (
          <li key={f} className="flex gap-3">
            <span className="mt-1 text-emerald-600" aria-hidden>
              ✓
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
        {monthly ? (
          <Card className="rounded-3xl border-emerald-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Monthly</CardTitle>
              <CardDescription>Flexible — cancel anytime in Stripe.</CardDescription>
            </CardHeader>
            <CardContent>
              <CheckoutButton priceId={monthly} className="h-12 w-full rounded-full text-base">
                Subscribe monthly
              </CheckoutButton>
            </CardContent>
          </Card>
        ) : null}

        {annual ? (
          <Card className="rounded-3xl border-emerald-600 bg-emerald-50/80 shadow-md ring-1 ring-emerald-600/20">
            <CardHeader>
              <CardTitle className="text-xl">Annual</CardTitle>
              <CardDescription>Best value — one payment per year.</CardDescription>
            </CardHeader>
            <CardContent>
              <CheckoutButton priceId={annual} className="h-12 w-full rounded-full text-base">
                Subscribe annually
              </CheckoutButton>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {!hasStripe ? (
        <p className="mt-8 text-center text-sm text-amber-900/90">
          Stripe is not configured. Add <code className="rounded bg-white px-1">STRIPE_SECRET_KEY</code> and{" "}
          <code className="rounded bg-white px-1">NEXT_PUBLIC_STRIPE_PRICE_ID</code> (or monthly/annual price
          IDs) in <code className="rounded bg-white px-1">.env.local</code>.
        </p>
      ) : null}

      {!monthly && !annual ? (
        <p className="mt-8 text-center text-sm text-amber-900/90">
          Set <code className="rounded bg-white px-1">NEXT_PUBLIC_STRIPE_PRICE_ID</code> or monthly/annual price
          IDs from your Stripe Dashboard.
        </p>
      ) : null}

      <div className="mt-10 flex justify-center">
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-emerald-900 ring-1 ring-emerald-200/80 hover:bg-emerald-100/60"
        >
          Back to dashboard
        </Link>
      </div>

      <p className="mx-auto mt-8 max-w-lg text-center text-xs text-emerald-800/70">
        Educational software only. No performance guarantees. Renewals and refunds follow Stripe and your
        published terms.
      </p>
    </div>
  );
}
