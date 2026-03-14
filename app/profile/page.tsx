import type { Metadata } from "next";
import Profile from "@/components/Profile";
import FreemiumCounter from "@/components/FreemiumCounter";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["700"] });

export const metadata: Metadata = {
  title: "Mi Perfil — Au Pair Go",
  description: "Configura tu perfil para recibir recomendaciones personalizadas.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-[#9FD7E8]/30 via-white to-[#B19CD9]/20 rounded-t-[40px] md:rounded-[40px] px-4 py-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B19CD9]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9FD7E8]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="max-w-md mx-auto relative z-10">
        <h1 className={`${quicksand.className} text-3xl font-bold text-gray-800 mb-3 text-center`}>
          Mi <span className="text-[#B19CD9]">Perfil</span>
        </h1>
        <p className="text-gray-600 font-medium text-sm mb-8 text-center px-4 leading-relaxed">
          Tu perfil nos ayuda a personalizar las respuestas de la IA según tu situación.
          <span className="block mt-1 text-[#a58957] text-xs">🔒 Tus datos se guardan solo en tu móvil.</span>
        </p>

        <div className="space-y-6">
          <Profile />
          <FreemiumCounter />
        </div>
      </div>
    </div>
  );
}
