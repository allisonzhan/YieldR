import { NextResponse } from "next/server";
import { stockDeck } from "@/data/stocks";
import { computeScore } from "@/lib/stockScore";

export async function GET() {
  const scored = stockDeck.map((stock) => ({
    ticker: stock.ticker,
    name: stock.name,
    score: computeScore(stock),
    sector: stock.sector,
  }));

  const topScores = [...scored].sort((a, b) => b.score - a.score).slice(0, 5);
  const sectors = scored.reduce<Record<string, { ticker: string; score: number }>>((acc, stock) => {
    const current = acc[stock.sector];
    if (!current || stock.score > current.score) {
      acc[stock.sector] = { ticker: stock.ticker, score: stock.score };
    }
    return acc;
  }, {});

  return NextResponse.json({ topScores, sectors, generatedAt: new Date().toISOString() });
}
