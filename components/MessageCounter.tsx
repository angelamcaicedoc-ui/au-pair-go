"use client";

import React, { useEffect, useState } from "react";
import { loadIaCount, FREE_LIMIT } from "@/lib/chatUtils";

interface MessageCounterProps {
  count?: number; // Allow parent to pass updated count
}

export function MessageCounter({ count: externalCount }: MessageCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(loadIaCount());
  }, []);

  // Sync with external count when provided
  useEffect(() => {
    if (externalCount !== undefined) {
      setCount(externalCount);
    }
  }, [externalCount]);

  const remaining = Math.max(0, FREE_LIMIT - count);
  const percentage = (count / FREE_LIMIT) * 100;

  if (count >= FREE_LIMIT) {
    return (
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm">
        <span>🌟</span>
        <div>
          <p className="text-amber-800 font-medium text-xs">Plan gratuito completado</p>
          <p className="text-amber-700 text-xs">Próximamente: mensajes ilimitados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs text-gray-500">
      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-rose-400 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="whitespace-nowrap font-medium">
        {remaining} mensajes gratis restantes
      </span>
    </div>
  );
}
