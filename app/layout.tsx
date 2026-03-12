import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Au Pair Go — Tu guía inteligente en EE.UU.",
  description:
    "Aplicación web con IA para au pairs hispanohablantes en EE.UU. Cuidado de niños, trámites DMV, programa au pair y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
