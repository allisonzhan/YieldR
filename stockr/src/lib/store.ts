import { create } from "zustand";
import { nanoid } from "nanoid";
import { stockDeck } from "@/data/stocks";
import { ChatMessage, StockCardData } from "@/types";
import { computeScore } from "@/lib/stockScore";

export type SwipeDirection = "LEFT" | "RIGHT";

interface SwipeEvent {
  ticker: string;
  direction: SwipeDirection;
  timestamp: number;
}

const buildInitialChat = (stock: StockCardData): ChatMessage[] => [
  {
    id: nanoid(),
    sender: "ai",
    text: `Hey! I am your StockR copilot for ${stock.ticker}. I will bring you price moves, news, and bullish vs bearish cases on demand.`,
    timestamp: new Date().toISOString(),
  },
];

interface StockStoreState {
  deck: StockCardData[];
  currentIndex: number;
  inbox: Record<string, StockCardData>;
  chatThreads: Record<string, ChatMessage[]>;
  swipeEvents: SwipeEvent[];
  activeInboxTicker?: string;
  swipeLeft: (ticker: string) => void;
  swipeRight: (ticker: string) => void;
  setActiveInboxTicker: (ticker: string) => void;
  sendMessage: (ticker: string, message: string) => void;
}

export const useStockStore = create<StockStoreState>((set, get) => ({
  deck: stockDeck,
  currentIndex: 0,
  inbox: {},
  chatThreads: {},
  swipeEvents: [],
  activeInboxTicker: undefined,
  swipeLeft: (ticker) =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      swipeEvents: [...state.swipeEvents, { ticker, direction: "LEFT", timestamp: Date.now() }],
    })),
  swipeRight: (ticker) =>
    set((state) => {
      const stock = state.deck.find((card) => card.ticker === ticker);
      if (!stock) return state;
      const inbox = { ...state.inbox, [ticker]: stock };
      const chatThreads = state.chatThreads[ticker]
        ? state.chatThreads
        : { ...state.chatThreads, [ticker]: buildInitialChat(stock) };
      return {
        inbox,
        chatThreads,
        currentIndex: state.currentIndex + 1,
        swipeEvents: [...state.swipeEvents, { ticker, direction: "RIGHT", timestamp: Date.now() }],
        activeInboxTicker: ticker,
      };
    }),
  setActiveInboxTicker: (ticker) => set({ activeInboxTicker: ticker }),
  sendMessage: (ticker, text) => {
    const { chatThreads, inbox } = get();
    const stock = inbox[ticker] ?? get().deck.find((card) => card.ticker === ticker);
    if (!stock) return;

    const userMessage: ChatMessage = {
      id: nanoid(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const simulatedReply: ChatMessage = {
      id: nanoid(),
      sender: "ai",
      text: buildAiResponse(stock, text),
      timestamp: new Date().toISOString(),
    };

    set({
      chatThreads: {
        ...chatThreads,
        [ticker]: [...(chatThreads[ticker] ?? buildInitialChat(stock)), userMessage, simulatedReply],
      },
    });
  },
}));

const buildAiResponse = (stock: StockCardData, userPrompt: string) => {
  const score = computeScore(stock);
  const normalizedPrompt = userPrompt.toLowerCase();
  if (normalizedPrompt.includes("bear")) {
    return `Bearish take on ${stock.ticker}: valuation at ${stock.fundamentals.pe}x leaves little room for execution errors and beta ${stock.fundamentals.beta.toFixed(
      2
    )} adds volatility. Watch the next earnings on ${stock.earningsDate}.`;
  }
  if (normalizedPrompt.includes("bull")) {
    return `Bullish case: ${stock.description} Revenue grew ${stock.fundamentals.revenueYoY}% YoY and margins sit near ${stock.fundamentals.margin ?? 0}%. StockScore clocks in at ${score}/100.`;
  }
  if (normalizedPrompt.includes("news")) {
    return stock.news
      .map((item) => `${item.source}: ${item.title} — ${item.summary}`)
      .join("\n");
  }
  if (normalizedPrompt.includes("valued") || normalizedPrompt.includes("overvalued")) {
    return `${stock.ticker} trades at ${stock.fundamentals.pe}x earnings and ${(stock.fundamentals.ps ?? 0).toFixed(
      1
    )}x sales. Compare that with sector median ~22x and you can see why StockScore tags it as ${score >= 80 ? "Elite" : "Outperform"}.`;
  }
  return `StockScore™ for ${stock.ticker} is ${score}. Sentiment is ${stock.sentiment} with earnings on ${stock.earningsDate}. Let me know if you want bullish/bearish cases or news.`;
};

export const selectCurrentCard = (state: ReturnType<typeof useStockStore.getState>) =>
  state.deck[state.currentIndex];

export const selectInboxList = (state: ReturnType<typeof useStockStore.getState>) =>
  Object.values(state.inbox);

export const selectChatForTicker = (ticker?: string) => {
  if (!ticker) return [];
  const { chatThreads } = useStockStore.getState();
  return chatThreads[ticker] ?? [];
};

export const selectLeaderboardBuckets = (state: ReturnType<typeof useStockStore.getState>) => {
  const scores = state.deck.map((stock) => ({
    ticker: stock.ticker,
    name: stock.name,
    score: computeScore(stock),
  }));

  const trending = state.swipeEvents
    .filter((evt) => evt.direction === "RIGHT")
    .reduce<Record<string, number>>((acc, evt) => {
      acc[evt.ticker] = (acc[evt.ticker] ?? 0) + 1;
      return acc;
    }, {});

  const avoid = state.swipeEvents
    .filter((evt) => evt.direction === "LEFT")
    .reduce<Record<string, number>>((acc, evt) => {
      acc[evt.ticker] = (acc[evt.ticker] ?? 0) + 1;
      return acc;
    }, {});

  const findStock = (ticker: string) => state.deck.find((s) => s.ticker === ticker)!;

  const trendingList = Object.entries(trending)
    .map(([ticker, count]) => ({ ticker, count, score: computeScore(findStock(ticker)) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const avoidList = Object.entries(avoid)
    .map(([ticker, count]) => ({ ticker, count, score: computeScore(findStock(ticker)) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 5);

  const bySector = state.deck.reduce<Record<string, { ticker: string; score: number }>>((acc, stock) => {
    const score = computeScore(stock);
    const current = acc[stock.sector];
    if (!current || score > current.score) {
      acc[stock.sector] = { ticker: stock.ticker, score };
    }
    return acc;
  }, {});

  return { trendingList, avoidList, topScores, bySector };
};
