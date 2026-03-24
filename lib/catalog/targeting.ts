export type UserProfileRow = {
  id: string;
  age: number | null;
  retirementage: number | null;
  savings: number | null;
  monthlycontrib: number | null;
  monthlyexpenses: number | null;
  ssstartage: number | null;
  risktolerance: string | null;
  zip: string | null;
  onboardingcomplete: boolean | null;
};

export type AffiliateOfferRow = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  link: string;
  category: string;
  payout_tier: string | null;
  targetingjson?: unknown;
};

/** Returns true when targeting rules pass (or there are no rules). Used for ads and partner offers. */
export function matchesTargeting(targeting: unknown, profile: UserProfileRow | null): boolean {
  if (!targeting || typeof targeting !== "object") return true;
  if (profile === null) return true;
  const t = targeting as Record<string, unknown>;
  if (Object.keys(t).length === 0) return true;

  if (typeof t.minAge === "number" && profile.age != null && profile.age < t.minAge) return false;
  if (typeof t.maxAge === "number" && profile.age != null && profile.age > t.maxAge) return false;
  if (typeof t.zipPrefix === "string" && profile.zip && !profile.zip.startsWith(t.zipPrefix)) return false;
  if (
    typeof t.riskTolerance === "string" &&
    profile.risktolerance &&
    profile.risktolerance !== t.riskTolerance
  ) {
    return false;
  }

  if (profile.age != null && profile.retirementage != null) {
    const yearsToRetirement = profile.retirementage - profile.age;
    if (typeof t.minYearsToRetirement === "number" && yearsToRetirement < t.minYearsToRetirement) {
      return false;
    }
    if (typeof t.maxYearsToRetirement === "number" && yearsToRetirement > t.maxYearsToRetirement) {
      return false;
    }
  }

  return true;
}

export function isNonEmptyTargeting(targeting: unknown): boolean {
  if (!targeting || typeof targeting !== "object") return false;
  return Object.keys(targeting as Record<string, unknown>).length > 0;
}
