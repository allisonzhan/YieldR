import { LeaderboardTable } from "@/components/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-card-dark/80 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Modes</p>
        <p className="text-sm text-slate-400">
          Swipe telemetry powers trending picks, avoid lists, and sector champions. Scores refresh daily after the scoring batch job.
        </p>
      </section>
      <LeaderboardTable />
    </div>
  );
}
