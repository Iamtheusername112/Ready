"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upsertProfile, type OnboardingPayload } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const steps = [
  "Age & goals",
  "Savings",
  "Spending",
  "Social Security",
  "Comfort level",
] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<OnboardingPayload>({
    age: 55,
    retirementage: 67,
    savings: 150000,
    monthlycontrib: 800,
    monthlyexpenses: 4500,
    ssstartage: 67,
    risktolerance: "moderate",
    zip: "",
  });

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function finish() {
    setSaveError(null);
    startTransition(async () => {
      const res = await upsertProfile(form);
      if (res.ok) {
        toast.success("Profile saved. Welcome to your dashboard.");
        router.push("/dashboard");
        router.refresh();
        return;
      }
      const msg =
        res.error ??
        "Could not save your answers. Check that Supabase is configured and the database is set up.";
      setSaveError(msg);
      toast.error(msg);
    });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="mb-2 text-center text-sm font-medium text-emerald-800">
        Step {step + 1} of {steps.length}
      </p>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <Card className="rounded-3xl border-emerald-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-950">{steps[step]}</CardTitle>
          <CardDescription className="text-base text-emerald-900/80">
            Take your time — you can change this later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="age">Your age today</Label>
                <Input
                  id="age"
                  type="number"
                  min={40}
                  max={99}
                  className="h-12 text-lg"
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: +e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ret">Age you hope to retire</Label>
                <Input
                  id="ret"
                  type="number"
                  min={50}
                  max={85}
                  className="h-12 text-lg"
                  value={form.retirementage}
                  onChange={(e) => setForm((f) => ({ ...f, retirementage: +e.target.value }))}
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sav">Total savings & investments (approx.)</Label>
                <Input
                  id="sav"
                  type="number"
                  min={0}
                  className="h-12 text-lg"
                  value={form.savings}
                  onChange={(e) => setForm((f) => ({ ...f, savings: +e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mc">Monthly contributions</Label>
                <Input
                  id="mc"
                  type="number"
                  min={0}
                  className="h-12 text-lg"
                  value={form.monthlycontrib}
                  onChange={(e) => setForm((f) => ({ ...f, monthlycontrib: +e.target.value }))}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="ex">Expected monthly expenses in retirement</Label>
              <Input
                id="ex"
                type="number"
                min={0}
                className="h-12 text-lg"
                value={form.monthlyexpenses}
                onChange={(e) => setForm((f) => ({ ...f, monthlyexpenses: +e.target.value }))}
              />
              <p className="text-sm text-emerald-800/80">Include housing, food, healthcare, and fun.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <Label>Planned Social Security start age</Label>
              <RadioGroup
                value={String(form.ssstartage)}
                onValueChange={(v) => setForm((f) => ({ ...f, ssstartage: +v as 62 | 67 | 70 }))}
                className="flex flex-col gap-3"
              >
                {([62, 67, 70] as const).map((a) => (
                  <label
                    key={a}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-base"
                  >
                    <RadioGroupItem value={String(a)} id={`ss-${a}`} />
                    <span>Age {a}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <Label>How do you like to invest?</Label>
              <RadioGroup
                value={form.risktolerance}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    risktolerance: v as OnboardingPayload["risktolerance"],
                  }))
                }
                className="flex flex-col gap-3"
              >
                {(
                  [
                    ["conservative", "Conservative — protect what I have"],
                    ["moderate", "Moderate — balance growth and safety"],
                    ["aggressive", "Aggressive — maximize long-term growth"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-base"
                  >
                    <RadioGroupItem value={value} id={value} className="mt-1" />
                    <span>{label}</span>
                  </label>
                ))}
              </RadioGroup>
              <div className="space-y-2 pt-2">
                <Label htmlFor="zip">ZIP code (optional, for local tips)</Label>
                <Input
                  id="zip"
                  className="h-12 text-lg"
                  value={form.zip}
                  onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                />
              </div>
            </div>
          )}

          {saveError ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900"
            >
              <p className="font-medium">We couldn&apos;t save your profile</p>
              <p className="mt-1 text-sm">{saveError}</p>
              <p className="mt-2 text-sm text-red-800/90">
                Add <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="rounded bg-white/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
                <code className="rounded bg-white/80 px-1">.env.local</code>, then run{" "}
                <code className="rounded bg-white/80 px-1">supabase/schema.sql</code> in the Supabase SQL
                editor. Restart <code className="rounded bg-white/80 px-1">npm run dev</code> after changing
                env.
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            {step > 0 ? (
              <Button type="button" variant="outline" className="h-12 rounded-full px-6 text-base" onClick={back}>
                Back
              </Button>
            ) : null}
            {step < steps.length - 1 ? (
              <Button type="button" className="h-12 rounded-full px-8 text-base" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                className="h-12 rounded-full px-8 text-base"
                disabled={pending}
                onClick={finish}
              >
                {pending ? "Saving…" : "Finish & see my dashboard"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
