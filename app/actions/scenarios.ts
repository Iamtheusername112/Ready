"use server";

import { requireUserId } from "@/lib/auth/guards";
import { isPremiumUser } from "@/lib/auth/premium";
import { createServiceClient } from "@/lib/supabase/admin";
import { scenarioPayloadSchema, type ScenarioPayload, type SavedScenarioRow } from "@/lib/types/scenario";
import { revalidatePath } from "next/cache";

export async function listSavedScenarios(): Promise<SavedScenarioRow[]> {
  const userId = await requireUserId();
  if (!(await isPremiumUser(userId))) return [];

  const supabase = createServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("saved_scenarios")
    .select("id, name, payload, created_at")
    .eq("userid", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data
    .map((row) => {
      const parsed = scenarioPayloadSchema.safeParse(row.payload as unknown);
      if (!parsed.success) return null;
      return {
        id: row.id,
        name: row.name,
        payload: parsed.data,
        created_at: row.created_at,
      };
    })
    .filter((x): x is SavedScenarioRow => x !== null);
}

export async function saveScenario(name: string, payload: ScenarioPayload) {
  const userId = await requireUserId();
  if (!(await isPremiumUser(userId))) {
    return { ok: false as const, error: "Premium subscription required." };
  }

  const parsed = scenarioPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid scenario data." };
  }

  const label = name.trim().slice(0, 80);
  if (!label) {
    return { ok: false as const, error: "Enter a name for this scenario." };
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false as const, error: "Database not configured." };
  }

  const { error } = await supabase.from("saved_scenarios").insert({
    userid: userId,
    name: label,
    payload: parsed.data,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function deleteScenario(id: string) {
  const userId = await requireUserId();
  if (!(await isPremiumUser(userId))) {
    return { ok: false as const, error: "Premium subscription required." };
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false as const, error: "Database not configured." };
  }

  const { error } = await supabase.from("saved_scenarios").delete().eq("id", id).eq("userid", userId);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true as const };
}
