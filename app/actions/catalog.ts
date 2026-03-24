"use server";

import { createServiceClient } from "@/lib/supabase/admin";
import {
  isNonEmptyTargeting,
  matchesTargeting,
  type AffiliateOfferRow,
  type UserProfileRow,
} from "@/lib/catalog/targeting";

export async function fetchAds(profile: UserProfileRow | null) {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("ads").select("*");
  if (error || !data) return [];
  return data.filter((ad) => matchesTargeting(ad.targetingjson, profile));
}

export async function fetchAffiliateOffers(profile: UserProfileRow | null): Promise<AffiliateOfferRow[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("affiliateoffers").select("*").order("category");
  if (error || !data) return [];

  const rows = data as AffiliateOfferRow[];
  const filtered = rows.filter((row) => matchesTargeting(row.targetingjson ?? {}, profile));

  return filtered.sort((a, b) => {
    const aPersonalized = isNonEmptyTargeting(a.targetingjson);
    const bPersonalized = isNonEmptyTargeting(b.targetingjson);
    if (aPersonalized !== bPersonalized) return aPersonalized ? -1 : 1;
    const cat = (a.category ?? "").localeCompare(b.category ?? "");
    if (cat !== 0) return cat;
    return (a.name ?? "").localeCompare(b.name ?? "");
  });
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
