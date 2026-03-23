import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserProfile, getProfile } from "@/app/actions/profile";
import { getSubscription } from "@/app/actions/subscription";
import { fetchAds, type UserProfileRow } from "@/app/actions/catalog";
import { getBudget } from "@/app/actions/budget";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  await ensureUserProfile();
  const profile = await getProfile(userId);
  if (!profile?.onboardingcomplete) {
    redirect("/onboarding");
  }

  const sub = await getSubscription(userId);
  const premium = sub?.status === "active";

  const p = profile as UserProfileRow;
  const ads = await fetchAds(p);
  const adsSidebar = ads.slice(0, 1) as { id: string; title: string; description: string | null; image: string | null; url: string }[];
  const adsInline = ads.slice(1, 2).length ? ads.slice(1, 2) : ads.slice(0, 1);
  const adsFooter = ads.slice(2, 3).length ? ads.slice(2, 3) : ads.slice(0, 1);

  const budgetRows = (await getBudget(userId)).map((r) => ({
    category: r.category,
    amount: Number(r.amount),
  }));

  return (
    <DashboardView
      profile={{
        age: p.age ?? 60,
        retirementage: p.retirementage ?? 67,
        savings: Number(p.savings ?? 0),
        monthlycontrib: Number(p.monthlycontrib ?? 0),
        monthlyexpenses: Number(p.monthlyexpenses ?? 0),
        ssstartage: p.ssstartage ?? 67,
        risktolerance: p.risktolerance ?? "moderate",
      }}
      premium={premium}
      adsSidebar={adsSidebar}
      adsInline={adsInline as typeof adsSidebar}
      adsFooter={adsFooter as typeof adsSidebar}
      budgetRows={budgetRows}
    />
  );
}
