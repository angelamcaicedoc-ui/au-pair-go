import { buildProfileContext, defaultProfile, UserProfile } from "@/lib/profile";

describe("buildProfileContext", () => {
  it("returns empty string for empty profile", () => {
    const result = buildProfileContext(defaultProfile);
    // Should still include conduce and nivelIngles
    expect(result).toContain("Conduce:");
    expect(result).toContain("Nivel de inglés:");
  });

  it("includes state when provided", () => {
    const profile: UserProfile = { ...defaultProfile, estado: "California" };
    const result = buildProfileContext(profile);
    expect(result).toContain("Estado: California");
  });

  it("includes city when provided", () => {
    const profile: UserProfile = { ...defaultProfile, ciudad: "Los Angeles" };
    const result = buildProfileContext(profile);
    expect(result).toContain("Ciudad: Los Angeles");
  });

  it("includes allergies when provided", () => {
    const profile: UserProfile = { ...defaultProfile, alergias: "maní, gluten" };
    const result = buildProfileContext(profile);
    expect(result).toContain("Alergias conocidas: maní, gluten");
  });

  it("shows conduce correctly", () => {
    const withCar: UserProfile = { ...defaultProfile, conduce: true };
    const withoutCar: UserProfile = { ...defaultProfile, conduce: false };
    expect(buildProfileContext(withCar)).toContain("Conduce: Sí");
    expect(buildProfileContext(withoutCar)).toContain("Conduce: No");
  });

  it("includes all fields for complete profile", () => {
    const profile: UserProfile = {
      estado: "New York",
      ciudad: "Brooklyn",
      codigoPostal: "11201",
      edadesNinos: "2 años, 5 años",
      alergias: "maní",
      conduce: true,
      nivelIngles: "avanzado",
    };
    const result = buildProfileContext(profile);
    expect(result).toContain("New York");
    expect(result).toContain("Brooklyn");
    expect(result).toContain("11201");
    expect(result).toContain("2 años, 5 años");
    expect(result).toContain("maní");
    expect(result).toContain("Sí");
    expect(result).toContain("avanzado");
  });
});
