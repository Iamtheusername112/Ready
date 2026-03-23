import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

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

  const openai = new OpenAI({ apiKey: key });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a friendly, plain-language retirement planning assistant for RetireReady. " +
          "Keep answers concise, reassuring, and free of jargon. Never promise returns or give personalized tax/legal advice; suggest consulting professionals when needed.",
      },
      { role: "user", content: message },
    ],
    max_tokens: 600,
  });

  const text = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ reply: text });
}
