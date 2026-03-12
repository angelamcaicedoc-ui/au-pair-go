export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export const MAX_HISTORY = 10;
export const FREE_MESSAGE_LIMIT = 30;
const CHAT_HISTORY_KEY_PREFIX = "aupairgo_chat_";
const MESSAGE_COUNT_KEY = "aupairgo_msg_count";

export function getChatHistory(sectionId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(`${CHAT_HISTORY_KEY_PREFIX}${sectionId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(sectionId: string, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  const trimmed = messages.slice(-MAX_HISTORY);
  localStorage.setItem(`${CHAT_HISTORY_KEY_PREFIX}${sectionId}`, JSON.stringify(trimmed));
}

export function clearChatHistory(sectionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${CHAT_HISTORY_KEY_PREFIX}${sectionId}`);
}

export function getMessageCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const count = localStorage.getItem(MESSAGE_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementMessageCount(): number {
  if (typeof window === "undefined") return 0;
  const count = getMessageCount() + 1;
  localStorage.setItem(MESSAGE_COUNT_KEY, count.toString());
  return count;
}

export function isFreeLimitReached(): boolean {
  return getMessageCount() >= FREE_MESSAGE_LIMIT;
}
