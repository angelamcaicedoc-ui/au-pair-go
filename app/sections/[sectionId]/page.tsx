 copilot/au-pair-go-mvp-structure
import { getSectionById } from "@/lib/sections/sections";
import { getSectionContent } from "@/lib/contentLoader";
import { SectionClient } from "@/components/SectionClient";
import { notFound } from "next/navigation";

interface SectionPageProps {
  params: Promise<{ sectionId: string }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { sectionId } = await params;
  const section = getSectionById(sectionId);

  if (!section) {
    notFound();
  }

  if (!section.available) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white flex items-center justify-center">
        <div className="text-center px-6">
          <span className="text-5xl mb-4 block">{section.icon}</span>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">{section.label}</h1>
          <p className="text-gray-500 mb-6">{section.description}</p>
          <div className="bg-amber-100 text-amber-800 rounded-2xl px-6 py-4 text-sm font-medium inline-block mb-6">
            🚧 Próximamente disponible
          </div>
          <br />
          <a href="/" className="text-rose-500 hover:text-rose-600 text-sm">
            ← Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  const sectionContent = await getSectionContent(sectionId);

  return (
    <SectionClient
      sectionId={sectionId}
      sectionLabel={section.label}
      sectionIcon={section.icon}
      sectionDescription={section.description}
      sectionContent={sectionContent}
    />
  );
=======
import { notFound } from "next/navigation";
import { getSectionById, sections } from "@/lib/sections/sections";
import SectionPageClient from "./SectionPageClient";

interface Props {
  params: Promise<{ sectionId: string }>;
}

export function generateStaticParams() {
  return sections
    .filter((s) => s.available)
    .map((s) => ({ sectionId: s.id }));
}

export async function generateMetadata({ params }: Props) {
  const { sectionId } = await params;
  const section = getSectionById(sectionId);
  if (!section) return {};
  return {
    title: `${section.title} — Au Pair Go`,
    description: section.description,
  };
}

export default async function SectionPage({ params }: Props) {
  const { sectionId } = await params;
  const section = getSectionById(sectionId);

  if (!section || !section.available) {
    notFound();
  }

  return <SectionPageClient section={section} />;
 main
}
