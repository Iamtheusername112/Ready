import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserProfile, getProfile } from "@/app/actions/profile";
import { fetchAffiliateOffers } from "@/app/actions/catalog";
import { PartnerRecommendations } from "@/components/recommendations/partner-recommendations";

export default async function RecommendationsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  await ensureUserProfile();
  const profile = await getProfile(userId);
  if (!profile?.onboardingcomplete) {
    redirect("/onboarding");
  }

  const offers = await fetchAffiliateOffers(profile);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PartnerRecommendations offers={offers} profile={profile} />
    </div>
  );
}
