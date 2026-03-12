import {
  getChatHistory,
  saveChatHistory,
  clearChatHistory,
  getMessageCount,
  incrementMessageCount,
  isFreeLimitReached,
  FREE_MESSAGE_LIMIT,
  ChatMessage,
} from "@/lib/chat";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("chat storage", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("returns empty array when no history exists", () => {
    const history = getChatHistory("toddler");
    expect(history).toEqual([]);
  });

  it("saves and retrieves chat history", () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "Hola" },
      { role: "model", content: "¡Hola!" },
    ];
    saveChatHistory("toddler", messages);
    expect(getChatHistory("toddler")).toEqual(messages);
  });

  it("trims history to last 10 messages", () => {
    const messages: ChatMessage[] = Array.from({ length: 15 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "model",
      content: `Mensaje ${i}`,
    }));
    saveChatHistory("toddler", messages);
    const stored = getChatHistory("toddler");
    expect(stored.length).toBe(10);
    expect(stored[0].content).toBe("Mensaje 5");
  });

  it("clears chat history for a section", () => {
    const messages: ChatMessage[] = [{ role: "user", content: "test" }];
    saveChatHistory("toddler", messages);
    clearChatHistory("toddler");
    expect(getChatHistory("toddler")).toEqual([]);
  });

  it("keeps history separate per section", () => {
    const toddlerMsg: ChatMessage[] = [{ role: "user", content: "toddler msg" }];
    const dmvMsg: ChatMessage[] = [{ role: "user", content: "dmv msg" }];
    saveChatHistory("toddler", toddlerMsg);
    saveChatHistory("dmv", dmvMsg);
    expect(getChatHistory("toddler")[0].content).toBe("toddler msg");
    expect(getChatHistory("dmv")[0].content).toBe("dmv msg");
  });
});

describe("message counter", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("starts at 0", () => {
    expect(getMessageCount()).toBe(0);
  });

  it("increments message count", () => {
    incrementMessageCount();
    incrementMessageCount();
    expect(getMessageCount()).toBe(2);
  });

  it("isFreeLimitReached returns false when below limit", () => {
    expect(isFreeLimitReached()).toBe(false);
  });

  it("isFreeLimitReached returns true when at limit", () => {
    for (let i = 0; i < FREE_MESSAGE_LIMIT; i++) {
      incrementMessageCount();
    }
    expect(isFreeLimitReached()).toBe(true);
  });

  it("FREE_MESSAGE_LIMIT is 30", () => {
    expect(FREE_MESSAGE_LIMIT).toBe(30);
  });
});
