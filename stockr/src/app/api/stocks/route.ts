import { NextResponse } from "next/server";
import { stockDeck } from "@/data/stocks";
import { computeScore } from "@/lib/stockScore";

export async function GET() {
  const payload = stockDeck.map((stock) => ({
    ...stock,
    stockScore: computeScore(stock),
  }));

  return NextResponse.json({ data: payload, updatedAt: new Date().toISOString() });
}
