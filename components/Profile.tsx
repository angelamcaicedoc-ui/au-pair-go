"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, loadProfile, saveProfile, getDefaultProfile } from "@/lib/chatUtils";

interface ProfileProps {
  onProfileChange?: (profile: UserProfile) => void;
}

export function Profile({ onProfileChange }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile>(getDefaultProfile());
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
  }, []);

  const update = (key: keyof UserProfile, value: string | boolean) => {
    const newProfile = { ...profile, [key]: value };
    setProfile(newProfile);
  };

  const handleSave = () => {
    saveProfile(profile);
    onProfileChange?.(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasProfile = profile.estado || profile.ciudad || profile.codigoPostal;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-500 transition-colors"
      >
        <span className="text-lg">👤</span>
        <span className="font-medium">
          {hasProfile ? `Mi perfil: ${[profile.ciudad, profile.estado].filter(Boolean).join(", ")}` : "Configura tu perfil"}
        </span>
        <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Mi perfil (para respuestas personalizadas)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado</label>
              <input
                type="text"
                value={profile.estado}
                onChange={(e) => update("estado", e.target.value)}
                placeholder="ej: Virginia"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ciudad</label>
              <input
                type="text"
                value={profile.ciudad}
                onChange={(e) => update("ciudad", e.target.value)}
                placeholder="ej: Arlington"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Código Postal</label>
              <input
                type="text"
                value={profile.codigoPostal}
                onChange={(e) => update("codigoPostal", e.target.value)}
                placeholder="ej: 22201"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Edades de los niños</label>
              <input
                type="text"
                value={profile.edadesKids}
                onChange={(e) => update("edadesKids", e.target.value)}
                placeholder="ej: 2 años, 4 años"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Alergias / Restricciones</label>
              <input
                type="text"
                value={profile.alergias}
                onChange={(e) => update("alergias", e.target.value)}
                placeholder="ej: sin gluten, alérgico a nueces"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nivel de inglés</label>
              <select
                value={profile.ingles}
                onChange={(e) => update("ingles", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                <option value="">Selecciona...</option>
                <option value="básico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="fluido">Fluido</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.conduce}
                onChange={(e) => update("conduce", e.target.checked)}
                className="rounded accent-rose-500"
              />
              Conduzco / tengo licencia
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              {saved ? "✓ Guardado" : "Guardar perfil"}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            ℹ️ Tu perfil se guarda localmente en tu navegador.
          </p>
        </div>
      )}
    </div>
  );
}
