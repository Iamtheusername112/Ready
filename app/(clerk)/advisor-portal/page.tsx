import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdvisorUser } from "@/lib/auth/guards";
import { fetchAdvisorLeads } from "@/app/actions/catalog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AdvisorLeadsClient } from "@/components/advisor/advisor-leads-client";

export default async function AdvisorPortalPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const ok = await isAdvisorUser();
  if (!ok) {
    redirect("/dashboard");
  }

  const leads = await fetchAdvisorLeads();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-emerald-950">Advisor portal</h1>
          <p className="mt-1 text-lg text-emerald-900/85">Leads from RetireReady users who opted in.</p>
        </div>
        <Link
          href="/advisor-portal/billing"
          className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-base font-medium text-emerald-900 hover:bg-emerald-50"
        >
          Billing
        </Link>
      </div>

      <Card className="mt-8 rounded-3xl border-emerald-100">
        <CardHeader>
          <CardTitle>Filter by ZIP</CardTitle>
          <CardDescription>Type the first digits of a ZIP to narrow the list (client-side).</CardDescription>
        </CardHeader>
        <CardContent>
          <AdvisorLeadsClient leads={leads} />
        </CardContent>
      </Card>
    </div>
  );
}
