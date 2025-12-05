import { create } from "zustand";
import { nanoid } from "nanoid";
import { ChatMessage, StockCardData } from "@/types";
import { computeScore } from "@/lib/stockScore";
import { stockDeck } from "@/data/stocks";

export type SwipeDirection = "LEFT" | "RIGHT";

interface SwipeEvent {
  ticker: string;
  direction: SwipeDirection;
  timestamp: number;
}

const shuffleArray = (array: StockCardData[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const buildInitialChat = (stock: StockCardData): ChatMessage[] => [
  {
    id: nanoid(),
    sender: "ai",
    text: `Hey! I am your YieldR copilot for ${stock.ticker}. Ask me for any related news or financial information.`,
    timestamp: new Date().toISOString(),
  },
];

interface StockStoreState {
  deck: StockCardData[];
  currentIndex: number;
  isLoading: boolean;
  inbox: Record<string, StockCardData>;
  chatThreads: Record<string, ChatMessage[]>;
  swipeEvents: SwipeEvent[];
  activeInboxTicker?: string;
  swipeLeft: (ticker: string) => void;
  swipeRight: (ticker: string) => void;
  setActiveInboxTicker: (ticker: string) => void;
  sendMessage: (ticker: string, message: string) => void;
  loadDeck: () => Promise<void>;
}

export const useStockStore = create<StockStoreState>((set, get) => {
  // Initial State
  const initialState = {
    deck: [],
    currentIndex: 0,
    isLoading: true,
    inbox: {},
    chatThreads: {},
    swipeEvents: [],
    activeInboxTicker: undefined,
  };

  const actions = {
    loadDeck: async () => {
      set({ isLoading: true });

      await new Promise((resolve) => setTimeout(resolve, 200));

      const shuffledDeck = shuffleArray([...mockFullDeck]);

      set({
        deck: shuffledDeck,
        isLoading: false, 
        currentIndex: 0, 
      });
    },

    swipeLeft: (ticker: string) =>
      set((state) => ({
        currentIndex: state.currentIndex + 1,
        swipeEvents: [...state.swipeEvents, { ticker, direction: "LEFT", timestamp: Date.now() }],
      })),

    swipeRight: (ticker: string) =>
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
    setActiveInboxTicker: (ticker: string) => set({ activeInboxTicker: ticker }),
    sendMessage: (ticker: string, text: string) => {
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
  };

  actions.loadDeck();

  return { ...initialState, ...actions };
});

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
  return `StockScore™ for ${stock.ticker} is ${score}. Sentiment is ${stock.sentiment} with earnings on ${stock.earningsDate}. Let me know if you want either bullish or bearish catalysts.`;
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
