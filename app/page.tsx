import { sections } from "@/lib/sections/sections";
import SectionCard from "@/components/SectionCard";
import Image from "next/image";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["700"] });

export default function Home() {
  const availableSections = sections.filter((s) => s.available);
  const comingSoonSections = sections.filter((s) => !s.available);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#9FD7E8]/40 via-blue-50/50 to-[#B19CD9]/30">


      <div className="max-w-4xl mx-auto px-5 py-12 relative">
        {/* Burbujas decorativas de fondo */}
        <div className="absolute top-10 left-0 w-64 h-64 bg-[#9FD7E8]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-[#B19CD9]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#BA9F6B]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Hero */}
        <section className="text-center py-12 mb-10 relative">
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-[#9FD7E8]/10 rounded-3xl p-8 md:p-12 mx-auto max-w-2xl transform transition-all hover:shadow-2xl hover:shadow-[#B19CD9]/10">
            <h1 className={`${quicksand.className} text-4xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight`}>
              Bienvenida a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ccae0] via-[#B19CD9] to-[#a692cd]">Au Pair Go</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium mt-2">
              Tu asistente inteligente y especializada en el mundo au pair en Estados Unidos.
              <span className="block mt-1 font-semibold text-[#B19CD9]">Siempre contigo, siempre disponible.</span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
              <span className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-50 to-[#9FD7E8]/20 text-blue-800/80 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-[#9FD7E8]/40 shadow-sm backdrop-blur-md">
                ✨ IA Experta
              </span>
              <span className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-50 to-[#BA9F6B]/20 text-[#9e8351] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-[#BA9F6B]/40 shadow-sm backdrop-blur-md">
                📍 Info Local
              </span>
              <span className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-50 to-[#B19CD9]/20 text-purple-800/80 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-[#B19CD9]/40 shadow-sm backdrop-blur-md">
                📝 Guías Prácticas
              </span>
            </div>
          </div>
        </section>

        {/* Secciones Disponibles */}
        <section className="relative z-10 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`${quicksand.className} text-2xl md:text-3xl font-bold text-gray-800`}>
              ¿A dónde vamos <span className="text-[#B19CD9]">hoy?</span>
            </h2>
            <div className="h-[2px] w-12 md:w-24 bg-gradient-to-r from-[#9FD7E8] to-[#B19CD9] rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        {comingSoonSections.length > 0 && (
          <section className="mt-16 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <h3 className={`${quicksand.className} text-sm font-bold text-gray-400 uppercase tracking-widest bg-white/50 px-4 py-1 rounded-full backdrop-blur-md border border-white/40`}>
                Próximamente
              </h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-80">
              {comingSoonSections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center gap-4 bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl p-4 transition-all hover:bg-white/60"
                >
                  <div className="w-12 h-12 bg-gray-100/50 rounded-xl flex items-center justify-center text-2xl grayscale border border-white/60">
                    {section.icon}
                  </div>
                  <div>
                    <p className={`${quicksand.className} font-bold text-gray-600 text-[15px]`}>
                      {section.label}
                    </p>
                    <span className="text-[10px] font-bold text-amber-700/70 bg-amber-100/50 uppercase tracking-wide px-2 py-0.5 rounded-md mt-1 inline-block">
                      En construcción
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Info banner - Freemium */}
        <section className="mt-20 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9FD7E8]/30 via-white/80 to-[#B19CD9]/30 backdrop-blur-xl rounded-3xl"></div>
          <div className="relative border border-white/60 shadow-lg shadow-blue-900/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl flex-shrink-0 border border-t-[3px] border-t-[#B19CD9] border-gray-100">
              🎁
            </div>
            <div>
              <h3 className={`${quicksand.className} font-bold text-gray-800 text-xl md:text-2xl mb-2 text-center md:text-left`}>
                ¡Tienes <span className="text-[#B19CD9]">30 mensajes gratis</span> para empezar!
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed text-center md:text-left text-sm md:text-base">
                Prueba <strong>Au Pair Go</strong> sin compromisos. Habla con nuestra IA experta sobre tus dudas del
                tráfico, preguntas sobre niños, o las reglas del programa.
                <span className="block mt-2 text-gray-500 font-normal italic">
                  Tu progreso y perfil se guardan de forma segura solo en tu dispositivo móvil.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mt-8 mb-12 relative z-10">
          <div className="bg-white/30 backdrop-blur-md border border-[#BA9F6B]/30 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[#a58957] text-xs md:text-sm font-medium leading-relaxed">
              <span className="text-xl inline-block mb-1">⚠️</span>
              <br />
              <strong>Importante:</strong> Au Pair Go proporciona información de apoyo basada en IA.
              <strong> Nunca reemplaza el consejo de tu agencia (LCC), un médico, o asistencia legal.</strong>
              <br />
              En caso de emergencia médica, policiaca o de fuego, llama inmediatamente al <strong className="bg-[#BA9F6B]/20 px-1 rounded text-red-700 font-bold">911</strong>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
