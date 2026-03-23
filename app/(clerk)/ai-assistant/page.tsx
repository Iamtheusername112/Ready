import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserProfile, getProfile } from "@/app/actions/profile";
import { listMessages } from "@/app/actions/messages";
import { AiChat } from "@/components/ai/ai-chat";

export default async function AiAssistantPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  await ensureUserProfile();
  const profile = await getProfile(userId);
  if (!profile?.onboardingcomplete) {
    redirect("/onboarding");
  }

  const rows = await listMessages(userId);
  const initialMessages = rows.map((r) => ({
    role: r.role as "user" | "assistant",
    content: r.content,
  }));

  return (
    <div className="px-4 py-10">
      <AiChat initialMessages={initialMessages} />
    </div>
  );
}
