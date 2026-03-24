/**
 * Builds OpenAI chat `messages` with a system prompt + DB history + current user text.
 * If history is empty or missing the latest user turn (e.g. Supabase not returning rows), appends `currentUserText`
 * so the API always receives at least one user message after the system prompt.
 */
export function buildChatCompletionMessages(opts: {
  system: string;
  history: { role: "user" | "assistant"; content: string }[];
  currentUserText: string;
}): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const trimmed = opts.currentUserText.trim();
  const convo = opts.history
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content.trim() }));

  const last = convo[convo.length - 1];
  const lastMatchesCurrent = last?.role === "user" && last.content === trimmed;

  const afterSystem = lastMatchesCurrent
    ? convo.map((m) => ({ role: m.role, content: m.content }))
    : [...convo.map((m) => ({ role: m.role, content: m.content })), { role: "user" as const, content: trimmed }];

  return [{ role: "system", content: opts.system }, ...afterSystem];
}
