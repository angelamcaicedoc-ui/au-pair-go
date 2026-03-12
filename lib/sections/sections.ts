export interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
  color: string;
}

export const sections: Section[] = [
  {
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
  },
];

export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}
