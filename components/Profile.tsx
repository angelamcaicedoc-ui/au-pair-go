"use client";

import React, { useState, useEffect, startTransition } from "react";
import { UserProfile, loadProfile, saveProfile, getDefaultProfile } from "@/lib/chatUtils";

const NIVEL_INGLES_LABELS: Record<NonNullable<UserProfile["nivelIngles"]>, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

interface ProfileProps {
  onProfileChange?: (profile: UserProfile) => void;
}

export default function Profile({ onProfileChange }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile>(getDefaultProfile());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(getDefaultProfile());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = loadProfile();
    startTransition(() => {
      setProfile(loaded);
      setDraft(loaded);
    });
  }, []);

  function handleEdit() {
    setDraft({ ...profile });
    setEditing(true);
    setSaved(false);
  }

  function handleSave() {
    saveProfile(draft);
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    if (onProfileChange) {
      onProfileChange(draft);
    }
    setTimeout(() => setSaved(false), 2000);
  }

  function handleCancel() {
    setDraft({ ...profile });
    setEditing(false);
  }

  function updateDraft(field: keyof UserProfile, value: string | boolean) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl shadow-[#9FD7E8]/10 overflow-hidden relative">
      <div className="px-5 py-4 border-b border-white/50 bg-white/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9FD7E8] to-[#B19CD9] flex items-center justify-center text-white text-sm shadow-sm">
            👤
          </div>
          <span className="font-bold text-gray-800">Tus Datos</span>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="text-sm text-[#B19CD9] hover:text-purple-700 font-bold transition-colors bg-white/50 px-3 py-1 rounded-full border border-white"
          >
            Editar
          </button>
        )}
      </div>

      <div className="p-5">
        {saved && (
          <div className="mb-4 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2 font-medium">
            <span className="text-lg">✅</span> Perfil guardado correctamente
          </div>
        )}

        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Estado</label>
                <input
                  type="text"
                  value={draft.estado}
                  onChange={(e) => updateDraft("estado", e.target.value)}
                  placeholder="ej: California"
                  className="w-full bg-white/70 border border-white shadow-sm rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B19CD9] focus:bg-white transition-all"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Ciudad</label>
                <input
                  type="text"
                  value={draft.ciudad}
                  onChange={(e) => updateDraft("ciudad", e.target.value)}
                  placeholder="ej: Los Angeles"
                  className="w-full bg-white/70 border border-white shadow-sm rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B19CD9] focus:bg-white transition-all"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Código Postal</label>
                <input
                  type="text"
                  value={draft.codigoPostal}
                  onChange={(e) => updateDraft("codigoPostal", e.target.value)}
                  placeholder="ej: 90001"
                  className="w-full bg-white/70 border border-white shadow-sm rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B19CD9] focus:bg-white transition-all"
                  maxLength={10}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                  Edades de los niños
                </label>
                <input
                  type="text"
                  value={draft.edadesNinos}
                  onChange={(e) => updateDraft("edadesNinos", e.target.value)}
                  placeholder="ej: 2 años, 5 años"
                  className="w-full bg-white/70 border border-white shadow-sm rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B19CD9] focus:bg-white transition-all"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Alergias conocidas</label>
                <input
                  type="text"
                  value={draft.alergias}
                  onChange={(e) => updateDraft("alergias", e.target.value)}
                  placeholder="ej: maní, gluten"
                  className="w-full bg-white/70 border border-white shadow-sm rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B19CD9] focus:bg-white transition-all"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Nivel de inglés</label>
                <select
                  value={draft.nivelIngles || "basico"}
                  onChange={(e) =>
                    updateDraft("nivelIngles", e.target.value)
                  }
                  className="w-full bg-white/70 border border-white shadow-sm rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B19CD9] focus:bg-white transition-all appearance-none"
                >
                  <option value="basico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center mt-6 p-3 bg-white/50 border border-white rounded-xl">
                <input
                  type="checkbox"
                  id="conduce"
                  checked={draft.conduce}
                  onChange={(e) => updateDraft("conduce", e.target.checked)}
                  className="w-4 h-4 text-[#B19CD9] rounded focus:ring-[#B19CD9]"
                />
                <label htmlFor="conduce" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                  Manejo / Conduzco
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-5">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#B19CD9] to-[#9c82c9] text-white rounded-xl py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-white/80 border border-gray-200 text-gray-600 rounded-xl py-3 text-sm font-bold shadow-sm hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {!profile.estado && !profile.ciudad ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3 opacity-50">✨</div>
                <p className="text-gray-500 text-sm font-medium">
                  Completa tu perfil para que la IA entienda mejor tu contexto y te dé respuestas más precisas.
                </p>
                <button
                  onClick={handleEdit}
                  className="mt-4 bg-[#B19CD9]/10 text-[#B19CD9] font-bold px-5 py-2 rounded-full text-sm"
                >
                  Completar perfil ahora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
                {profile.estado && (
                  <div className="bg-white/50 border border-white p-3 rounded-xl">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estado</span>
                    <span className="block text-gray-800 font-bold">{profile.estado}</span>
                  </div>
                )}
                {profile.ciudad && (
                  <div className="bg-white/50 border border-white p-3 rounded-xl">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ciudad</span>
                    <span className="block text-gray-800 font-bold">{profile.ciudad}</span>
                  </div>
                )}
                {profile.codigoPostal && (
                  <div className="bg-white/50 border border-white p-3 rounded-xl">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Código Postal</span>
                    <span className="block text-gray-800 font-bold">{profile.codigoPostal}</span>
                  </div>
                )}
                {profile.edadesNinos && (
                  <div className="bg-white/50 border border-white p-3 rounded-xl">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Edades de los niños</span>
                    <span className="block text-gray-800 font-bold">{profile.edadesNinos}</span>
                  </div>
                )}
                {profile.alergias && (
                  <div className="bg-white/50 border border-white p-3 rounded-xl">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Alergias Conocidas</span>
                    <span className="block text-gray-800 font-bold">{profile.alergias}</span>
                  </div>
                )}
                <div className="bg-white/50 border border-white p-3 rounded-xl">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nivel de Inglés</span>
                  <span className="block text-gray-800 font-bold">
                    {NIVEL_INGLES_LABELS[profile.nivelIngles ?? "basico"]}
                  </span>
                </div>
                <div className="bg-white/50 border border-white p-3 rounded-xl">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Conducción</span>
                  <span className="block text-gray-800 font-bold">
                    {profile.conduce ? "🚗 Sí conduce" : "❌ No conduce"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}