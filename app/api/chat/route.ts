import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getProfile } from "@/app/actions/profile";
import { listRecentChatMessages } from "@/app/actions/messages";
import { buildRetireReadySystemPrompt } from "@/lib/ai/retire-ready-system";
import { buildChatCompletionMessages } from "@/lib/chat/openai-messages";
import { isPremiumUser } from "@/lib/auth/premium";

const MAX_USER_MESSAGE_CHARS = 12_000;

export async function POST(req: Request) {
  try {
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
    const trimmed = message.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }
    if (trimmed.length > MAX_USER_MESSAGE_CHARS) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const premium = await isPremiumUser(userId);
    const profile = await getProfile(userId);
    const system = buildRetireReadySystemPrompt({ premium, profile });

    const history = await listRecentChatMessages(userId, 40);
    const openaiMessages = buildChatCompletionMessages({
      system,
      history,
      currentUserText: trimmed,
    });

    const openai = new OpenAI({ apiKey: key });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: premium ? 1200 : 600,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("[api/chat]", err);
    const message = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Chat temporarily unavailable." },
      { status: 500 }
    );
  }
}
