import { SignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-emerald-50/50 px-4 py-10">
      <p className="mb-6 max-w-md text-center text-xl font-medium text-emerald-950">
        Create your free RetireReady account
      </p>
      <SignUp />
    </div>
  );
}
