"use client";

import Link from "next/link";
import { Section } from "@/lib/sections/sections";

interface SectionCardProps {
  section: Section;
}

export default function SectionCard({ section }: SectionCardProps) {
  return (
    <div
      className={`relative rounded-2xl border-2 p-5 transition-all duration-200 ${section.color} ${
        section.available
          ? "hover:shadow-md cursor-pointer"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      {section.available ? (
        <Link href={`/sections/${section.id}`} className="block">
          <div className="text-3xl mb-3">{section.icon}</div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">{section.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
          <div className="mt-3 text-sm font-medium text-blue-600">
            Explorar →
          </div>
        </Link>
      ) : (
        <div>
          <div className="text-3xl mb-3">{section.icon}</div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">{section.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
          <div className="mt-3">
            <span className="inline-block bg-gray-200 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
              Próximamente
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
