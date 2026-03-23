"use server";

import { requireUserId } from "@/lib/auth/guards";
import { createServiceClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveChatMessage(role: "user" | "assistant", content: string) {
  const userId = await requireUserId();
  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false as const, error: "Database not configured." };
  }

  const { error } = await supabase.from("messages").insert({
    userid: userId,
    role,
    content,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/ai-assistant");
  return { ok: true as const };
}

export async function listMessages(userId: string) {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("userid", userId)
    .order("created_at", { ascending: true });
  return data ?? [];
}
