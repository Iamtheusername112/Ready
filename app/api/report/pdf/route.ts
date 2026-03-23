import { auth } from "@clerk/nextjs/server";
import { jsPDF } from "jspdf";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProfile } from "@/app/actions/profile";
import { isPremiumUser } from "@/lib/auth/premium";
import {
  compareSocialSecurityOptions,
  projectMoneyLasts,
  projectSavingsGrowth,
} from "@/lib/calculations/retirement";

export const runtime = "nodejs";

const querySchema = z.object({
  annualReturn: z.coerce.number().min(2).max(12),
  inflation: z.coerce.number().min(1).max(5),
  ssMonthly: z.coerce.number().min(0).max(20000),
});

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isPremiumUser(userId))) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const profile = await getProfile(userId);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  const { annualReturn, inflation, ssMonthly } = parsed.data;
  const age = profile.age ?? 60;
  const retirementAge = profile.retirementage ?? 67;
  const savings = Number(profile.savings ?? 0);
  const monthlyContrib = Number(profile.monthlycontrib ?? 0);
  const monthlySpending = Number(profile.monthlyexpenses ?? 0);

  const result = projectMoneyLasts({
    age,
    retirementAge,
    savings,
    monthlyContrib,
    monthlySpending,
    annualReturnPct: annualReturn,
    inflationPct: inflation,
    ssMonthly,
  });

  const savingsCurve = projectSavingsGrowth({
    age,
    retirementAge,
    savings,
    monthlyContrib,
    annualReturnPct: annualReturn,
  });
  const endBalance = savingsCurve[savingsCurve.length - 1]?.balance ?? 0;
  const ss = compareSocialSecurityOptions(ssMonthly);

  const doc = new jsPDF();
  let y = 20;
  const add = (text: string, size = 11) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, y);
    y += lines.length * (size > 12 ? 6 : 5) + 2;
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
  };

  add("RetireReady — Personal plan snapshot", 16);
  add(`Generated ${new Date().toLocaleString()}`, 9);
  add(
    "Disclaimer: For education and illustration only. Not financial, investment, tax, or legal advice. Consult a qualified professional before making decisions.",
    9
  );

  add("Your profile (from onboarding)", 12);
  add(
    `Age ${age}, target retirement ${retirementAge}, risk: ${profile.risktolerance ?? "—"}. Savings $${savings.toLocaleString()}, monthly save $${monthlyContrib.toLocaleString()}, monthly spending $${monthlySpending.toLocaleString()}. SS claim age (onboarding): ${profile.ssstartage ?? "—"}.`
  );

  add("Assumptions in this report", 12);
  add(`Return ${annualReturn}%, inflation ${inflation}%, estimated SS $${ssMonthly.toLocaleString()}/mo.`);

  add("Will my money last? (illustrative)", 12);
  add(
    result.depletionAge
      ? `Funds may run low around age ${result.depletionAge}. Illustrative confidence: ${result.survivalProbabilityPct}%.`
      : `Under these assumptions, funds may last past age ${retirementAge + Math.max(5, result.yearsFundsLast)}. Illustrative confidence: ${result.survivalProbabilityPct}%.`
  );

  add("Projected balance at retirement (illustrative)", 12);
  add(`Rough balance at age ${retirementAge}: $${endBalance.toLocaleString()}.`);

  add("Social Security start-age comparison (illustrative, not from SSA)", 12);
  for (const r of ss.rows) {
    add(`Start ${r.age}: ~$${r.monthly.toLocaleString()}/mo; lifetime to 90 ~$${r.lifetimeTo90.toLocaleString()}.`);
  }

  const buf = doc.output("arraybuffer");
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="retireready-plan-snapshot.pdf"',
    },
  });
}
