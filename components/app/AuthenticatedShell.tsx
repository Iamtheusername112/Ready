import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubscription } from "@/app/actions/subscription";
import { AppHeader } from "@/components/app/AppHeader";

export async function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const sub = await getSubscription(userId);
  const premium = sub?.status === "active";

  return (
    <div className="min-h-screen bg-emerald-50/40">
      <AppHeader premium={premium} />
      {children}
    </div>
  );
}
