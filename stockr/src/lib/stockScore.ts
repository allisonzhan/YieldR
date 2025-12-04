import { StockCardData } from "@/types";

interface ScoreBreakdown {
  valuation: number;
  growth: number;
  stability: number;
  quality: number;
  trend: number;
  sentiment: number;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const weights: ScoreBreakdown = {
  valuation: 0.2,
  growth: 0.25,
  stability: 0.15,
  quality: 0.2,
  trend: 0.1,
  sentiment: 0.1,
};

export const computeScore = (stock: StockCardData) => {
  const { fundamentals, dailyChange, sentiment } = stock;

  const valuation = clamp(100 - fundamentals.pe);
  const growth = clamp((fundamentals.revenueYoY + (fundamentals.roe ?? 0)) / 2);
  const stability = clamp(100 - fundamentals.beta * 20);
  const quality = clamp(((fundamentals.margin ?? 0) + (fundamentals.roe ?? 0)) / 2);
  const trend = clamp(dailyChange * 12 + 50);
  const sentimentScore = sentiment === "bullish" ? 85 : sentiment === "neutral" ? 55 : 25;

  const weighted =
    valuation * weights.valuation +
    growth * weights.growth +
    stability * weights.stability +
    quality * weights.quality +
    trend * weights.trend +
    sentimentScore * weights.sentiment;

  return Math.round(weighted);
};

export const describeScore = (score: number) => {
  if (score >= 80) return "Elite";
  if (score >= 65) return "Outperform";
  if (score >= 50) return "Watch";
  return "Speculative";
};
