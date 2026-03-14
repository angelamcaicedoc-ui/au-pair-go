"use client";

import { useState, useEffect, startTransition } from "react";
import { getMessageCount, FREE_MESSAGE_LIMIT } from "@/lib/chat";

export default function FreemiumCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    startTransition(() => setCount(getMessageCount()));
    // Listen for storage changes
    const handleStorage = () => startTransition(() => setCount(getMessageCount()));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const remaining = Math.max(0, FREE_MESSAGE_LIMIT - count);
  const percentage = (count / FREE_MESSAGE_LIMIT) * 100;

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-lg shadow-[#BA9F6B]/5 p-6 mt-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#BA9F6B]/10 rounded-full mix-blend-multiply blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <span className="text-sm font-bold text-gray-700 tracking-wide uppercase">
              Mensajes Gratuitos
            </span>
          </div>
          <span className="text-sm font-bold bg-white/60 px-3 py-1 rounded-full text-gray-700 border border-white">
            {count} / {FREE_MESSAGE_LIMIT}
          </span>
        </div>

        <div className="w-full bg-white/50 rounded-full h-3 mb-3 border border-gray-100/50 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${remaining <= 5
                ? "bg-gradient-to-r from-red-400 to-rose-400"
                : remaining <= 10
                  ? "bg-gradient-to-r from-[#BA9F6B] to-amber-300"
                  : "bg-gradient-to-r from-[#9FD7E8] to-[#B19CD9]"
              }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

        <p className="text-xs font-semibold text-center">
          {remaining > 0 ? (
            <span className="text-gray-600">
              Te quedan <strong className="text-[#B19CD9] text-base mx-1">{remaining}</strong> mensajes
            </span>
          ) : (
            <span className="text-[#BA9F6B] bg-amber-50/50 px-3 py-1 rounded-full border border-amber-100/50">
              ¡Suscríbete ahora para mensajes ilimitados! ✨
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
