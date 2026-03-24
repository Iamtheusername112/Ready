/** Default outbound link for completing subscription payment (e.g. payment partner checkout). */
export function getChangellyUrl(): string {
  const u = process.env.NEXT_PUBLIC_CHANGELLY_URL?.trim();
  return u && /^https?:\/\//i.test(u) ? u : "https://changelly.com";
}

export type BtcPlan = {
  id: "monthly" | "annual";
  title: string;
  btcAddress: string;
  priceLabel: string;
  blurb: string;
};

/**
 * Plans are driven by env: set at least one of
 * `NEXT_PUBLIC_PREMIUM_BTC_MONTHLY` / `NEXT_PUBLIC_PREMIUM_BTC_ANNUAL`.
 */
export function getBtcPlans(): BtcPlan[] {
  const monthly = process.env.NEXT_PUBLIC_PREMIUM_BTC_MONTHLY?.trim();
  const annual = process.env.NEXT_PUBLIC_PREMIUM_BTC_ANNUAL?.trim();
  const monthlyUsd = process.env.NEXT_PUBLIC_PREMIUM_PRICE_MONTHLY_USD?.trim();
  const annualUsd = process.env.NEXT_PUBLIC_PREMIUM_PRICE_ANNUAL_USD?.trim();

  const plans: BtcPlan[] = [];
  if (monthly) {
    plans.push({
      id: "monthly",
      title: "Monthly",
      btcAddress: monthly,
      priceLabel: monthlyUsd ? `$${monthlyUsd} / month` : "Monthly plan",
      blurb: "Pay for one month at a time. Renew by sending the next period’s amount before it expires.",
    });
  }
  if (annual) {
    plans.push({
      id: "annual",
      title: "Annual",
      btcAddress: annual,
      priceLabel: annualUsd ? `$${annualUsd} / year` : "Annual plan",
      blurb: "Best value — one annual payment covers 12 months of Premium.",
    });
  }
  return plans;
}

export function getPremiumContactEmail(): string | null {
  const e = process.env.NEXT_PUBLIC_PREMIUM_CONTACT_EMAIL?.trim();
  return e && e.includes("@") ? e : null;
}
