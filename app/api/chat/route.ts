import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "@/lib/prompts/index";

export const runtime = "nodejs";

const MAX_CHAT_HISTORY = 10;

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
  return text;
}

// Guardrail: check if message contains emergency keywords
function containsEmergency(message: string): boolean {
  const emergencyKeywords = [
    "emergencia", "emergency", "911", "no respira", "not breathing",
    "inconsciente", "unconscious", "sangrado", "bleeding", "accidente",
    "accident", "atacando", "attacking", "peligro", "danger", "ayuda urgente", "urgent help"
  ];
  const lower = message.toLowerCase();
  return emergencyKeywords.some((kw) => lower.includes(kw));
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { section, history = [], profile, content, userMessage } = body;

    // Validate required fields
    if (!section || !userMessage) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: section y userMessage son obligatorios." },
        { status: 400 }
      );
    }

    // Emergency guardrail
    if (containsEmergency(userMessage)) {
      return NextResponse.json({
        reply: "⚠️ **Parece que hay una emergencia.** Por favor llama al **911** inmediatamente si alguien está en peligro. Si es una situación de violencia doméstica, llama al 1-800-799-7233 (en español, 24/7).",
      });
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const modelName = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no configurada. Revisa tu archivo .env.local." },
        { status: 500 }
      );
    }

    // Get system prompt for section
    let sectionIdForPrompt = section;
    if (section === "cuidado-ninos") sectionIdForPrompt = "toddler";
    const sectionPrompt = getSystemPrompt(sectionIdForPrompt);

    // Build full system prompt with profile and content context
    let fullSystemPrompt = sectionPrompt;
    
    // NATIVE LENGTH GUARDRAIL INSTRUCTION
    fullSystemPrompt += `\n\n**REGLA MUY IMPORTANTE DE FORMATO:**\nTus respuestas deben ser concisas y directas. NUNCA excedas los 3 párrafos de longitud. Si la pregunta requiere mucha información, ofrece solo las 2 o 3 opciones más relevantes y pregunta si desean saber más detalles.`;

    // ENGLISH COACHING INSTRUCTION
    fullSystemPrompt += `\n\n**OBLIGATORIO - TUTOR DE INGLÉS:**\nREGLA ESTRICTA: SIEMPRE que sugieras una actividad (ir al parque, picnic, jugar, cocinar, etc.), ES OBLIGATORIO que tu respuesta termine con una sección separada llamada "💡 Dilo en Inglés:". En esta sección, debes darle a la au pair 2 o 3 frases exactas y divertidas de cómo proponerle la actividad a los niños en inglés (ej. "Hey guys, let's have a picnic!", "What do you think if we cook pizza?"). Adapta el vocabulario según su nivel de inglés. ¡NUNCA omitas esta sección si sugieres una actividad!`;

    // Add profile context
    if (profile && Object.keys(profile).length > 0) {
      const profileParts: string[] = [];
      if (profile.estado) profileParts.push(`Estado: ${profile.estado}`);
      if (profile.ciudad) profileParts.push(`Ciudad: ${profile.ciudad}`);
      if (profile.codigoPostal) profileParts.push(`Código Postal: ${profile.codigoPostal}`);
      if (profile.edadesNinos) profileParts.push(`Edades de los niños: ${profile.edadesNinos}`);
      if (profile.alergias) profileParts.push(`Alergias/restricciones: ${profile.alergias}`);
      if (profile.conduce) profileParts.push(`Conduce: Sí`);
      if (profile.nivelIngles) profileParts.push(`Nivel de inglés: ${profile.nivelIngles}`);

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
      generationConfig: {
        maxOutputTokens: 2500, // Raised to allow full detailed responses with English tutoring
      }
    });

    // Build chat history
    let validHistory = history
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Gemini requires the first message to be from the user.
    // Keep slicing from the start until the first message is a user message.
    while (validHistory.length > 0 && validHistory[0].role !== "user") {
      validHistory.shift();
    }

    // Limit to max history
    validHistory = validHistory.slice(-MAX_CHAT_HISTORY);

    // If after slicing it still starts with a model, shift again
    while (validHistory.length > 0 && validHistory[0].role !== "user") {
      validHistory.shift();
    }

    // Start chat session
    const chat = model.startChat({ history: validHistory });
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    const validatedReply = validateResponse(responseText);

    return NextResponse.json({ reply: validatedReply });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    if (error instanceof Error) {
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
    return NextResponse.json(
      { error: "Error interno del servidor. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
