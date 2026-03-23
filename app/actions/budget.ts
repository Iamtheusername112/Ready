"use server";

import { requireUserId } from "@/lib/auth/guards";
import { createServiceClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveBudgetCategories(rows: { category: string; amount: number }[]) {
  const userId = await requireUserId();
  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false as const, error: "Database not configured." };
  }

  await supabase.from("user_budget").delete().eq("userid", userId);

  if (rows.length === 0) {
    revalidatePath("/dashboard");
    return { ok: true as const };
  }

  const { error } = await supabase.from("user_budget").insert(
    rows.map((r) => ({
      userid: userId,
      category: r.category,
      amount: r.amount,
    }))
  );

  if (error) {
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function getBudget(userId: string) {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase.from("user_budget").select("*").eq("userid", userId);
  return data ?? [];
}
