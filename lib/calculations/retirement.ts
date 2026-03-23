/**
 * Educational retirement projections — not financial advice.
 */

export type MoneyLastsInput = {
  age: number;
  retirementAge: number;
  savings: number;
  monthlyContrib: number;
  monthlySpending: number;
  annualReturnPct: number;
  inflationPct: number;
  ssMonthly: number;
};

export type MoneyLastsResult = {
  yearsFundsLast: number;
  depletionAge: number | null;
  survivalProbabilityPct: number;
  chart: { year: number; balance: number }[];
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Month-by-month projection; chart samples once per calendar year. */
export function projectMoneyLasts(input: MoneyLastsInput): MoneyLastsResult {
  const {
    age,
    retirementAge,
    savings,
    monthlyContrib,
    monthlySpending,
    annualReturnPct,
    inflationPct,
    ssMonthly,
  } = input;

  const r = annualReturnPct / 100 / 12;
  const inflAnnual = inflationPct / 100;
  let balance = Math.max(0, savings);
  const chart: { year: number; balance: number }[] = [];
  let depletionAge: number | null = null;

  const maxMonth = (100 - age) * 12;
  let lastSampledYear = age - 1;

  for (let m = 0; m < maxMonth; m++) {
    const currentAge = age + Math.floor(m / 12);
    if (currentAge > lastSampledYear) {
      chart.push({ year: currentAge, balance: Math.round(balance) });
      lastSampledYear = currentAge;
    }

    if (currentAge < retirementAge) {
      balance = balance * (1 + r) + monthlyContrib;
    } else {
      const yearsRetired = currentAge - retirementAge + (m % 12) / 12;
      const spend = monthlySpending * Math.pow(1 + inflAnnual, yearsRetired);
      const net = Math.max(0, spend - ssMonthly);
      balance = balance * (1 + r) - net;
    }

    if (balance <= 0) {
      balance = 0;
      depletionAge = currentAge;
      chart.push({ year: currentAge, balance: 0 });
      break;
    }
  }

  if (chart.length === 0) {
    chart.push({ year: age, balance: Math.round(balance) });
  }

  const finalAge = depletionAge ?? chart[chart.length - 1]!.year;
  const yearsFundsLast =
    depletionAge !== null
      ? Math.max(0, depletionAge - retirementAge)
      : Math.max(0, finalAge - retirementAge + 1);

  const horizon = Math.max(1, 100 - retirementAge);
  const survivalProbabilityPct = clamp(
    Math.round((yearsFundsLast / horizon) * 70 + 20),
    5,
    95
  );

  return {
    yearsFundsLast,
    depletionAge,
    survivalProbabilityPct,
    chart,
  };
}

export function compareSocialSecurityOptions(fullMonthlyBenefitAt67: number): {
  rows: { age: 62 | 67 | 70; monthly: number; lifetimeTo90: number }[];
} {
  const factors: Record<62 | 67 | 70, number> = { 62: 0.7, 67: 1, 70: 1.24 };
  const rows = ([62, 67, 70] as const).map((a) => {
    const monthly = Math.round(fullMonthlyBenefitAt67 * factors[a]);
    const yearsReceiving = Math.max(0, 90 - a);
    const lifetimeTo90 = monthly * 12 * yearsReceiving;
    return { age: a, monthly, lifetimeTo90 };
  });
  return { rows };
}

export function projectSavingsGrowth(input: {
  age: number;
  retirementAge: number;
  savings: number;
  monthlyContrib: number;
  annualReturnPct: number;
}): { year: number; balance: number }[] {
  const r = input.annualReturnPct / 100 / 12;
  let balance = Math.max(0, input.savings);
  const out: { year: number; balance: number }[] = [];
  for (let a = input.age; a <= input.retirementAge; a++) {
    out.push({ year: a, balance: Math.round(balance) });
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + input.monthlyContrib;
    }
  }
  return out;
}
