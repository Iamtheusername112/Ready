import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function getOptionalUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

export async function isAdvisorUser(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  const allowList = process.env.ADVISOR_USER_IDS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  if (allowList.includes(user.id)) return true;
  const role = user.publicMetadata?.role as string | undefined;
  return role === "advisor";
}
