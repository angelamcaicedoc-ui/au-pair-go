import { toddlerContent } from "./toddler";
import { dmvContent } from "./dmv";
import { aupairContent } from "./aupair";

const contentMap: Record<string, string> = {
  toddler: toddlerContent,
  dmv: dmvContent,
  aupair: aupairContent,
};

export function getSectionContent(sectionId: string): string {
  return contentMap[sectionId] ?? "";
}
