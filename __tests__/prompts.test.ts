 copilot/au-pair-go-mvp-structure
import { systemPrompt as toddlerPrompt } from "@/lib/prompts/toddler-kids-care";
import { systemPrompt as dmvPrompt } from "@/lib/prompts/dmv-driving";
import { systemPrompt as auPairPrompt } from "@/lib/prompts/au-pair-program";

describe("Section Prompts", () => {
  it("toddler-kids-care prompt is defined and contains guardrails", () => {
    expect(toddlerPrompt).toBeTruthy();
    expect(toddlerPrompt.toLowerCase()).toContain("911");
    expect(toddlerPrompt.toLowerCase()).toContain("médico");
    expect(toddlerPrompt.toLowerCase()).toContain("español");
  });

  it("dmv-driving prompt is defined and contains guardrails", () => {
    expect(dmvPrompt).toBeTruthy();
    expect(dmvPrompt.toLowerCase()).toContain("911");
    expect(dmvPrompt.toLowerCase()).toContain("legal");
    expect(dmvPrompt.toLowerCase()).toContain("español");
  });

  it("au-pair-program prompt is defined and contains guardrails", () => {
    expect(auPairPrompt).toBeTruthy();
    expect(auPairPrompt.toLowerCase()).toContain("911");
    expect(auPairPrompt.toLowerCase()).toContain("legal");
    expect(auPairPrompt.toLowerCase()).toContain("español");
  });

  it("all prompts are non-empty strings", () => {
    [toddlerPrompt, dmvPrompt, auPairPrompt].forEach((prompt) => {
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(100);
=======
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
 main
    });
  });
});
