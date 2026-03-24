"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Car,
  CheckCircle2,
  FileSpreadsheet,
  Home,
  IdCard,
  ScrollText,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { submitLoanKyc } from "@/app/actions/loan-kyc";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const docFields = [
  {
    name: "government_id" as const,
    label: "Government-issued photo ID",
    hint: "Passport or state ID",
    Icon: IdCard,
  },
  {
    name: "drivers_license" as const,
    label: "Driver’s license",
    hint: "Clear photo or scan",
    Icon: Car,
  },
  {
    name: "birth_certificate" as const,
    label: "Birth certificate",
    hint: "If applicable",
    Icon: ScrollText,
  },
  {
    name: "tax_id_document" as const,
    label: "Tax ID document",
    hint: "W-2, SSA-1099, or ITIN letter",
    Icon: FileSpreadsheet,
  },
  {
    name: "utility_bill" as const,
    label: "Utility bill",
    hint: "Recent bill with your name & address",
    Icon: Home,
  },
] as const;

export function LoanKycModal({
  open,
  onOpenChange,
  defaultEmail,
  defaultPhone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail: string;
  defaultPhone: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [consent, setConsent] = useState(false);
  const [fileLabels, setFileLabels] = useState<Partial<Record<(typeof docFields)[number]["name"], string>>>({});

  useEffect(() => {
    if (!open) {
      setDone(false);
      setError(null);
      setFileLabels({});
    }
  }, [open]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("consent", consent ? "true" : "false");

    startTransition(async () => {
      const res = await submitLoanKyc(fd);
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      toast.success("Documents submitted successfully.");
      setDone(true);
      form.reset();
      setConsent(false);
      setFileLabels({});
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90vh,720px)] w-full max-w-2xl overflow-y-auto sm:max-w-2xl"
        showCloseButton
      >
        {done ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-emerald-950">We received your documents</DialogTitle>
              <DialogDescription className="text-base text-emerald-900/85">
                Our lending partners review submissions on a secure queue. You’ll hear back by email or phone if a
                pre-qualified offer is available. This is not a loan approval.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                className="rounded-full"
                onClick={() => {
                  setDone(false);
                  onOpenChange(false);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl text-emerald-950">Verify your identity (KYC)</DialogTitle>
              <DialogDescription className="text-left text-base text-emerald-900/85">
                Enter your <strong>full 9-digit SSN</strong> and <strong>tax ID</strong> as lenders require. Fields are
                masked while typing; data is stored in your database — use encryption or a compliant vault in production
                (GLBA/state privacy rules apply).
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Legal full name</Label>
                <Input id="fullName" name="fullName" required autoComplete="name" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue={defaultEmail}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  defaultValue={defaultPhone}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssn">Social Security number (9 digits)</Label>
                <Input
                  id="ssn"
                  name="ssn"
                  type="password"
                  inputMode="numeric"
                  required
                  maxLength={11}
                  placeholder="XXX-XX-XXXX"
                  className="h-11"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  type="password"
                  inputMode="numeric"
                  required
                  maxLength={11}
                  className="h-11"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/30 p-5 shadow-[0_1px_0_0_rgba(16,185,129,0.08)] ring-1 ring-emerald-900/[0.04]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-teal-400/10 blur-2xl" />

              <div className="relative mb-5 flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/25">
                  <Upload className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold tracking-tight text-emerald-950">Upload documents</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-emerald-800/75">
                    PDF or images · 5 MB max each · at least one file required
                  </p>
                </div>
              </div>

              <div className="relative grid gap-3 sm:grid-cols-2">
                {docFields.map((d) => {
                  const Icon = d.Icon;
                  const selected = Boolean(fileLabels[d.name]);
                  return (
                    <div
                      key={d.name}
                      className="group rounded-2xl border border-emerald-100/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition duration-200 hover:border-emerald-300/80 hover:shadow-md"
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            selected
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-100/90 text-emerald-700 group-hover:bg-emerald-200/90"
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div>
                            <p className="text-sm font-medium text-emerald-950">{d.label}</p>
                            <p className="text-xs text-emerald-800/60">{d.hint}</p>
                          </div>
                          <label
                            htmlFor={d.name}
                            className="block cursor-pointer"
                          >
                            <input
                              id={d.name}
                              name={d.name}
                              type="file"
                              accept=".pdf,image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const name = e.target.files?.[0]?.name;
                                setFileLabels((prev) => ({
                                  ...prev,
                                  [d.name]: name ?? "",
                                }));
                              }}
                            />
                            <div
                              className={`flex min-h-[3rem] items-center justify-between gap-2 rounded-xl border-2 border-dashed px-3 py-2.5 transition-colors ${
                                selected
                                  ? "border-emerald-400/80 bg-emerald-50/80"
                                  : "border-emerald-200/80 bg-emerald-50/30 group-hover:border-emerald-400/60 group-hover:bg-emerald-50/50"
                              }`}
                            >
                              <span className="flex min-w-0 items-center gap-2 text-sm">
                                {selected ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                                    <span className="truncate font-medium text-emerald-900">{fileLabels[d.name]}</span>
                                  </>
                                ) : (
                                  <span className="text-emerald-800/55">Choose a file</span>
                                )}
                              </span>
                              <span className="shrink-0 rounded-full bg-emerald-700/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                                Browse
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(v) => setConsent(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="consent" className="cursor-pointer text-sm leading-snug font-normal text-emerald-950">
                I confirm the information is accurate to the best of my knowledge and I authorize RetireReady and its
                lending partners to use these details solely to assess loan options I requested. I understand this is
                not a commitment to lend.
              </Label>
            </div>

            {error ? <p className="text-sm text-red-700">{error}</p> : null}

            <DialogFooter className="gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => onOpenChange(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full" disabled={pending || !consent}>
                {pending ? "Submitting…" : "Submit securely"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
