"use server";

import { createServiceClient } from "@/lib/supabase/admin";

export async function getSubscription(userId: string) {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data } = await supabase.from("usersubscription").select("*").eq("userid", userId).maybeSingle();
  return data;
}
