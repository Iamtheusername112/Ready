import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdvisorUser } from "@/lib/auth/guards";
import Link from "next/link";

export default async function AdvisorBillingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const ok = await isAdvisorUser();
  if (!ok) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/advisor-portal" className="text-base font-medium text-emerald-700 hover:underline">
        ← Back to leads
      </Link>
      <h1 className="mt-6 text-3xl font-semibold text-emerald-950">Billing</h1>
      <p className="mt-2 text-lg text-emerald-900/85">
        Manual billing placeholder. Connect Stripe Connect or invoicing here for your advisory practice.
      </p>
      <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-white/80 p-8 text-center text-emerald-800/90">
        No charges configured — contact RetireReady admin to enable advisor payouts.
      </div>
    </div>
  );
}
