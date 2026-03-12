import type { Metadata } from "next";
import Profile from "@/components/Profile";
import FreemiumCounter from "@/components/FreemiumCounter";

export const metadata: Metadata = {
  title: "Mi Perfil — Au Pair Go",
  description: "Configura tu perfil para recibir recomendaciones personalizadas.",
};

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">👤 Mi Perfil</h1>
      <p className="text-gray-500 text-sm mb-6">
        Tu perfil nos ayuda a personalizar las respuestas de la IA según tu situación.
        Los datos se guardan solo en tu dispositivo.
      </p>
      <div className="space-y-4">
        <Profile />
        <FreemiumCounter />
      </div>
    </div>
  );
}
