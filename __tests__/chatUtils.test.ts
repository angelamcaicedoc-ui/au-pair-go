import {
  loadProfile,
  saveProfile,
  getDefaultProfile,
  loadChatHistory,
  saveChatHistory,
  loadIaCount,
  incrementIaCount,
  hasReachedFreeLimit,
  FREE_LIMIT,
  formatProfileForPrompt,
  UserProfile,
} from "@/lib/chatUtils";

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

Object.defineProperty(global, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

describe("chatUtils — Profile", () => {
  it("returns default profile when localStorage is empty", () => {
    const profile = loadProfile();
    expect(profile).toEqual(getDefaultProfile());
    expect(profile.estado).toBe("");
    expect(profile.conduce).toBe(false);
  });

  it("saves and loads profile correctly", () => {
    const testProfile: UserProfile = {
      estado: "Virginia",
      ciudad: "Arlington",
      codigoPostal: "22201",
      edadesKids: "2, 5",
      alergias: "nueces",
      conduce: true,
      ingles: "intermedio",
    };
    saveProfile(testProfile);
    const loaded = loadProfile();
    expect(loaded).toEqual(testProfile);
  });
});

describe("chatUtils — Chat History", () => {
  it("returns empty array when no history exists", () => {
    const history = loadChatHistory("toddler-kids-care");
    expect(history).toEqual([]);
  });

  it("saves and loads chat history", () => {
    const messages = [
      { role: "user" as const, content: "Hola" },
      { role: "assistant" as const, content: "¡Hola! ¿En qué te ayudo?" },
    ];
    saveChatHistory("toddler-kids-care", messages);
    const loaded = loadChatHistory("toddler-kids-care");
    expect(loaded).toEqual(messages);
  });

  it("limits chat history to 10 messages", () => {
    const messages = Array.from({ length: 15 }, (_, i) => ({
      role: "user" as const,
      content: `Mensaje ${i + 1}`,
    }));
    saveChatHistory("test-section", messages);
    const loaded = loadChatHistory("test-section");
    expect(loaded.length).toBe(10);
    expect(loaded[0].content).toBe("Mensaje 6");
  });

  it("keeps history separate per section", () => {
    saveChatHistory("section-a", [{ role: "user", content: "A" }]);
    saveChatHistory("section-b", [{ role: "user", content: "B" }]);
    expect(loadChatHistory("section-a")[0].content).toBe("A");
    expect(loadChatHistory("section-b")[0].content).toBe("B");
  });
});

describe("chatUtils — Message Counter", () => {
  it("starts at 0", () => {
    expect(loadIaCount()).toBe(0);
  });

  it("increments correctly", () => {
    incrementIaCount();
    incrementIaCount();
    incrementIaCount();
    expect(loadIaCount()).toBe(3);
  });

  it("hasReachedFreeLimit returns false below limit", () => {
    for (let i = 0; i < FREE_LIMIT - 1; i++) {
      incrementIaCount();
    }
    expect(hasReachedFreeLimit()).toBe(false);
  });

  it("hasReachedFreeLimit returns true at limit", () => {
    for (let i = 0; i < FREE_LIMIT; i++) {
      incrementIaCount();
    }
    expect(hasReachedFreeLimit()).toBe(true);
  });
});

describe("chatUtils — formatProfileForPrompt", () => {
  it("returns placeholder when profile is empty", () => {
    const result = formatProfileForPrompt(getDefaultProfile());
    expect(result).toBe("No se ha configurado perfil.");
  });

  it("formats profile fields correctly", () => {
    const profile: UserProfile = {
      ...getDefaultProfile(),
      estado: "Virginia",
      ciudad: "Arlington",
      conduce: true,
    };
    const result = formatProfileForPrompt(profile);
    expect(result).toContain("Estado: Virginia");
    expect(result).toContain("Ciudad: Arlington");
    expect(result).toContain("Conduce: Sí");
  });

  it("omits empty fields", () => {
    const profile: UserProfile = {
      ...getDefaultProfile(),
      estado: "Texas",
    };
    const result = formatProfileForPrompt(profile);
    expect(result).toBe("Estado: Texas");
    expect(result).not.toContain("Ciudad:");
  });
});
