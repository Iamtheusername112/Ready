"use client";

import { ExternalLink, Copy, Check, Sparkles, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { BtcPlan } from "@/lib/billing/premium-btc";

export function BtcPlanCard({
  plan,
  changellyUrl,
  highlight,
}: {
  plan: BtcPlan;
  changellyUrl: string;
  highlight?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(plan.btcAddress);
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — select the address manually.");
    }
  }

  const Icon = plan.id === "annual" ? Sparkles : Calendar;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border-2 bg-white/95 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        highlight
          ? "border-amber-400/90 ring-2 ring-amber-300/50 ring-offset-2 ring-offset-[#f0ebe3]"
          : "border-teal-200/80 hover:border-teal-300"
      }`}
    >
      {highlight ? (
        <div className="absolute right-4 top-4 rotate-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">
          Best value
        </div>
      ) : null}

      <div className="mb-4 flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            highlight
              ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md"
              : "bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md"
          }`}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">{plan.title}</h3>
          <p className="mt-0.5 bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-lg font-extrabold text-transparent">
            {plan.priceLabel}
          </p>
          <p className="mt-1 text-sm leading-snug text-slate-600">{plan.blurb}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-inner">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300/90">Payment address</p>
        <p className="mt-2 break-all font-mono text-xs leading-relaxed text-teal-50 sm:text-sm">{plan.btcAddress}</p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="mt-3 w-full rounded-full border-0 bg-white/15 text-white hover:bg-white/25"
          onClick={copyAddress}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" aria-hidden />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" aria-hidden />
              Copy address
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-teal-200/80 bg-teal-50/50 px-3 py-3 text-sm text-slate-700">
        <p className="font-semibold text-teal-900">Quick path</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4 marker:font-semibold marker:text-teal-600">
          <li>Use the button below if you need to complete checkout with our payment partner (opens in a new tab).</li>
          <li>Send the plan amount to the address above.</li>
          <li>We verify your payment and activate Premium on your account.</li>
        </ol>
      </div>

      <Button
        asChild
        className="mt-4 h-12 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-base font-bold text-white shadow-md transition hover:from-orange-600 hover:to-amber-600 hover:shadow-lg"
      >
        <a href={changellyUrl} target="_blank" rel="noopener noreferrer">
          Continue to payment
          <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
        </a>
      </Button>
      <p className="mt-2 text-center text-[11px] text-slate-500">Opens in a new tab — keep this page open for your payment details.</p>
    </div>
  );
}
