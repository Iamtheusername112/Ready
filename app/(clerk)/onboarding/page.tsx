import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserProfile, getProfile } from "@/app/actions/profile";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  await ensureUserProfile();
  const profile = await getProfile(userId);
  if (profile?.onboardingcomplete) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-emerald-50/40">
      <header className="border-b border-emerald-200/60 bg-emerald-50/90 px-4 py-4 text-center">
        <p className="text-lg font-medium text-emerald-950">Let&apos;s personalize your plan</p>
        <p className="text-base text-emerald-900/80">A few quick questions — no math degree required.</p>
      </header>
      <OnboardingWizard />
    </div>
  );
}
