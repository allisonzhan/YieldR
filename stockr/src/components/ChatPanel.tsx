"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useStockStore } from "@/lib/store";
import clsx from "clsx";

export function ChatPanel() {
  const activeTicker = useStockStore((state) => state.activeInboxTicker);
  const chatThreads = useStockStore((state) => state.chatThreads);
  const sendMessage = useStockStore((state) => state.sendMessage);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = useMemo(() => (activeTicker ? chatThreads[activeTicker] ?? [] : []), [activeTicker, chatThreads]);

  if (!activeTicker) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 p-6 text-sm text-slate-400">
        Select a stock to start chatting with its AI analyst.
      </div>
    );
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    sendMessage(activeTicker, draft.trim());
    setDraft("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-950/70">
      <header className="border-b border-white/5 px-6 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Stock chat</p>
        <p className="text-xl font-semibold text-white">{activeTicker} Copilot</p>
      </header>

      <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              message.sender === "ai"
                ? "bg-white/5 text-slate-200"
                : "ml-auto bg-emerald-500/20 text-emerald-100"
            )}
          >
            {message.text}
            <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/5 px-6 py-4">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask for bullish/bearish cases, valuations, or news summaries..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          rows={2}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-teal-400 to-emerald-300 px-5 py-2 text-sm font-semibold text-slate-900"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
