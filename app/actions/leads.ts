"use server";

import { requireUserId } from "@/lib/auth/guards";
import { createServiceClient } from "@/lib/supabase/admin";

export async function submitAdvisorLead(input: { name: string; email: string; phone: string; zip?: string }) {
  const userId = await requireUserId();
  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false as const, error: "Database not configured." };
  }

  const { error } = await supabase.from("advisorleads").insert({
    userid: userId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    zip: input.zip ?? null,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const };
}
