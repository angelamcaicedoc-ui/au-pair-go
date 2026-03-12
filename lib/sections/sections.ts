export interface Section {
  id: string;
  label: string;
  description: string;
  icon: string;
  available: boolean;
}

export const sections: Section[] = [
  {
    id: "toddler-kids-care",
    label: "Cuidado de Niños",
    description: "Rutinas, actividades, seguridad y tips prácticos para el cuidado de niños pequeños.",
    icon: "🧒",
    available: true,
  },
  {
    id: "dmv-driving",
    label: "DMV y Manejo",
    description: "Guía paso a paso para licencia de conducir, trámites de la DMV y manejo seguro.",
    icon: "🚗",
    available: true,
  },
  {
    id: "au-pair-program",
    label: "Programa Au Pair",
    description: "Todo sobre el programa au pair: reglas, derechos, host families, agencias y renovación.",
    icon: "🌟",
    available: true,
  },
  {
    id: "daily-life",
    label: "Vida Diaria",
    description: "Consejos para adaptarte a la vida en EE.UU.: compras, transporte, salud y más.",
    icon: "🏠",
    available: false,
  },
  {
    id: "culture",
    label: "Cultura Americana",
    description: "Entiende las costumbres, el idioma y la cultura estadounidense.",
    icon: "🇺🇸",
    available: false,
  },
  {
    id: "health",
    label: "Salud y Bienestar",
    description: "Cómo acceder a servicios médicos, seguros y cuidado personal.",
    icon: "❤️",
    available: false,
  },
];

export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

export function getAvailableSections(): Section[] {
  return sections.filter((s) => s.available);
}
