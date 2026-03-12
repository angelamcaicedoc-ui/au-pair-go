"use client";

 copilot/au-pair-go-mvp-structure
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

import { useState, useEffect, startTransition } from "react";
import { UserProfile, defaultProfile } from "@/lib/profile";

const NIVEL_INGLES_LABELS: Record<UserProfile["nivelIngles"], string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aupairgo_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        startTransition(() => {
          setProfile(parsed);
          setDraft(parsed);
        });
      }
    } catch {
      // ignore
    }
  }, []);

  function handleEdit() {
    setDraft({ ...profile });
    setEditing(true);
    setSaved(false);
  }

  function handleSave() {
    try {
      localStorage.setItem("aupairgo_profile", JSON.stringify(draft));
      setProfile(draft);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    }
  }

  function handleCancel() {
    setDraft({ ...profile });
    setEditing(false);
  }

  function updateDraft(field: keyof UserProfile, value: string | boolean) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>👤</span>
          <span className="font-semibold text-gray-800 text-sm">Mi Perfil</span>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Editar
          </button>
        )}
      </div>

      <div className="p-4">
        {saved && (
          <div className="mb-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
            ✅ Perfil guardado correctamente
          </div>
        )}

        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Estado</label>
                <input
                  type="text"
                  value={draft.estado}
                  onChange={(e) => updateDraft("estado", e.target.value)}
                  placeholder="ej: California"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={draft.ciudad}
                  onChange={(e) => updateDraft("ciudad", e.target.value)}
                  placeholder="ej: Los Angeles"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

 main
            <div>
              <label className="block text-xs text-gray-500 mb-1">Código Postal</label>
              <input
                type="text"
 copilot/au-pair-go-mvp-structure
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

                value={draft.codigoPostal}
                onChange={(e) => updateDraft("codigoPostal", e.target.value)}
                placeholder="ej: 90001"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Edades de los niños
              </label>
              <input
                type="text"
                value={draft.edadesNinos}
                onChange={(e) => updateDraft("edadesNinos", e.target.value)}
                placeholder="ej: 2 años, 5 años"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Alergias conocidas</label>
              <input
                type="text"
                value={draft.alergias}
                onChange={(e) => updateDraft("alergias", e.target.value)}
                placeholder="ej: maní, gluten"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Nivel de inglés</label>
              <select
                value={draft.nivelIngles}
                onChange={(e) =>
                  updateDraft("nivelIngles", e.target.value as UserProfile["nivelIngles"])
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="conduce"
                checked={draft.conduce}
                onChange={(e) => updateDraft("conduce", e.target.checked)}
                className="rounded"
              />
              <label htmlFor="conduce" className="text-sm text-gray-700">
                ¿Tienes o estás aprendiendo a conducir?
              </label>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 text-sm">
            {!profile.estado && !profile.ciudad ? (
              <p className="text-gray-400 text-center py-2">
                Completa tu perfil para recibir respuestas más personalizadas.
              </p>
            ) : (
              <>
                {profile.estado && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado</span>
                    <span className="text-gray-800 font-medium">{profile.estado}</span>
                  </div>
                )}
                {profile.ciudad && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ciudad</span>
                    <span className="text-gray-800 font-medium">{profile.ciudad}</span>
                  </div>
                )}
                {profile.codigoPostal && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Código Postal</span>
                    <span className="text-gray-800 font-medium">{profile.codigoPostal}</span>
                  </div>
                )}
                {profile.edadesNinos && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Niños</span>
                    <span className="text-gray-800 font-medium">{profile.edadesNinos}</span>
                  </div>
                )}
                {profile.alergias && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Alergias</span>
                    <span className="text-gray-800 font-medium">{profile.alergias}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Inglés</span>
                  <span className="text-gray-800 font-medium">
                    {NIVEL_INGLES_LABELS[profile.nivelIngles]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Conduce</span>
                  <span className="text-gray-800 font-medium">
                    {profile.conduce ? "Sí" : "No"}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
 main
    </div>
  );
}
