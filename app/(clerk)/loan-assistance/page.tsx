import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserProfile, getProfile } from "@/app/actions/profile";
import { LoanAssistanceSection } from "@/components/loans/loan-assistance-section";

export default async function LoanAssistancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await ensureUserProfile();
  const profile = await getProfile(userId);
  if (!profile?.onboardingcomplete) redirect("/onboarding");

  const user = await currentUser();
  const defaultEmail = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const defaultPhone = user?.phoneNumbers?.[0]?.phoneNumber ?? "";

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-950">Loan assistance</h1>
        <p className="mt-2 text-lg text-emerald-900/85">
          A calmer path to borrowing — start with identity verification below.
        </p>
      </div>

      <LoanAssistanceSection defaultEmail={defaultEmail} defaultPhone={defaultPhone} />
    </div>
  );
}
