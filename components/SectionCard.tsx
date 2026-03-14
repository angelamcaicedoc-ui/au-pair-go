"use client";

import Link from "next/link";
import { Section } from "@/lib/sections/sections";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["700"] });

interface SectionCardProps {
  section: Section;
}

export default function SectionCard({ section }: SectionCardProps) {
  return (
    <div
      className={`relative rounded-3xl p-[1px] transition-all duration-300 ${section.available
          ? "hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B19CD9]/20 cursor-pointer bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/50"
          : "opacity-70 cursor-not-allowed bg-white/40 backdrop-blur-sm border border-white/30"
        }`}
    >
      <div className="bg-white/60 rounded-[23px] h-full p-6 flex flex-col justify-between">
        {section.available ? (
          <Link href={`/sections/${section.id}`} className="block h-full group">
            <div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#9FD7E8]/30 to-[#B19CD9]/20 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm border border-white mb-5 transition-transform group-hover:scale-110 duration-300">
                {section.icon}
              </div>
              <h3 className={`${quicksand.className} font-bold text-gray-800 text-xl mb-2`}>
                {section.title || section.label}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {section.description}
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-bold text-[#B19CD9] group-hover:text-[#9c82c9] transition-colors">
              Explorar <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ) : (
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-gray-100/50 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/40 mb-5 grayscale">
                {section.icon}
              </div>
              <h3 className={`${quicksand.className} font-bold text-gray-700 text-xl mb-2`}>
                {section.title || section.label}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {section.description}
              </p>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center bg-gray-200/80 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-300/30">
                ⏳ Próximamente
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
