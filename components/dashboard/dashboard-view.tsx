"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

        <Tabs defaultValue="money" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-emerald-100/80 p-2 lg:grid-cols-4">
            <TabsTrigger value="money" className="rounded-xl py-3 text-base">
              Money lasts
            </TabsTrigger>
            <TabsTrigger value="budget" className="rounded-xl py-3 text-base">
              Budget
            </TabsTrigger>
            <TabsTrigger value="growth" className="rounded-xl py-3 text-base">
              Savings growth
            </TabsTrigger>
            <TabsTrigger value="ss" className="rounded-xl py-3 text-base">
              Social Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="money" className="mt-6 space-y-6">
            <Card className="rounded-3xl border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-emerald-950">Will my money last?</CardTitle>
                <CardDescription className="text-base">
                  Adjust the sliders — we&apos;ll update your outlook instantly.{" "}
                  {premium
                    ? "Use Premium tools above to export a PDF or save this scenario."
                    : "Upgrade for PDF export, saved scenarios, and plan-aware AI."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label className="text-base">Expected annual return ({annualReturn}%)</Label>
                    <Slider
                      value={[annualReturn]}
                      min={2}
                      max={12}
                      step={0.5}
                      onValueChange={(v) => setAnnualReturn(Array.isArray(v) ? (v[0] ?? 6) : v)}
                      className="mt-3"
                    />
                  </div>
                  <div>
                    <Label className="text-base">Inflation ({inflation}%)</Label>
                    <Slider
                      value={[inflation]}
                      min={1}
                      max={5}
                      step={0.5}
                      onValueChange={(v) => setInflation(Array.isArray(v) ? (v[0] ?? 2.5) : v)}
                      className="mt-3"
                    />
                  </div>
                </div>
                <div className="max-w-xs space-y-2">
                  <Label htmlFor="ssm">Estimated monthly Social Security</Label>
                  <Input
                    id="ssm"
                    type="number"
                    className="h-12 text-lg"
                    value={ssMonthly}
                    onChange={(e) => setSsMonthly(+e.target.value)}
                  />
                </div>

                <div className="rounded-2xl bg-emerald-50 p-6 text-center">
                  <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">Outlook</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-950">
                    {result.depletionAge
                      ? `Funds may run low around age ${result.depletionAge}`
                      : `Your money can last past age ${profile.retirementage + Math.max(5, result.yearsFundsLast)}`}
                  </p>
                  <p className="mt-2 text-lg text-emerald-900/90">
                    Confidence score (illustrative): {result.survivalProbabilityPct}%
                  </p>
                </div>

                <MoneyChart data={result.chart.slice(0, 80)} />

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

          <TabsContent value="budget" className="mt-6">
            <Card className="rounded-3xl border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Retirement budget planner</CardTitle>
                <CardDescription className="text-base">Edit monthly amounts by category.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {budget.map((row, i) => (
                  <div key={row.category} className="flex flex-wrap items-center gap-3">
                    <Label className="w-32 text-base">{row.category}</Label>
                    <Input
                      type="number"
                      className="h-11 max-w-[10rem] text-base"
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
                    saveBudgetCategories(budget).then(() => {
                      /* optimistic — could toast */
                    })
                  }
                >
                  Save budget
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="mt-6">
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

          <TabsContent value="ss" className="mt-6">
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
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3"
                  >
                    <span className="text-lg font-medium">Start at age {r.age}</span>
                    <span className="text-lg">${r.monthly.toLocaleString()}/mo</span>
                    <span className="text-sm text-emerald-800/80">
                      ~${r.lifetimeTo90.toLocaleString()} to age 90 (illustrative)
                    </span>
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
