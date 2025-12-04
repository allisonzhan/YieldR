import { describeScore } from "@/lib/stockScore";

export function ScoreBadge({ score }: { score: number }) {
  const label = describeScore(score);
  const palette =
    score >= 80 ? "from-emerald-400 to-lime-300" : score >= 60 ? "from-sky-400 to-cyan-300" : "from-orange-400 to-yellow-300";

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card-dark/70 px-4 py-3 shadow-glass">
      <div className={`rounded-full bg-gradient-to-br ${palette} px-3 py-1 text-sm font-semibold text-slate-900`}>{score}</div>
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">StockScore™</p>
        <p className="text-sm font-semibold text-slate-100">{label}</p>
      </div>
    </div>
  );
}
