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
}
