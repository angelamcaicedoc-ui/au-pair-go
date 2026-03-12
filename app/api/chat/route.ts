import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
copilot/au-pair-go-mvp-structure
import { MAX_CHAT_HISTORY } from "@/lib/chatUtils";

// Import prompts by section
import { systemPrompt as toddlerPrompt } from "@/lib/prompts/toddler-kids-care";
import { systemPrompt as dmvPrompt } from "@/lib/prompts/dmv-driving";
import { systemPrompt as auPairPrompt } from "@/lib/prompts/au-pair-program";

const SECTION_PROMPTS: Record<string, string> = {
  "toddler-kids-care": toddlerPrompt,
  "dmv-driving": dmvPrompt,
  "au-pair-program": auPairPrompt,
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  section: string;
  history: ChatMessage[];
  profile: Record<string, string | boolean>;
  content: string;
  userMessage: string;
}

// Guardrail: validate response before sending
function validateResponse(text: string): string {
  if (!text || text.trim().length === 0) {
    return "Lo siento, no pude generar una respuesta. Por favor intenta de nuevo.";
  }
  if (text.length > 4000) {
    return text.slice(0, 4000) + "\n\n[Respuesta recortada por longitud]";
  }
  return text;
}

// Guardrail: check if message contains emergency keywords
function containsEmergency(message: string): boolean {
  const emergencyKeywords = [
    "emergencia",
    "emergency",
    "911",
    "no respira",
    "not breathing",
    "inconsciente",
    "unconscious",
    "sangrado",
    "bleeding",
    "accidente",
    "accident",
    "atacando",
    "attacking",
    "peligro",
    "danger",
    "ayuda urgente",
    "urgent help",
  ];
  const lower = message.toLowerCase();
  return emergencyKeywords.some((kw) => lower.includes(kw));
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { section, history, profile, content, userMessage } = body;

    // Validate required fields
    if (!section || !userMessage) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: section y userMessage son obligatorios." },

import { getSystemPrompt } from "@/lib/prompts/index";
import { getSectionContent } from "@/content/sections/index";
import { buildProfileContext } from "@/lib/profile";
import { validateUserMessage, validateAIResponse } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sectionId, history = [], profile } = body;

    if (!message || !sectionId) {
      return NextResponse.json(
        { error: "Faltan parámetros: message y sectionId son requeridos." },
main
        { status: 400 }
      );
    }

 copilot/au-pair-go-mvp-structure
    // Emergency guardrail
    if (containsEmergency(userMessage)) {
      return NextResponse.json({
        reply:
          "⚠️ **Parece que hay una emergencia.** Por favor llama al **911** inmediatamente si alguien está en peligro. Si es una situación de violencia doméstica, llama al 1-800-799-7233 (en español, 24/7).",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no configurada. Revisa tu archivo .env.local." },

    const validation = validateUserMessage(message);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Error de configuración del servidor." },
 main
        { status: 500 }
      );
    }

 copilot/au-pair-go-mvp-structure
    // Get system prompt for section
    const sectionPrompt = SECTION_PROMPTS[section];
    if (!sectionPrompt) {
      return NextResponse.json(
        { error: `Sección desconocida: ${section}` },
        { status: 400 }
      );
    }

    // Build full system prompt with profile and content context
    let fullSystemPrompt = sectionPrompt;

    // Add profile context
    if (profile && Object.keys(profile).length > 0) {
      const profileParts: string[] = [];
      if (profile.estado) profileParts.push(`Estado: ${profile.estado}`);
      if (profile.ciudad) profileParts.push(`Ciudad: ${profile.ciudad}`);
      if (profile.codigoPostal) profileParts.push(`Código Postal: ${profile.codigoPostal}`);
      if (profile.edadesKids) profileParts.push(`Edades de los niños: ${profile.edadesKids}`);
      if (profile.alergias) profileParts.push(`Alergias/restricciones: ${profile.alergias}`);
      if (profile.conduce) profileParts.push(`Conduce: Sí`);
      if (profile.ingles) profileParts.push(`Nivel de inglés: ${profile.ingles}`);

      if (profileParts.length > 0) {
        fullSystemPrompt += `\n\n**Perfil de la au pair:**\n${profileParts.join("\n")}`;
      }
    }

    // Add relevant content context (first 1500 chars to avoid token overflow)
    if (content && content.trim().length > 0) {
      const contentSnippet = content.slice(0, 1500);
      fullSystemPrompt += `\n\n**Contenido de referencia de esta sección:**\n${contentSnippet}`;
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: fullSystemPrompt,
    });

    // Build chat history (last MAX_CHAT_HISTORY messages, alternating user/model)
    const chatHistory = (history || [])
      .slice(-MAX_CHAT_HISTORY)
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Start chat session
    const chat = model.startChat({
      history: chatHistory,
    });

    // Send message
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    // Validate and return
    const validatedReply = validateResponse(responseText);

    return NextResponse.json({ reply: validatedReply });
  } catch (error) {
    console.error("Error en /api/chat:", error);

    if (error instanceof Error) {
      // Don't expose internal error details
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Error de autenticación con la IA. Verifica tu GEMINI_API_KEY." },
          { status: 500 }
        );
      }
      if (error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
        return NextResponse.json(
          { error: "Límite de la API de IA alcanzado. Intenta más tarde." },
          { status: 429 }
        );
      }
    }

=======
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt =
      getSystemPrompt(sectionId) +
      (profile ? buildProfileContext(profile) : "") +
      "\n\n## Contenido de referencia de esta sección\n" +
      getSectionContent(sectionId);

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    // Build history for Gemini (last 10 messages)
    const recentHistory = history.slice(-10);
    const chatHistory = recentHistory.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })
    );

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    const responseValidation = validateAIResponse(responseText);
    if (!responseValidation.valid) {
      return NextResponse.json(
        { error: "Error procesando la respuesta." },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error in /api/chat:", error);
main
    return NextResponse.json(
      { error: "Error interno del servidor. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
