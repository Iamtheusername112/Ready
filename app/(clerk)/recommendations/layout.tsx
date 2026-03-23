import { AuthenticatedShell } from "@/components/app/AuthenticatedShell";

export const dynamic = "force-dynamic";

export default function RecommendationsLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
