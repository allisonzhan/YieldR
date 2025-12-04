"use client";

import { StockCardData } from "@/types";
import { computeScore } from "@/lib/stockScore";
import { ScoreBadge } from "@/components/ScoreBadge";
import clsx from "clsx";

interface Props {
  stock: StockCardData;
}

export function StockCard({ stock }: Props) {
  const score = computeScore(stock);

  return (
    <section className="relative flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-6 shadow-glass">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.4em] text-slate-500">{stock.sector}</div>
          <div className="text-4xl font-semibold text-white">{stock.ticker}</div>
          <p className="text-lg text-slate-400">{stock.name}</p>
        </div>
        <ScoreBadge score={score} />
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
          <p className="text-sm uppercase tracking-widest text-slate-400">Price</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-semibold text-white">${stock.price.toFixed(2)}</span>
            <span
              className={clsx(
                "text-sm font-medium",
                stock.dailyChange >= 0 ? "text-emerald-300" : "text-rose-300"
              )}
            >
              {stock.dailyChange >= 0 ? "▲" : "▼"} {Math.abs(stock.dailyChange).toFixed(2)}%
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400">Market cap {stock.marketCap}</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
          <p className="text-sm uppercase tracking-widest text-slate-400">Next earnings</p>
          <p className="text-2xl font-semibold text-white">{stock.earningsDate}</p>
          <p className="mt-2 text-sm text-slate-400">Sentiment: {stock.sentiment}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-slate-400">Highlights</p>
        <p className="text-base text-slate-200">{stock.description}</p>
        <div className="flex flex-wrap gap-2">
          {stock.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm uppercase tracking-widest text-slate-400">Key metrics</p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-3">
          <Metric label="P/E" value={stock.fundamentals.pe.toFixed(1)} />
          <Metric label="EPS" value={stock.fundamentals.eps.toFixed(2)} />
          <Metric label="Beta" value={stock.fundamentals.beta.toFixed(2)} />
          <Metric label="Revenue YoY" value={`${stock.fundamentals.revenueYoY}%`} />
          <Metric label="ROE" value={`${stock.fundamentals.roe ?? "–"}%`} />
          <Metric label="Margin" value={`${stock.fundamentals.margin ?? "–"}%`} />
        </dl>
      </div>

      <div>
        <p className="text-sm uppercase tracking-widest text-slate-400">Recent news</p>
        <div className="mt-3 space-y-2">
          {stock.news.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/5 bg-white/5 p-3">
              <p className="text-xs text-slate-500">{item.source}</p>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-sm text-slate-300">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const Metric = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
    <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
    <p className="text-lg font-semibold text-white">{value}</p>
  </div>
);
