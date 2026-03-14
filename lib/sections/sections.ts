export interface Section {
  id: string;
  label: string;
  icon: string;
  description: string;
  available: boolean;
}

export const sections: Section[] = [
  {
    id: "cuidado-ninos",
    label: "Cuidado de niños",
    icon: "🧸",
    description: "Recursos y consejos para el cuidado infantil como au pair.",
    available: true,
  },
  {
    id: "dmv",
    label: "Trámites DMV",
    icon: "🚗",
    description: "Guía para sacar licencia de conducción y trámites en el DMV.",
    available: true,
  },
  {
    id: "viajes",
    label: "Viajes y vacaciones",
    icon: "✈️",
    description: "Tips para viajar como au pair en EE.UU.",
    available: false,
  },
];

export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}
