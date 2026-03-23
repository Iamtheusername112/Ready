import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getProfile } from "@/app/actions/profile";
import { isPremiumUser } from "@/lib/auth/premium";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message : "";
  if (!message.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const premium = await isPremiumUser(userId);
  const profile = premium ? await getProfile(userId) : null;

  let system =
    "You are a friendly, plain-language retirement planning assistant for RetireReady. " +
    "Keep answers concise, reassuring, and free of jargon. Never promise returns or give personalized tax/legal advice; suggest consulting professionals when needed.";

  if (profile && premium) {
    const sav = Number(profile.savings ?? 0);
    const mc = Number(profile.monthlycontrib ?? 0);
    const ex = Number(profile.monthlyexpenses ?? 0);
    system +=
      " The subscriber has shared the following onboarding snapshot (user-entered; not verified): " +
      `age ${profile.age ?? "unknown"}, target retirement age ${profile.retirementage ?? "unknown"}, ` +
      `approx. savings $${sav.toLocaleString()}, monthly contribution $${mc.toLocaleString()}, monthly spending $${ex.toLocaleString()}, ` +
      `intended Social Security start age ${profile.ssstartage ?? "unknown"}, risk tolerance ${profile.risktolerance ?? "unknown"}. ` +
      "Use this only to make examples feel relevant; do not treat it as audited data. Remind them to verify with a professional.";
  } else if (!premium) {
    system +=
      " This user is on the free plan. Keep answers general. If they need answers tailored to their exact numbers, mention that RetireReady Premium includes plan-aware guidance.";
  }

  const openai = new OpenAI({ apiKey: key });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: system,
      },
      { role: "user", content: message },
    ],
    max_tokens: premium ? 900 : 450,
  });

  const text = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ reply: text });
}
