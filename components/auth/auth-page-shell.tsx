import type { ReactNode } from "react";
import { RetireReadyAuthLogo } from "@/components/auth/retire-ready-auth-logo";

/**
 * Cream page + white card shell. Clerk `<SignIn />` / `<SignUp />` render inside — we supply headings to match your mock.
 */
export function AuthPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#f5f0e9] px-4 py-12">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/[0.06] sm:p-10">
          <div className="flex flex-col items-stretch">
            <div className="flex justify-center">
              <RetireReadyAuthLogo />
            </div>
            <h1 className="mt-8 text-center text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">{subtitle}</p>
            <div className="mt-8 w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
