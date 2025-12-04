"use client";

import { useCallback, useEffect } from "react";

interface SwipeActionsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeActions({ onSwipeLeft, onSwipeRight }: SwipeActionsProps) {
  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") onSwipeLeft();
      if (event.key === "ArrowRight") onSwipeRight();
    },
    [onSwipeLeft, onSwipeRight]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <button
        onClick={onSwipeLeft}
        className="group flex items-center gap-3 rounded-full border border-rose-500/50 px-6 py-3 text-sm font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/10"
      >
        <span className="text-xl">⟲</span> Pass
      </button>
      <button
        onClick={onSwipeRight}
        className="group flex items-center gap-3 rounded-full border border-emerald-400/60 px-6 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-500/10"
      >
        <span className="text-xl">❤</span> Save & Chat
      </button>
    </div>
  );
}
