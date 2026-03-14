export interface UserProfile {
  estado?: string;
  ciudad?: string;
  codigoPostal?: string;
  edadesNinos?: string;
  alergias?: string;
  nivelIngles?: "basico" | "intermedio" | "avanzado";
  conduce?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const PROFILE_KEY = "aupairgo_profile";
export const IA_COUNT_KEY = "aupair_ia_count";
export const FREE_LIMIT = 30;
export const MAX_CHAT_HISTORY = 10;

export function getChatKey(sectionId: string): string {
  return `aupair_chat_${sectionId}`;
}

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return getDefaultProfile();
  try {
    const str = localStorage.getItem(PROFILE_KEY);
    if (str) return JSON.parse(str);
  } catch {
    // ignore
  }
  return getDefaultProfile();
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getDefaultProfile(): UserProfile {
  return {
    estado: "",
    ciudad: "",
    codigoPostal: "",
    edadesNinos: "",
    alergias: "",
    conduce: false,
    nivelIngles: "basico",
  };
}

export function loadChatHistory(sectionId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const str = localStorage.getItem(getChatKey(sectionId));
    if (str) return JSON.parse(str);
  } catch {
    // ignore
  }
  return [];
}

export function saveChatHistory(sectionId: string, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  // Keep only last MAX_CHAT_HISTORY messages
  const limited = messages.slice(-MAX_CHAT_HISTORY);
  localStorage.setItem(getChatKey(sectionId), JSON.stringify(limited));
}

export function loadIaCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(IA_COUNT_KEY) || "0", 10);
}

export function incrementIaCount(): number {
  if (typeof window === "undefined") return 0;
  const current = loadIaCount();
  const next = current + 1;
  localStorage.setItem(IA_COUNT_KEY, String(next));
  return next;
}

export function hasReachedFreeLimit(): boolean {
  return loadIaCount() >= FREE_LIMIT;
}

export function formatProfileForPrompt(profile: UserProfile): string {
  const parts: string[] = [];
  if (profile.estado) parts.push(`Estado: ${profile.estado}`);
  if (profile.ciudad) parts.push(`Ciudad: ${profile.ciudad}`);
  if (profile.codigoPostal) parts.push(`Código Postal: ${profile.codigoPostal}`);
  if (profile.edadesNinos) parts.push(`Edades de los niños: ${profile.edadesNinos}`);
  if (profile.alergias) parts.push(`Alergias/restricciones: ${profile.alergias}`);
  if (profile.conduce) parts.push(`Conduce: Sí`);
  if (profile.nivelIngles) parts.push(`Nivel de inglés: ${profile.nivelIngles}`);
  if (parts.length === 0) return "No se ha configurado perfil.";
  return parts.join(", ");
}
