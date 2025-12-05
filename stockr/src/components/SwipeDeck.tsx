"use client";

import { useMemo } from "react";
import { useSwipeable } from "react-swipeable";
import { StockCard } from "@/components/StockCard";
import { SwipeActions } from "@/components/SwipeActions";
import { useStockStore } from "@/lib/store";
import { computeScore } from "@/lib/stockScore";

export function SwipeDeck() {
  const currentIndex = useStockStore((state) => state.currentIndex);
  const deck = useStockStore((state) => state.deck);
  const isLoading = useStockStore((state) => state.isLoading);
  const swipeLeft = useStockStore((state) => state.swipeLeft);
  const swipeRight = useStockStore((state) => state.swipeRight);

  const currentStock = deck[currentIndex];
  const nextStock = deck[currentIndex + 1];

  const handlers = useSwipeable({
    onSwipedLeft: () => currentStock && swipeLeft(currentStock.ticker),
    onSwipedRight: () => currentStock && swipeRight(currentStock.ticker),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const progress = useMemo(() => {
    if (!deck.length) return 0;
    const normalizedIndex = Math.min(currentIndex, deck.length - 1);
    return Math.min(((normalizedIndex + 1) / deck.length) * 100, 100);
  }, [currentIndex, deck.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-3xl border border-white/10 bg-card-dark/70 text-slate-300 h-96">
        <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading Stock Deck...</p>
      </div>
    );
  }

  if (!currentStock) {
    return (
      <div className="rounded-3xl border border-white/10 bg-card-dark/70 p-12 text-center text-slate-300">
        Deck completed. Come back after the next data refresh.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between text-sm text-slate-400">
          {}
          <span>Card {currentIndex + 1} / {deck.length}</span>
          <span>Next refresh in 4h</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-slate-800">
          <div className="h-1 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div {...handlers} className="cursor-grab">
        <StockCard stock={currentStock} />
      </div>

      <SwipeActions
        onSwipeLeft={() => swipeLeft(currentStock.ticker)}
        onSwipeRight={() => swipeRight(currentStock.ticker)}
      />

      {nextStock && (
        <div className="rounded-3xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
          Up next: {nextStock.name} • StockScore {computeScore(nextStock)}
        </div>
      )}
    </div>
  );
}
