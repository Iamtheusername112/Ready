"use server";

import { createServiceClient } from "@/lib/supabase/admin";

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

export async function fetchAds(profile: UserProfileRow | null) {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("ads").select("*");
  if (error || !data) return [];
  return data.filter((ad) => matchesTargeting(ad.targetingjson, profile));
}

function matchesTargeting(
  targeting: unknown,
  profile: UserProfileRow | null
): boolean {
  if (!targeting || typeof targeting !== "object" || profile === null) return true;
  const t = targeting as Record<string, unknown>;
  if (typeof t.minAge === "number" && profile.age != null && profile.age < t.minAge) return false;
  if (typeof t.maxAge === "number" && profile.age != null && profile.age > t.maxAge) return false;
  if (typeof t.zipPrefix === "string" && profile.zip && !profile.zip.startsWith(t.zipPrefix)) return false;
  return true;
}

export async function fetchAffiliateOffers() {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase.from("affiliateoffers").select("*").order("category");
  return data ?? [];
}

export async function fetchAdvisorLeads() {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("advisorleads")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
