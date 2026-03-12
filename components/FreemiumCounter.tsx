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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Mensajes gratuitos
        </span>
        <span className="text-sm text-gray-500">
          {count}/{FREE_MESSAGE_LIMIT}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            remaining <= 5
              ? "bg-red-400"
              : remaining <= 10
              ? "bg-yellow-400"
              : "bg-green-400"
          }`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 text-center">
        {remaining > 0 ? (
          <>Te quedan <strong>{remaining}</strong> mensajes gratis</>
        ) : (
          <span className="text-yellow-600 font-medium">
            ¡Suscríbete para mensajes ilimitados!
          </span>
        )}
      </p>
    </div>
  );
}
