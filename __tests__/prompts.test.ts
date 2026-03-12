import { getSystemPrompt } from "@/lib/prompts/index";

describe("getSystemPrompt", () => {
  it("returns prompt for toddler section", () => {
    const prompt = getSystemPrompt("toddler");
    expect(prompt).toBeTruthy();
    expect(prompt.length).toBeGreaterThan(100);
    expect(prompt.toLowerCase()).toContain("cuidado");
  });

  it("returns prompt for dmv section", () => {
    const prompt = getSystemPrompt("dmv");
    expect(prompt).toBeTruthy();
    expect(prompt.length).toBeGreaterThan(100);
    expect(prompt.toLowerCase()).toContain("dmv");
  });

  it("returns prompt for aupair section", () => {
    const prompt = getSystemPrompt("aupair");
    expect(prompt).toBeTruthy();
    expect(prompt.length).toBeGreaterThan(100);
    expect(prompt.toLowerCase()).toContain("au pair");
  });

  it("returns a fallback prompt for unknown section", () => {
    const prompt = getSystemPrompt("unknown");
    expect(prompt).toBeTruthy();
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("all prompts include emergency guardrail", () => {
    ["toddler", "dmv", "aupair"].forEach((sectionId) => {
      const prompt = getSystemPrompt(sectionId);
      expect(prompt).toContain("911");
    });
  });
});
