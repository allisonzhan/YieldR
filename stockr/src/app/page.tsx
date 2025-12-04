import { SwipeDeck } from "@/components/SwipeDeck";
import { stockDeck } from "@/data/stocks";
import { computeScore } from "@/lib/stockScore";

export default function HomePage() {
  const avgScore = Math.round(stockDeck.reduce((acc, stock) => acc + computeScore(stock), 0) / stockDeck.length);
  const growthNames = stockDeck.filter((stock) => stock.tags.includes("Growth")).length;

  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Deck Ready" value={`${stockDeck.length} cards`} detail="Prefetched + cached" />
        <StatusCard label="Avg. StockScore" value={`${avgScore}/100`} detail="Updated hourly" />
        <StatusCard label="Growth Ideas" value={`${growthNames}`} detail="Tagged AI + Tech" />
      </div>

      <SwipeDeck />
    </div>
  );
}

const StatusCard = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div className="rounded-3xl border border-white/10 bg-card-dark/80 p-4">
    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{label}</p>
    <p className="text-3xl font-semibold text-white">{value}</p>
    <p className="text-sm text-slate-400">{detail}</p>
  </div>
);
