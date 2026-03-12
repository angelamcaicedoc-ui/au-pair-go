import { readFile } from "fs/promises";
import { join } from "path";

export async function getSectionContent(sectionId: string): Promise<string> {
  try {
    const filePath = join(process.cwd(), "content", "sections", `${sectionId}.md`);
    const content = await readFile(filePath, "utf-8");
    return content;
  } catch {
    return "";
  }
}
