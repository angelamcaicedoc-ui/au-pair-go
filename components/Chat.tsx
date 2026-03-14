"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChatMessage,
  loadChatHistory,
  saveChatHistory,
  loadIaCount,
  incrementIaCount,
  FREE_LIMIT,
  MAX_CHAT_HISTORY,
} from "@/lib/chatUtils";
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
          history: updatedHistory.slice(0, -1),
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
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 min-h-[300px] max-h-[400px] bg-white/40 rounded-2xl border border-white/60 shadow-inner backdrop-blur-sm">
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-70">
            <div className="w-16 h-16 mx-auto bg-[#9FD7E8]/20 rounded-full flex items-center justify-center text-2xl mb-3 border border-white/50">
              💬
            </div>
            <p className="text-sm font-medium text-gray-600">
              Comienza la conversación. Puedo ayudarte con preguntas sobre esta sección.
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm whitespace-pre-wrap leading-relaxed ${msg.role === "user"
                  ? "bg-gradient-to-br from-[#B19CD9] to-[#9c82c9] text-white rounded-br-sm shadow-md"
                  : "bg-white/80 backdrop-blur-md text-gray-800 rounded-bl-sm shadow-sm border border-white/60"
                }`}
            >
              {msg.role === "assistant" && (
                <span className="text-[10px] font-bold text-[#B19CD9] uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                  <span>✨</span> Asistente IA
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-md text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-white/60 px-5 py-3 text-sm flex items-center gap-3">
              <span className="text-[10px] font-bold text-[#B19CD9] uppercase tracking-widest flex items-center gap-1">
                <span>✨</span> IA
              </span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#B19CD9] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#B19CD9] rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                <span className="w-1.5 h-1.5 bg-[#B19CD9] rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 rounded-xl px-4 py-3 text-sm font-medium shadow-sm flex items-start gap-2">
            <span>⚠️</span> <span>{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Límite gratis alcanzado */}
      {hasReachedLimit && (
        <div className="mt-4 bg-amber-50/80 backdrop-blur-md border border-amber-200/50 rounded-xl p-4 text-center shadow-sm">
          <p className="text-amber-800 text-sm font-bold flex items-center justify-center gap-2">
            <span>🌟</span> Alcanzaste tus {FREE_LIMIT} mensajes gratuitos.
          </p>
          <p className="text-amber-700/80 text-xs font-medium mt-1">
            Próximamente: suscríbete para mensajes ilimitados.
          </p>
        </div>
      )}

      {/* Zona de entrada */}
      {!hasReachedLimit && (
        <div className="mt-4 space-y-3">
          {/* Botón de ubicación */}
          <button
            onClick={handleLocationRequest}
            disabled={loading || locationLoading}
            className="w-full text-xs font-bold uppercase tracking-wide bg-[#9FD7E8]/10 hover:bg-[#9FD7E8]/20 text-gray-600 border border-white/60 shadow-sm rounded-xl py-2.5 px-4 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {locationLoading ? (
              <>
                <span className="animate-pulse">📍</span> Obteniendo ubicación...
              </>
            ) : (
              <>
                <span>📍</span> Recomiéndame lugares cerca
              </>
            )}
          </button>

          {/* Input de mensaje */}
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="flex-1 bg-white/70 backdrop-blur-sm border border-white/60 shadow-inner rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B19CD9]/50 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-[#9FD7E8] to-[#B19CD9] hover:opacity-90 text-white rounded-xl px-6 py-3 text-sm font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Botón limpiar chat */}
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
          Enter para enviar · Shift+Enter para salto
        </p>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors"
          >
            Limpiar chat
          </button>
        )}
      </div>
    </div>
  );
}