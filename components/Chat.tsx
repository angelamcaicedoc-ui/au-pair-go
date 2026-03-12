"use client";

 copilot/au-pair-go-mvp-structure
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
=======
import { useState, useEffect, useRef, startTransition } from "react";
import {
  ChatMessage,
  getChatHistory,
  saveChatHistory,
  clearChatHistory,
  getMessageCount,
  incrementMessageCount,
  isFreeLimitReached,
  FREE_MESSAGE_LIMIT,
} from "@/lib/chat";
import { UserProfile, defaultProfile } from "@/lib/profile";

interface ChatProps {
  sectionId: string;
  sectionTitle: string;
}

export default function Chat({ sectionId, sectionTitle }: ChatProps) {
 main
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 copilot/au-pair-go-mvp-structure
  const [iaCount, setIaCount] = useState(0);
  const [locationLoading, setLocationLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = loadChatHistory(sectionId);
    setMessages(history);
    const count = loadIaCount();
    setIaCount(count);

  const [msgCount, setMsgCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = getChatHistory(sectionId);
    const count = getMessageCount();
    startTransition(() => {
      setMessages(history);
      setMsgCount(count);
      setLimitReached(isFreeLimitReached());
    });

    try {
      const stored = localStorage.getItem("aupairgo_profile");
      if (stored) startTransition(() => setProfile(JSON.parse(stored)));
    } catch {
      // ignore
    }
 main
  }, [sectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 copilot/au-pair-go-mvp-structure
  const hasReachedLimit = iaCount >= FREE_LIMIT;

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || input;
    if (!text.trim() || loading || hasReachedLimit) return;

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const updatedHistory = [...messages, userMessage].slice(-MAX_CHAT_HISTORY);
    setMessages(updatedHistory);
    saveChatHistory(sectionId, updatedHistory);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (isFreeLimitReached()) {
      setLimitReached(true);
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
 main
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
 copilot/au-pair-go-mvp-structure
          section: sectionId,
          history: updatedHistory.slice(0, -1), // history without current message
          profile,
          content: sectionContent,
          userMessage: text.trim(),

          message: trimmed,
          sectionId,
          history: messages.slice(-10),
          profile,
 main
        }),
      });

      const data = await res.json();

 copilot/au-pair-go-mvp-structure
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

      if (!res.ok) {
        setError(data.error || "Error al conectar con la IA.");
        setMessages(messages);
        return;
      }

      const aiMessage: ChatMessage = { role: "model", content: data.response };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveChatHistory(sectionId, finalMessages);

      const newCount = incrementMessageCount();
      setMsgCount(newCount);
      setLimitReached(newCount >= FREE_MESSAGE_LIMIT);
    } catch {
      setError("Error de conexión. Por favor intenta de nuevo.");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleClear() {
    clearChatHistory(sectionId);
    setMessages([]);
    setError(null);
  }

  const remaining = Math.max(0, FREE_MESSAGE_LIMIT - msgCount);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="font-semibold text-gray-800 text-sm">
            IA Experta — {sectionTitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {remaining} mensajes gratis restantes
          </span>
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Limpiar chat"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8">
            <p className="text-2xl mb-2">💬</p>
            <p>¡Hola! Soy tu asistente experta en {sectionTitle}.</p>
            <p className="mt-1">¿En qué puedo ayudarte hoy?</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
 main
              {msg.content}
            </div>
          </div>
        ))}
 copilot/au-pair-go-mvp-structure
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
              

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Freemium limit */}
      {limitReached && (
        <div className="mx-4 mb-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-center">
          <p className="font-semibold text-yellow-800">
            🌟 ¡Has usado tus {FREE_MESSAGE_LIMIT} mensajes gratis!
          </p>
          <p className="text-yellow-700 mt-1">
            Suscríbete a Au Pair Go Premium para mensajes ilimitados y más
            funciones.
          </p>
          <button className="mt-2 bg-yellow-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-600 transition-colors">
            Ver planes Premium
          </button>
        </div>
      )}

      {/* Input */}
      {!limitReached && (
        <div className="p-3 border-t border-gray-100">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta aquí..."
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[44px] max-h-[120px]"
              rows={1}
              disabled={loading}
              maxLength={2000}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
 main
            >
              Enviar
            </button>
          </div>
 copilot/au-pair-go-mvp-structure
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

          <p className="text-xs text-gray-400 mt-1.5 text-center">
            Presiona Enter para enviar · Shift+Enter para nueva línea
          </p>
        </div>
      )}
 main
    </div>
  );
}
