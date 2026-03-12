import { toddlerPrompt, dmvPrompt, aupairPrompt } from "./prompts";

const promptMap: Record<string, string> = {
  toddler: toddlerPrompt,
  dmv: dmvPrompt,
  aupair: aupairPrompt,
};

export function getSystemPrompt(sectionId: string): string {
  return promptMap[sectionId] ?? promptMap["toddler"];
}
