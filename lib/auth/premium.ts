import { getSubscription } from "@/app/actions/subscription";

export async function isPremiumUser(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  return sub?.status === "active";
}
