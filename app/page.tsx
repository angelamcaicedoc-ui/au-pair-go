import { sections } from "@/lib/sections/sections";
import Link from "next/link";

export default function Home() {
  const availableSections = sections.filter((s) => s.available);
  const comingSoonSections = sections.filter((s) => !s.available);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
          <span className="text-3xl">🌎</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Au Pair Go</h1>
            <p className="text-xs text-gray-500">Tu guía inteligente en EE.UU.</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Hola! ¿En qué te puedo ayudar hoy?
          </h2>
          <p className="text-gray-500 text-sm">
            Selecciona un tema y chatea con nuestra IA especializada en la vida de au pairs hispanohablantes.
          </p>
        </div>

        {/* Available sections */}
        <div className="space-y-3 mb-8">
          {availableSections.map((section) => (
            <Link
              key={section.id}
              href={`/sections/${section.id}`}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group"
            >
              <span className="text-3xl">{section.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                  {section.label}
                </h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <span className="text-gray-400 group-hover:text-rose-400 transition-colors">→</span>
            </Link>
          ))}
        </div>

        {/* Coming soon sections */}
        {comingSoonSections.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Próximamente
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {comingSoonSections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3 opacity-60"
                >
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <p className="font-medium text-gray-600 text-sm">{section.label}</p>
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Próximamente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            🔒 Tu información se guarda solo en tu dispositivo. 30 consultas gratuitas a la IA.
          </p>
        </div>
      </div>
    </main>
  );
}
