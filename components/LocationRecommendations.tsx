"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/profile";

interface LocationRecommendationsProps {
  sectionId: string;
  profile: UserProfile;
}

export default function LocationRecommendations({
  sectionId,
  profile,
}: LocationRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const locationTypeLabel: Record<string, string> = {
    toddler: "parques, bibliotecas, centros de juego y actividades para niños",
    dmv: "oficinas del DMV, escuelas de manejo y sitios de práctica",
    aupair: "comunidades de au pairs, eventos culturales y recursos de apoyo",
  };

  async function getRecommendations() {
    setLoading(true);
    setError(null);
    setRecommendation(null);

    const locationQuery = locationTypeLabel[sectionId] || "lugares útiles";

    let locationContext = "";
    let coords: { lat: number; lng: number } | null = null;

    // Try geolocation
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      try {
        coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            reject,
            { timeout: 5000 }
          );
        });
        if (coords) {
          locationContext = `Ubicación GPS: lat ${coords.lat.toFixed(4)}, lng ${coords.lng.toFixed(4)}`;
        }
      } catch {
        // Fall back to profile location
      }
    }

    if (!locationContext && (profile.ciudad || profile.codigoPostal)) {
      const parts = [profile.ciudad, profile.estado, profile.codigoPostal].filter(Boolean);
      locationContext = `Ciudad/Ubicación: ${parts.join(", ")}`;
    }

    if (!locationContext) {
      setError(
        "No se pudo obtener tu ubicación. Por favor completa tu perfil con ciudad y estado."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Basándote en mi ubicación (${locationContext}), recomiéndame ${locationQuery} cercanos. Para cada lugar, incluye el nombre, una breve descripción, y un enlace de Google Maps en formato: https://www.google.com/maps/search/NOMBRE+DEL+LUGAR+${encodeURIComponent(profile.ciudad || "cerca")} También incluye un enlace a Apple Maps: https://maps.apple.com/?q=NOMBRE+DEL+LUGAR. Dame 3-5 recomendaciones.`,
          sectionId,
          history: [],
          profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al obtener recomendaciones.");
        return;
      }

      setRecommendation(data.response);

      if (coords) {
        // Open Google Maps centered on user location
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(locationQuery)}/@${coords.lat},${coords.lng},13z`;
        window.open(mapsUrl, "_blank", "noopener noreferrer");
      }
    } catch {
      setError("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex items-center gap-2">
        <span>📍</span>
        <span className="font-semibold text-gray-800 text-sm">
          Lugares Cercanos
        </span>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-3">
          Encuentra {locationTypeLabel[sectionId] || "lugares útiles"} cerca de
          ti.
        </p>

        <button
          onClick={getRecommendations}
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Buscando lugares...
            </>
          ) : (
            <>
              <span>📍</span>
              Recomiéndame lugares cerca
            </>
          )}
        </button>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {recommendation && (
          <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {recommendation}
          </div>
        )}
      </div>
    </div>
  );
}
