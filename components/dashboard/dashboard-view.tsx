"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { compareSocialSecurityOptions, projectMoneyLasts, projectSavingsGrowth } from "@/lib/calculations/retirement";
import { saveBudgetCategories } from "@/app/actions/budget";
import type { AdRecord } from "@/components/ads/AdSlot";
import { AdSlot } from "@/components/ads/AdSlot";
import { AdvisorLeadModal } from "@/components/lead-gen/AdvisorLeadModal";
import { MoneyChart } from "@/components/dashboard/money-chart";
import { PremiumTools } from "@/components/dashboard/premium-tools";
import type { SavedScenarioRow } from "@/lib/types/scenario";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ProfileVM = {
  age: number;
  retirementage: number;
  savings: number;
  monthlycontrib: number;
  monthlyexpenses: number;
  ssstartage: number;
  risktolerance: string;
};

export function DashboardView({
  profile,
  premium,
  savedScenarios,
  adsSidebar,
  adsInline,
  adsFooter,
  budgetRows,
}: {
  profile: ProfileVM;
  premium: boolean;
  savedScenarios: SavedScenarioRow[];
  adsSidebar: AdRecord[];
  adsInline: AdRecord[];
  adsFooter: AdRecord[];
  budgetRows: { category: string; amount: number }[];
}) {
  const [leadOpen, setLeadOpen] = useState(false);
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);

  const [annualReturn, setAnnualReturn] = useState(
    profile.risktolerance === "conservative" ? 5 : profile.risktolerance === "aggressive" ? 8 : 6.5
  );
  const [inflation, setInflation] = useState(2.5);
  const [ssMonthly, setSsMonthly] = useState(2200);

  const result = useMemo(
    () =>
      projectMoneyLasts({
        age: profile.age,
        retirementAge: profile.retirementage,
        savings: profile.savings,
        monthlyContrib: profile.monthlycontrib,
        monthlySpending: profile.monthlyexpenses,
        annualReturnPct: annualReturn,
        inflationPct: inflation,
        ssMonthly,
      }),
    [profile, annualReturn, inflation, ssMonthly]
  );

  const savingsCurve = useMemo(
    () =>
      projectSavingsGrowth({
        age: profile.age,
        retirementAge: profile.retirementage,
        savings: profile.savings,
        monthlyContrib: profile.monthlycontrib,
        annualReturnPct: annualReturn,
      }),
    [profile, annualReturn]
  );

  const ssCompare = useMemo(() => compareSocialSecurityOptions(ssMonthly), [ssMonthly]);

  const [budget, setBudget] = useState<{ category: string; amount: number }[]>(
    budgetRows.length
      ? budgetRows
      : [
          { category: "Housing", amount: 1800 },
          { category: "Food", amount: 700 },
          { category: "Healthcare", amount: 500 },
          { category: "Fun & travel", amount: 400 },
        ]
  );

  function runCalculator() {
    setShowLeadPrompt(true);
  }

  const hasAds = adsSidebar.length > 0;

  return (
    <div
      className={cn(
        "mx-auto grid max-w-6xl gap-8 px-4 py-8",
        hasAds && "lg:grid-cols-[1fr_280px]"
      )}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
            Your retirement snapshot
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-emerald-900/85">
            Simple numbers, clear picture — we&apos;re here to help you feel confident.
          </p>
          {!premium ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                Free plan
              </Badge>
              <Link
                href="/upgrade"
                className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-base font-semibold text-white hover:bg-emerald-700"
              >
                View plans &amp; upgrade
              </Link>
            </div>
          ) : null}
        </div>

        {premium ? (
          <PremiumTools
            scenarios={savedScenarios}
            snapshot={{ annualReturn, inflation, ssMonthly }}
            onApplyScenario={(p) => {
              setAnnualReturn(p.annualReturn);
              setInflation(p.inflation);
              setSsMonthly(p.ssMonthly);
            }}
          />
        ) : (
          <Card className="rounded-3xl border-emerald-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-950">Go beyond the free snapshot</CardTitle>
              <CardDescription className="text-base">
                Premium includes a shareable PDF, saved &quot;what-if&quot; scenarios, and plan-aware AI — priced
                monthly or annually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/upgrade"
                className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-base font-semibold text-white hover:bg-emerald-700"
              >
                View plans &amp; pricing
              </Link>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="money" className="w-full gap-8">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2.5 rounded-2xl bg-emerald-100/80 p-2.5 sm:gap-2 sm:p-2 lg:grid-cols-4">
            <TabsTrigger value="money" className="min-h-[2.75rem] rounded-xl px-2 py-2.5 text-sm leading-snug sm:min-h-9 sm:px-3 sm:py-3 sm:text-base">
              Money lasts
            </TabsTrigger>
            <TabsTrigger value="budget" className="min-h-[2.75rem] rounded-xl px-2 py-2.5 text-sm leading-snug sm:min-h-9 sm:px-3 sm:py-3 sm:text-base">
              Budget
            </TabsTrigger>
            <TabsTrigger value="growth" className="min-h-[2.75rem] rounded-xl px-2 py-2.5 text-sm leading-snug sm:min-h-9 sm:px-3 sm:py-3 sm:text-base">
              Savings growth
            </TabsTrigger>
            <TabsTrigger value="ss" className="min-h-[2.75rem] rounded-xl px-2 py-2.5 text-sm leading-snug sm:min-h-9 sm:px-3 sm:py-3 sm:text-base">
              Social Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="money" className="mt-0 space-y-6">
            <Card className="rounded-3xl border-emerald-100 shadow-sm">
              <CardHeader className="space-y-3 pb-2 sm:pb-4">
                <CardTitle className="text-xl leading-tight text-emerald-950 sm:text-2xl">Will my money last?</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-emerald-900/85 sm:text-base">
                  Adjust the sliders — we&apos;ll update your outlook instantly.{" "}
                  {premium
                    ? "Use Premium tools above to export a PDF or save this scenario."
                    : "Upgrade for PDF export, saved scenarios, and plan-aware AI."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 sm:space-y-6">
                <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
                  <div className="min-w-0 space-y-1">
                    <Label className="text-sm font-medium leading-snug sm:text-base">
                      Expected annual return ({annualReturn}%)
                    </Label>
                    <Slider
                      value={[annualReturn]}
                      min={2}
                      max={12}
                      step={0.5}
                      onValueChange={(v) => setAnnualReturn(Array.isArray(v) ? (v[0] ?? 6) : v)}
                      className="mt-4 sm:mt-3"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <Label className="text-sm font-medium leading-snug sm:text-base">Inflation ({inflation}%)</Label>
                    <Slider
                      value={[inflation]}
                      min={1}
                      max={5}
                      step={0.5}
                      onValueChange={(v) => setInflation(Array.isArray(v) ? (v[0] ?? 2.5) : v)}
                      className="mt-4 sm:mt-3"
                    />
                  </div>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <Label htmlFor="ssm" className="text-sm sm:text-base">
                    Estimated monthly Social Security
                  </Label>
                  <Input
                    id="ssm"
                    type="number"
                    className="h-12 w-full text-base sm:text-lg"
                    value={ssMonthly}
                    onChange={(e) => setSsMonthly(+e.target.value)}
                  />
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-6 text-center sm:px-6 sm:py-7">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 sm:text-sm">Outlook</p>
                  <p className="mt-4 text-xl font-bold leading-snug text-emerald-950 sm:mt-3 sm:text-2xl md:text-3xl">
                    {result.depletionAge
                      ? `Funds may run low around age ${result.depletionAge}`
                      : `Your money can last past age ${profile.retirementage + Math.max(5, result.yearsFundsLast)}`}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-emerald-900/90 sm:mt-3 sm:text-lg">
                    Confidence score (illustrative):{" "}
                    <span className="font-semibold tabular-nums">{result.survivalProbabilityPct}%</span>
                  </p>
                </div>

                <div className="-mx-1 min-w-0 sm:mx-0">
                  <MoneyChart data={result.chart.slice(0, 80)} />
                </div>

                <Button
                  type="button"
                  className="h-12 w-full rounded-full text-base sm:w-auto"
                  onClick={runCalculator}
                >
                  I ran my numbers — what&apos;s next?
                </Button>

                {showLeadPrompt ? (
                  <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                    <p className="text-lg font-medium text-emerald-950">
                      Want a certified advisor to review your plan for free?
                    </p>
                    <Button className="mt-3 h-12 rounded-full text-base" onClick={() => setLeadOpen(true)}>
                      Yes, connect me
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="mt-0">
            <Card className="rounded-3xl border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Retirement budget planner</CardTitle>
                <CardDescription className="text-base">Edit monthly amounts by category.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {budget.map((row, i) => (
                  <div
                    key={row.category}
                    className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
                  >
                    <Label className="shrink-0 text-base sm:w-32">{row.category}</Label>
                    <Input
                      type="number"
                      className="h-11 w-full max-w-full text-base sm:max-w-[10rem]"
                      value={row.amount}
                      onChange={(e) => {
                        const v = +e.target.value;
                        setBudget((b) => b.map((x, j) => (j === i ? { ...x, amount: v } : x)));
                      }}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  className="h-11 rounded-full"
                  onClick={() =>
                    toast.promise(
                      saveBudgetCategories(budget).then((r) => {
                        if (!r.ok) throw new Error(r.error);
                      }),
                      {
                        loading: "Saving budget…",
                        success: "Budget saved.",
                        error: (err) => (err instanceof Error ? err.message : "Could not save budget."),
                      }
                    )
                  }
                >
                  Save budget
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="mt-0">
            <Card className="rounded-3xl border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Savings growth forecaster</CardTitle>
                <CardDescription className="text-base">Projected balance if you stay on track.</CardDescription>
              </CardHeader>
              <CardContent>
                <MoneyChart data={savingsCurve} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ss" className="mt-0">
            <Card className="rounded-3xl border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Social Security optimizer</CardTitle>
                <CardDescription className="text-base">
                  Uses your estimated monthly benefit from the Money lasts tab as a baseline at 67 (illustrative;
                  not from SSA).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ssCompare.rows.map((r) => (
                  <div
                    key={r.age}
                    className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2 sm:py-3"
                  >
                    <span className="text-lg font-semibold text-emerald-950">Start at age {r.age}</span>
                    <div className="flex flex-col gap-1 border-t border-emerald-200/80 pt-3 sm:flex-1 sm:flex-row sm:items-baseline sm:justify-end sm:gap-4 sm:border-t-0 sm:pt-0">
                      <span className="text-lg font-semibold tabular-nums text-emerald-950">
                        ${r.monthly.toLocaleString()}/mo
                      </span>
                      <span className="text-sm leading-snug text-emerald-800/85">
                        ~${r.lifetimeTo90.toLocaleString()} to age 90 (illustrative)
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {hasAds ? (
          <>
            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-emerald-950">Recommended next steps</h2>
              <p className="mt-1 text-base text-emerald-900/85">Hand-picked ideas to strengthen your plan.</p>
              <div className="mt-4">
                <AdSlot type="inline" ads={adsInline} />
              </div>
            </section>

            <AdSlot type="footer" ads={adsFooter} />
          </>
        ) : null}
      </div>

      {hasAds ? (
        <aside className="hidden space-y-6 lg:block">
          <AdSlot type="sidebar" ads={adsSidebar} />
        </aside>
      ) : null}

      <AdvisorLeadModal open={leadOpen} onOpenChange={setLeadOpen} />
    </div>
  );
}
