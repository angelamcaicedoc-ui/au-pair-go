export interface Section {
  id: string;
 copilot/au-pair-go-mvp-structure
  label: string;
  description: string;
  icon: string;
  available: boolean;

  title: string;
  description: string;
  icon: string;
  available: boolean;
  color: string;
 main
}

export const sections: Section[] = [
  {
 copilot/au-pair-go-mvp-structure
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

    id: "toddler",
    title: "Cuidado de Niños",
    description:
      "Tips de desarrollo infantil, actividades, manejo de berrinches, primeros auxilios y más.",
    icon: "👶",
    available: true,
    color: "bg-pink-50 border-pink-200",
  },
  {
    id: "dmv",
    title: "DMV & Conducción",
    description:
      "Guía para obtener tu licencia de conducir en EE.UU., reglas de tráfico y consejos prácticos.",
    icon: "🚗",
    available: true,
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "aupair",
    title: "Programa Au Pair",
    description:
      "Todo sobre el programa: visa, agencias, derechos, deberes, extensiones y más.",
    icon: "🌟",
    available: true,
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: "vida-diaria",
    title: "Vida Diaria",
    description: "Grocery shopping, transporte, salud, bancos y vida cotidiana en EE.UU.",
    icon: "🏠",
    available: false,
    color: "bg-green-50 border-green-200",
  },
  {
    id: "cultura",
    title: "Cultura & Adaptación",
    description:
      "Ajuste cultural, inglés práctico, relaciones con la host family y comunidad hispana.",
    icon: "🌎",
    available: false,
    color: "bg-purple-50 border-purple-200",
  },
  {
    id: "recomendaciones",
    title: "Recomendaciones",
    description: "Lugares cerca de ti: parques, bibliotecas, restaurantes y más.",
    icon: "📍",
    available: false,
    color: "bg-orange-50 border-orange-200",
 main
  },
];

export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}
 copilot/au-pair-go-mvp-structure

export function getAvailableSections(): Section[] {
  return sections.filter((s) => s.available);
}
=======
 main
