import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

// Metadata para tu sitio
export const metadata: Metadata = {
  title: "Au Pair Go — Tu asistente inteligente",
  description:
    "Aplicación web con IA para au pairs hispanohablantes en EE.UU. Cuidado infantil, DMV, programa au pair y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-gradient-to-br from-[#9FD7E8]/20 via-white to-[#B19CD9]/20 min-h-screen font-sans">
        <nav className="bg-white/40 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-[#B19CD9]/5">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center group">
              <Image 
                src="/logo-wide.jpg" 
                alt="Logo Au Pair Go" 
                width={160} 
                height={40} 
                className="rounded shadow-sm group-hover:scale-[1.03] transition-transform object-contain" 
              />
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">
                Inicio
              </Link>
              <Link
                href="/profile"
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                Mi Perfil
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100 mt-8">
          <p>
            Au Pair Go © 2026 — Hecho con <span className="text-red-500 mx-1">❤️</span> para au pairs hispanohablantes en EE.UU.
          </p>
          <p className="mt-1">
            La información proporcionada es orientativa. No reemplaza consejos legales, médicos
            ni de tu agencia.
          </p>
        </footer>
      </body>
    </html>
  );
}
