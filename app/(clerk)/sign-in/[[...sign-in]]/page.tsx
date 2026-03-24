import { SignIn } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { retireReadyAuthAppearance } from "@/lib/auth/clerk-appearance";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <AuthPageShell
      title="Welcome Back"
      subtitle="Sign in to continue planning your retirement."
    >
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={retireReadyAuthAppearance}
      />
    </AuthPageShell>
  );
}
