import type { Metadata } from "next";
copilot/au-pair-go-mvp-structure
import "./globals.css";

export const metadata: Metadata = {
  title: "Au Pair Go — Tu guía inteligente en EE.UU.",
  description:
    "Aplicación web con IA para au pairs hispanohablantes en EE.UU. Cuidado de niños, trámites DMV, programa au pair y más.",

import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Au Pair Go — Tu asistente inteligente",
  description:
    "Aplicación web con IA para au pairs hispanohablantes en EE.UU. Cuidado infantil, DMV, programa au pair y más.",
 main
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
 copilot/au-pair-go-mvp-structure
      <body className="antialiased">{children}</body>

      <body className="antialiased bg-gray-50 min-h-screen font-sans">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="font-bold text-gray-800 text-lg">Au Pair Go</span>
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
          <p>Au Pair Go © 2024 — Hecho con ❤️ para au pairs hispanohablantes en EE.UU.</p>
          <p className="mt-1">
            La información proporcionada es orientativa. No reemplaza consejos legales, médicos
            ni de tu agencia.
          </p>
        </footer>
      </body>
 main
    </html>
  );
}
