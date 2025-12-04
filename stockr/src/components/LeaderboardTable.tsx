"use client";

import { useMemo } from "react";
import { useStockStore } from "@/lib/store";
import { selectLeaderboardBuckets } from "@/lib/store";

export function LeaderboardTable() {
  const state = useStockStore();
  const data = useMemo(() => selectLeaderboardBuckets(state), [state]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <LeaderboardCard title="Trending Favorites" subtitle="Most swipe-rights in the last session">
        {data.trendingList.length ? (
          <ol className="space-y-3">
            {data.trendingList.map((item, idx) => (
              <li key={item.ticker} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <span className="text-slate-400">{idx + 1}.</span>
                <div className="flex-1 px-3">
                  <p className="font-semibold text-white">{item.ticker}</p>
                  <p className="text-xs text-slate-400">Saves: {item.count}</p>
                </div>
                <p className="text-emerald-200">Score {item.score}</p>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState text="Swipe a few cards to unlock ranking data." />
        )}
      </LeaderboardCard>

      <LeaderboardCard title="Avoid List" subtitle="Swipe-left leaders">
        {data.avoidList.length ? (
          <ol className="space-y-3">
            {data.avoidList.map((item, idx) => (
              <li key={item.ticker} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <span className="text-slate-400">{idx + 1}.</span>
                <div className="flex-1 px-3">
                  <p className="font-semibold text-white">{item.ticker}</p>
                  <p className="text-xs text-slate-400">Passes: {item.count}</p>
                </div>
                <p className="text-rose-200">Score {item.score}</p>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState text="Left swipes will populate risk radar." />
        )}
      </LeaderboardCard>

      <LeaderboardCard title="Top StockScore™" subtitle="Highest composite ratings">
        <ol className="space-y-3">
          {data.topScores.map((item, idx) => (
            <li key={item.ticker} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{idx + 1}.</span>
                <div>
                  <p className="font-semibold text-white">{item.ticker}</p>
                  <p className="text-xs text-slate-400">{item.name}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-emerald-200">{item.score}</p>
            </li>
          ))}
        </ol>
      </LeaderboardCard>

      <LeaderboardCard title="Sector Dominators" subtitle="Best score by sector">
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(data.bySector).map(([sector, entry]) => (
            <div key={sector} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-slate-400">{sector}</p>
              <p className="text-lg font-semibold text-white">{entry.ticker}</p>
              <p className="text-sm text-emerald-200">Score {entry.score}</p>
            </div>
          ))}
        </div>
      </LeaderboardCard>
    </div>
  );
}

const LeaderboardCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <section className="rounded-3xl border border-white/10 bg-card-dark/80 p-5 shadow-glass">
    <header className="mb-4">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{title}</p>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </header>
    {children}
  </section>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-500">{text}</div>
);
