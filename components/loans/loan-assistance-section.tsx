"use client";

import { useState } from "react";
import { LoanKycModal } from "@/components/loans/loan-kyc-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoanAssistanceSection({
  defaultEmail,
  defaultPhone,
}: {
  defaultEmail: string;
  defaultPhone: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="rounded-3xl border-emerald-200 bg-white/95 shadow-sm ring-1 ring-emerald-600/10">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-950">Loans without the usual paperwork marathon</CardTitle>
          <CardDescription className="text-base text-emerald-900/85">
            Many retirees need a bridge loan, home-equity line, or consolidation — but hate repeating the same forms
            for every lender. We streamline the first step: one secure identity check, then we route your profile to
            vetted partners who can respond with pre-qualified options when you qualify.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-inside list-disc space-y-2 text-base text-emerald-950">
            <li>One button opens our encrypted KYC flow — no multi-site scavenger hunt.</li>
            <li>Upload ID, license, utility, and tax docs once; we map them to lender requirements.</li>
            <li>Full SSN and tax ID are collected in the secure KYC form for lender pre-qualification (store per your compliance program).</li>
            <li>Not a loan guarantee — partners make final credit decisions under their licenses.</li>
          </ul>
          <Button type="button" className="h-12 rounded-full px-8 text-base" onClick={() => setOpen(true)}>
            Start secure loan pre-check
          </Button>
          <p className="text-xs text-emerald-800/80">
            Educational and marketing description only. You are responsible for lawful processing, notices, and
            retention of any personal data you collect.
          </p>
        </CardContent>
      </Card>

      <LoanKycModal
        open={open}
        onOpenChange={setOpen}
        defaultEmail={defaultEmail}
        defaultPhone={defaultPhone}
      />
    </>
  );
}
