"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, loadChatHistory, saveChatHistory, loadIaCount, incrementIaCount, FREE_LIMIT, MAX_CHAT_HISTORY } from "@/lib/chatUtils";
import { UserProfile } from "@/lib/chatUtils";

interface ChatProps {
  sectionId: string;
  sectionContent: string;
  profile: UserProfile;
  onCountUpdate?: (count: number) => void;
}

export function Chat({ sectionId, sectionContent, profile, onCountUpdate }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iaCount, setIaCount] = useState(0);
  const [locationLoading, setLocationLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = loadChatHistory(sectionId);
    setMessages(history);
    const count = loadIaCount();
    setIaCount(count);
  }, [sectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasReachedLimit = iaCount >= FREE_LIMIT;

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || input;
    if (!text.trim() || loading || hasReachedLimit) return;

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const updatedHistory = [...messages, userMessage].slice(-MAX_CHAT_HISTORY);
    setMessages(updatedHistory);
    saveChatHistory(sectionId, updatedHistory);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionId,
          history: updatedHistory.slice(0, -1), // history without current message
          profile,
          content: sectionContent,
          userMessage: text.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Error al obtener respuesta de la IA.");
        return;
      }

      const aiMessage: ChatMessage = { role: "assistant", content: data.reply };
      const finalHistory = [...updatedHistory, aiMessage].slice(-MAX_CHAT_HISTORY);
      setMessages(finalHistory);
      saveChatHistory(sectionId, finalHistory);

      // Increment counter
      const newCount = incrementIaCount();
      setIaCount(newCount);
      onCountUpdate?.(newCount);
    } catch {
      setError("Error de conexión. Por favor verifica tu internet y vuelve a intentarlo.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLocationRequest = async () => {
    setLocationLoading(true);
    setError(null);

    const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { timeout: 10000 }
        );
      });
    };

    const location = await getLocation();
    let locationText = "";

    if (location) {
      locationText = `Estoy en latitud ${location.lat.toFixed(4)}, longitud ${location.lng.toFixed(4)}.`;
    } else if (profile.ciudad || profile.codigoPostal) {
      locationText = `Estoy en ${[profile.ciudad, profile.estado, profile.codigoPostal].filter(Boolean).join(", ")}.`;
    } else {
      locationText = "No pude obtener mi ubicación exacta.";
    }

    const requestMessage = `Recomiéndame lugares cerca de donde estoy para actividades con niños (parques, bibliotecas, centros comunitarios). ${locationText} Incluye cómo buscarlos en Google Maps.`;

    setLocationLoading(false);
    await handleSend(requestMessage);
  };

  const clearChat = () => {
    setMessages([]);
    saveChatHistory(sectionId, []);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px] bg-gray-50 rounded-xl border border-gray-200">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-2xl mb-2">💬</p>
            <p className="text-sm">Comienza la conversación. Puedo ayudarte con preguntas sobre esta sección.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-rose-500 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="text-xs font-semibold text-rose-500 block mb-1">✨ Asistente IA</span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 px-4 py-2 text-sm">
              <span className="text-xs font-semibold text-rose-500 block mb-1">✨ Asistente IA</span>
              <span className="animate-pulse">Pensando...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2 text-sm">
            ⚠️ {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Limit reached */}
      {hasReachedLimit && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-amber-800 text-sm font-medium">
            🌟 Alcanzaste tus {FREE_LIMIT} mensajes gratuitos.
          </p>
          <p className="text-amber-700 text-xs mt-1">
            Próximamente: suscríbete para mensajes ilimitados.
          </p>
        </div>
      )}

      {/* Input area */}
      {!hasReachedLimit && (
        <div className="mt-3 space-y-2">
          {/* Location button */}
          <button
            onClick={handleLocationRequest}
            disabled={loading || locationLoading || hasReachedLimit}
            className="w-full text-sm bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl py-2 px-3 transition-colors disabled:opacity-50"
          >
            {locationLoading ? "📍 Obteniendo ubicación..." : "📍 Recomiéndame lugares cerca"}
          </button>

          {/* Message input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={loading || hasReachedLimit}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 disabled:bg-gray-100"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading || hasReachedLimit}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Clear chat */}
      {messages.length > 0 && (
        <button
          onClick={clearChat}
          className="mt-2 text-xs text-gray-400 hover:text-gray-600 text-right self-end"
        >
          Limpiar conversación
        </button>
      )}
    </div>
  );
}
