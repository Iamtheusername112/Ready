import { SignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { retireReadyAuthAppearance } from "@/lib/auth/clerk-appearance";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <AuthPageShell
      title="Create Your Account"
      subtitle="Start building your retirement plan today."
    >
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        appearance={retireReadyAuthAppearance}
      />
    </AuthPageShell>
  );
}
