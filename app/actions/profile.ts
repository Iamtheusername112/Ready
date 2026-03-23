"use server";

import { requireUserId } from "@/lib/auth/guards";
import { createServiceClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type OnboardingPayload = {
  age: number;
  retirementage: number;
  savings: number;
  monthlycontrib: number;
  monthlyexpenses: number;
  ssstartage: number;
  risktolerance: "conservative" | "moderate" | "aggressive";
  zip?: string;
};

function friendlyDbError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("schema cache") ||
    m.includes("could not find the table") ||
    m.includes("relation") && m.includes("does not exist")
  ) {
    return (
      "Supabase can’t see the `userprofile` table. Open the same project as in `.env.local` → SQL Editor → run the full `supabase/schema.sql` file. " +
      "Then check Table Editor for a table named `userprofile`. If it still fails, wait a minute (API cache) or restart `npm run dev` after saving env."
    );
  }
  return message;
}

export async function upsertProfile(data: OnboardingPayload) {
  const userId = await requireUserId();
  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false as const, error: "Database not configured." };
  }

  const { error } = await supabase.from("userprofile").upsert(
    {
      id: userId,
      age: data.age,
      retirementage: data.retirementage,
      savings: data.savings,
      monthlycontrib: data.monthlycontrib,
      monthlyexpenses: data.monthlyexpenses,
      ssstartage: data.ssstartage,
      risktolerance: data.risktolerance,
      zip: data.zip ?? null,
      onboardingcomplete: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return { ok: false as const, error: friendlyDbError(error.message) };
  }
  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return { ok: true as const };
}

export async function getProfile(userId: string) {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data } = await supabase.from("userprofile").select("*").eq("id", userId).maybeSingle();
  return data;
}

/**
 * Ensures a `userprofile` row exists. Only sends `id` + `updated_at` so we never overwrite
 * `onboardingcomplete` (or other quiz fields) on dashboard load.
 */
export async function ensureUserProfile() {
  const userId = await requireUserId();
  const supabase = createServiceClient();
  if (!supabase) return;

  await supabase.from("userprofile").upsert(
    {
      id: userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
}
