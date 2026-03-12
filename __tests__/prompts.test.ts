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
    });
  });
});
