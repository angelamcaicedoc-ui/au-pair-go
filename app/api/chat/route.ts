import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
        { status: 400 }
      );
    }

    const validation = validateUserMessage(message);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Error de configuración del servidor." },
        { status: 500 }
      );
    }

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
    return NextResponse.json(
      { error: "Error interno del servidor. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
