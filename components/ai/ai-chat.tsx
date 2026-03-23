"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { saveChatMessage } from "@/app/actions/messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; content: string };

export function AiChat({ initialMessages, premium = false }: { initialMessages: Msg[]; premium?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    startTransition(async () => {
      await saveChatMessage("user", text);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = typeof data.reply === "string" ? data.reply : "Sorry, something went wrong. Try again.";
      await saveChatMessage("assistant", reply);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }

  return (
    <Card className="mx-auto flex max-w-2xl flex-col rounded-3xl border-emerald-100 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-emerald-950">Retirement Q&A</CardTitle>
        <p className="text-base text-emerald-900/85">
          {premium
            ? "Premium: answers can reference your onboarding numbers for relevant examples. Still educational—not tax or legal advice."
            : "Educational guidance. Upgrade to Premium for plan-aware answers that use your profile context."}
        </p>
        {!premium ? (
          <p className="text-sm text-emerald-800">
            <Link href="/upgrade" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
              View Premium plans
            </Link>
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ScrollArea className="h-[min(60vh,420px)] rounded-2xl border border-emerald-100 bg-white/80 p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-2xl px-4 py-3 text-base leading-relaxed ${
                  msg.role === "user"
                    ? "ml-8 bg-emerald-600 text-white"
                    : "mr-8 bg-emerald-50 text-emerald-950"
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. When should I start Social Security?"
            className="min-h-[100px] resize-none text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button
            type="button"
            className="h-12 shrink-0 self-end rounded-full px-8 text-base"
            disabled={pending}
            onClick={send}
          >
            {pending ? "Thinking…" : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
