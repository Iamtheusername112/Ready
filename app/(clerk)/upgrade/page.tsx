import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  Bot,
  FileDown,
  HeartHandshake,
  Save,
  Table2,
  Zap,
} from "lucide-react";
import { BtcPlanCard } from "@/components/billing/btc-plan-card";
import { getBtcPlans, getChangellyUrl, getPremiumContactEmail } from "@/lib/billing/premium-btc";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const featureTiles: { icon: typeof FileDown; title: string; body: string; className: string }[] = [
  {
    icon: FileDown,
    title: "Clarity your family can hold onto",
    body: "The fear isn’t just numbers—it’s that someone you love won’t know what’s real if you’re not there to explain it. Export a professional plan snapshot your spouse, kids, or advisor can actually read and file away.",
    className: "bg-gradient-to-br from-teal-100/90 to-emerald-50 sm:col-span-1",
  },
  {
    icon: Save,
    title: "Rehearse the “what ifs” that keep you awake",
    body: "What if the market stumbles? What if you live to 95? What if inflation runs hotter? Save scenario runs—different returns, timing, and assumptions—so you’re not guessing when life refuses to stay on script.",
    className: "bg-gradient-to-br from-amber-100/90 to-orange-50 sm:col-span-1",
  },
  {
    icon: Bot,
    title: "Guidance that knows your story, not generic tips",
    body: "Tired of articles that ignore your savings, age, and goals? The assistant uses your profile so answers feel relevant to you—plain language, still educational (not tax or legal advice).",
    className: "bg-gradient-to-br from-violet-100/80 to-fuchsia-50 sm:col-span-2 lg:col-span-1",
  },
  {
    icon: Table2,
    title: "Social Security without the costly guess",
    body: "Claiming at the wrong age can leave serious money on the table. See your estimated benefits compared across start ages in one place—so the biggest income decision of retirement feels less like a blindfolded step.",
    className: "bg-gradient-to-br from-sky-100/80 to-cyan-50 sm:col-span-2 lg:col-span-1",
  },
  {
    icon: HeartHandshake,
    title: "A toolkit that doesn’t freeze in time",
    body: "You’re not buying a one-off spreadsheet that goes stale. Membership helps us improve calculators, protect your privacy, and ship updates—so the decades ahead aren’t navigated with yesterday’s tools alone.",
    className: "bg-gradient-to-br from-rose-100/70 to-amber-50/80 sm:col-span-2 lg:col-span-2",
  },
];

export default function UpgradePage() {
  const plans = getBtcPlans();
  const changellyUrl = getChangellyUrl();
  const contactEmail = getPremiumContactEmail();

  return (
    <div className="pb-16 pt-2">
      {/* Hero */}
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-5 py-12 shadow-2xl shadow-teal-950/40 sm:px-10 sm:py-16">
        <div
          className="upgrade-orb pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-teal-500/25 blur-3xl"
          aria-hidden
        />
        <div
          className="upgrade-orb-delayed pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-2xl"
          aria-hidden
        />

        <div className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-teal-200/95 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-amber-300" aria-hidden />
            RetireReady Premium
          </span>
          <h1
            className={`${display.className} mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]`}
          >
            Stress-test your future
            <span className="block bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">
              — without the boring bits
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300/95">
            Unlock exports, saved runs, and a coach that knows your numbers. Pick a plan, complete payment, and
            we&apos;ll activate Premium on your account.
          </p>
        </div>
      </div>

      {/* Bento */}
      <div className="relative z-10 -mt-8 mx-auto max-w-5xl px-4">
        <div className="rounded-[2rem] border border-white/60 bg-[#f5f0e9]/95 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-800/90">For ages 40 to 99+</p>
          <h2 className={`${display.className} mt-2 text-2xl font-bold text-slate-900 sm:text-3xl`}>
            What you unlock
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            The worry isn’t “another app”—it’s outliving your money, leaving your partner lost, mis-timing Social
            Security, or waking up to a market you can’t control. Premium is built around those fears: concrete tools
            so taking this step feels less like a gamble and more like the best decision you could make for the decades
            ahead—not a promise of returns, but a serious system for thinking them through.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featureTiles.map((tile) => (
              <div
                key={tile.title}
                className={`flex gap-4 rounded-2xl border border-white/50 p-4 shadow-sm transition hover:shadow-md ${tile.className}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-slate-800 shadow-sm">
                  <tile.icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{tile.title}</p>
                  <p className="mt-1 text-sm leading-snug text-slate-700">{tile.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="mx-auto mt-12 max-w-5xl px-4">
        <div className="text-center">
          <h2 className={`${display.className} text-3xl font-bold text-slate-900`}>Pick your vibe</h2>
          <p className="mx-auto mt-2 max-w-lg text-slate-600">
            Two speeds — same perks. Choose the billing cadence that fits you.
          </p>
        </div>

        {plans.length > 0 ? (
          <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2 sm:gap-8">
            {plans.map((plan, i) => (
              <BtcPlanCard
                key={plan.id}
                plan={plan}
                changellyUrl={changellyUrl}
                highlight={plan.id === "annual" || (plans.length === 1 && i === 0)}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-lg rounded-[1.75rem] border-2 border-dashed border-amber-300/80 bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-8 text-center shadow-inner">
            <p className={`${display.className} text-xl font-bold text-amber-950`}>Plans aren&apos;t live yet</p>
            <p className="mt-2 text-sm text-amber-900/90">
              Configure subscription payment addresses in your environment (see{" "}
              <code className="rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_PREMIUM_BTC_MONTHLY</code> /{" "}
              <code className="rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_PREMIUM_BTC_ANNUAL</code>
              {" "}in <code className="rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-xs">.env.example</code>) — then
              plans will appear here.
            </p>
          </div>
        )}

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-teal-200/60 bg-gradient-to-r from-teal-50/80 to-emerald-50/50 px-5 py-4 text-sm text-slate-700 shadow-sm">
          <p>
            <strong className="text-slate-900">Activation:</strong> Premium turns on after we confirm your payment —
            usually within one business day.
            {contactEmail ? (
              <>
                {" "}
                Email{" "}
                <a
                  className="font-semibold text-teal-800 underline decoration-teal-400/80 underline-offset-2 hover:text-teal-950"
                  href={`mailto:${contactEmail}?subject=RetireReady%20Premium%20subscription`}
                >
                  {contactEmail}
                </a>{" "}
                with your payment reference if you want help matching your subscription.
              </>
            ) : null}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-8 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 hover:shadow-xl"
          >
            ← Back to dashboard
          </Link>
        </div>

        <p className="mx-auto mt-10 max-w-lg text-center text-xs leading-relaxed text-slate-500">
          Educational software only — no performance guarantees. Verify payment details before you complete a
          transfer. Subscription terms and renewals are as published by RetireReady.
        </p>
      </div>
    </div>
  );
}
