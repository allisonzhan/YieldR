"use client";

import { useMemo } from "react";
import { useStockStore } from "@/lib/store";
import { computeScore } from "@/lib/stockScore";
import clsx from "clsx";

export function InboxList() {
  const inbox = useStockStore((state) => state.inbox);
  const activeTicker = useStockStore((state) => state.activeInboxTicker);
  const setActive = useStockStore((state) => state.setActiveInboxTicker);

  const entries = useMemo(() => Object.values(inbox), [inbox]);

  if (!entries.length) {
    return <p className="text-sm text-slate-400">Swipe right on a stock to populate your inbox.</p>;
  }

  return (
    <ul className="space-y-3">
      {entries.map((stock) => {
        const score = computeScore(stock);
        return (
          <li
            key={stock.ticker}
            className={clsx(
              "cursor-pointer rounded-2xl border px-4 py-3 transition",
              activeTicker === stock.ticker
                ? "border-emerald-400/60 bg-emerald-400/5"
                : "border-white/5 bg-white/5 hover:border-white/20"
            )}
            onClick={() => setActive(stock.ticker)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stock.name}</p>
                <p className="text-lg font-semibold text-white">{stock.ticker}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Score</p>
                <p className="text-base font-semibold text-emerald-300">{score}</p>
              </div>
            </div>
            <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">{stock.tags.join(" · ")}</p>
          </li>
        );
      })}
    </ul>
  );
}
