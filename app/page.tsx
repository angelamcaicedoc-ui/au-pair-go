import { sections } from "@/lib/sections/sections";
import SectionCard from "@/components/SectionCard";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center py-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          ✨ Bienvenida a <span className="text-blue-600">Au Pair Go</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
          Tu asistente inteligente especializada en el mundo au pair en EE.UU.
          Todo en español, siempre disponible.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
            🤖 IA Experta por sección
          </span>
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full">
            📍 Recomendaciones locales
          </span>
          <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-sm px-3 py-1 rounded-full">
            ✅ Guías y checklists
          </span>
        </div>
      </section>

      {/* Sections */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">¿Qué necesitas hoy?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </section>

      {/* Info banner */}
      <section className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-800 text-lg mb-2">
          🌟 30 mensajes gratis para empezar
        </h3>
        <p className="text-blue-700 text-sm leading-relaxed">
          Prueba Au Pair Go sin compromisos. Tienes <strong>30 mensajes gratuitos</strong> para
          chatear con nuestra IA experta. Después, suscríbete para acceso ilimitado y funciones
          premium.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-amber-800 text-xs leading-relaxed">
          ⚠️ <strong>Aviso:</strong> Au Pair Go proporciona información orientativa y de apoyo. No
          reemplaza el consejo de tu agencia, un médico, o un abogado. En caso de emergencia,
          siempre llama al <strong>911</strong>.
        </p>
      </section>
    </div>
  );
}
