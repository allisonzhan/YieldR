export type QuickTag = "Growth" | "Dividend" | "Tech" | "Value" | "Large Cap" | "Small Cap" | "SaaS" | "Energy" | "Banking" | "AI";

export interface StockMetric {
  label: string;
  value: string | number;
}

export interface StockFundamentals {
  pe: number;
  eps: number;
  beta: number;
  revenueYoY: number;
  ps?: number;
  roe?: number;
  margin?: number;
}

export interface StockCardData {
  ticker: string;
  name: string;
  price: number;
  dailyChange: number;
  marketCap: string;
  sector: string;
  tags: QuickTag[];
  fundamentals: StockFundamentals;
  sentiment: "bullish" | "neutral" | "bearish";
  earningsDate: string;
  description: string;
  news: { title: string; summary: string; source: string }[];
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}
