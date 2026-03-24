"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { saveChatMessage } from "@/app/actions/messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTED_PROMPTS = [
  "When should I start Social Security?",
  "How do I think about risk near retirement?",
  "What’s a simple drawdown order for accounts?",
  "How does RetireReady’s dashboard projection work?",
];

function AssistantBody({ text }: { text: string }) {
  const parts = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-2">
      {parts.map((p, i) => (
        <p key={i} className="whitespace-pre-wrap leading-relaxed last:mb-0">
          {p}
        </p>
      ))}
    </div>
  );
}

export function AiChat({ initialMessages, premium = false }: { initialMessages: Msg[]; premium?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
  }

  function send(prefill?: string) {
    const text = (prefill ?? input).trim();
    if (!text || pending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    scrollToBottom();

    startTransition(async () => {
      const saved = await saveChatMessage("user", text);
      if (!saved.ok) {
        toast.error(saved.error ?? "Could not save your message.");
        setMessages((m) => m.slice(0, -1));
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const err = typeof data.error === "string" ? data.error : "Could not get a reply.";
        toast.error(err);
        return;
      }

      const reply = typeof data.reply === "string" ? data.reply : "";
      if (!reply.trim()) {
        toast.error("Empty reply from assistant. Try again.");
        return;
      }

      const assistantSaved = await saveChatMessage("assistant", reply);
      if (!assistantSaved.ok) {
        toast.error(assistantSaved.error ?? "Reply received but could not save.");
      }

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      scrollToBottom();
    });
  }

  return (
    <Card className="mx-auto flex max-w-2xl flex-col rounded-3xl border-emerald-100 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-emerald-950">Retirement Q&A</CardTitle>
        <p className="text-base text-emerald-900/85">
          {premium
            ? "Premium: answers use your onboarding numbers for relevant examples. Still educational—not tax or legal advice."
            : "Educational guidance. Premium adds plan-aware answers tied to your full profile (savings, contributions, spending)."}
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
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-emerald-900/90">Try one of these, or type your own question:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      disabled={pending}
                      onClick={() => send(p)}
                      className="rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-left text-sm text-emerald-950 transition hover:bg-emerald-100 disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-2xl px-4 py-3 text-base ${
                  msg.role === "user"
                    ? "ml-8 bg-emerald-600 text-white"
                    : "mr-8 bg-emerald-50 text-emerald-950"
                }`}
              >
                {msg.role === "assistant" ? <AssistantBody text={msg.content} /> : msg.content}
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
            onClick={() => send()}
          >
            {pending ? "Thinking…" : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
