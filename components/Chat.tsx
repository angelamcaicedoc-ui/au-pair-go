"use client";

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  }, [sectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sectionId,
          history: messages.slice(-10),
          profile,
        }),
      });

      const data = await res.json();

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
              {msg.content}
            </div>
          </div>
        ))}

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
            >
              Enviar
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            Presiona Enter para enviar · Shift+Enter para nueva línea
          </p>
        </div>
      )}
    </div>
  );
}
