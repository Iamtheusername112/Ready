"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteScenario, saveScenario } from "@/app/actions/scenarios";
import type { SavedScenarioRow, ScenarioPayload } from "@/lib/types/scenario";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PremiumTools({
  snapshot,
  scenarios,
  onApplyScenario,
}: {
  snapshot: ScenarioPayload;
  scenarios: SavedScenarioRow[];
  onApplyScenario: (p: ScenarioPayload) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function downloadPdf() {
    const q = new URLSearchParams({
      annualReturn: String(snapshot.annualReturn),
      inflation: String(snapshot.inflation),
      ssMonthly: String(snapshot.ssMonthly),
    });
    window.open(`/api/report/pdf?${q.toString()}`, "_blank", "noopener,noreferrer");
    toast.info("Opening your PDF…");
  }

  return (
    <Card className="rounded-3xl border-emerald-200 bg-white/95 shadow-sm ring-1 ring-emerald-600/10">
      <CardHeader>
        <CardTitle className="text-xl text-emerald-950">Premium tools</CardTitle>
        <CardDescription className="text-base">
          Export and revisit the assumptions you&apos;re using on the Money lasts tab.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-11 rounded-full"
            onClick={downloadPdf}
          >
            Download PDF snapshot
          </Button>
        </div>

        <div className="space-y-2 border-t border-emerald-100 pt-6">
          <Label htmlFor="scname">Save current scenario</Label>
          <p className="text-sm text-emerald-800/80">
            Stores return, inflation, and Social Security estimate from your current sliders.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Input
              id="scname"
              placeholder="e.g. Lower return stress test"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 max-w-md"
            />
            <Button
              type="button"
              className="h-11 rounded-full"
              disabled={pending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  const res = await saveScenario(name, snapshot);
                  if (!res.ok) {
                    setError(res.error);
                    toast.error(res.error);
                    return;
                  }
                  toast.success("Scenario saved.");
                  setName("");
                  router.refresh();
                });
              }}
            >
              Save
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>

        {scenarios.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-emerald-900">Saved scenarios</p>
            <ul className="space-y-2">
              {scenarios.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-3 py-2"
                >
                  <span className="font-medium text-emerald-950">{s.name}</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                      onClick={() => onApplyScenario(s.payload)}
                    >
                      Load
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-red-700 hover:text-red-800"
                      disabled={pending}
                      onClick={() => {
                        startTransition(async () => {
                          const res = await deleteScenario(s.id);
                          if (!res.ok) {
                            toast.error(res.error);
                            return;
                          }
                          toast.success("Scenario removed.");
                          router.refresh();
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
