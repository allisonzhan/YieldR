import { InboxList } from "@/components/InboxList";
import { ChatPanel } from "@/components/ChatPanel";

export default function InboxPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <section className="rounded-3xl border border-white/10 bg-card-dark/80 p-5">
        <header className="mb-4">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Inbox</p>
          <p className="text-sm text-slate-400">Each save unlocks a dedicated AI chat.</p>
        </header>
        <InboxList />
      </section>
      <ChatPanel />
    </div>
  );
}
