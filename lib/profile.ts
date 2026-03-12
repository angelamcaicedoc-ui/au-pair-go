export interface UserProfile {
  estado: string;
  ciudad: string;
  codigoPostal: string;
  edadesNinos: string;
  alergias: string;
  conduce: boolean;
  nivelIngles: "basico" | "intermedio" | "avanzado";
}

export const defaultProfile: UserProfile = {
  estado: "",
  ciudad: "",
  codigoPostal: "",
  edadesNinos: "",
  alergias: "",
  conduce: false,
  nivelIngles: "intermedio",
};

export function buildProfileContext(profile: UserProfile): string {
  const parts: string[] = [];
  if (profile.estado) parts.push(`Estado: ${profile.estado}`);
  if (profile.ciudad) parts.push(`Ciudad: ${profile.ciudad}`);
  if (profile.codigoPostal) parts.push(`Código postal: ${profile.codigoPostal}`);
  if (profile.edadesNinos) parts.push(`Edades de los niños: ${profile.edadesNinos}`);
  if (profile.alergias) parts.push(`Alergias conocidas: ${profile.alergias}`);
  parts.push(`Conduce: ${profile.conduce ? "Sí" : "No"}`);
  parts.push(`Nivel de inglés: ${profile.nivelIngles}`);
  return parts.length > 0 ? `\n\n## Perfil del usuario\n${parts.join("\n")}` : "";
}
