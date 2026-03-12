import { getSectionById, getAvailableSections, sections } from "@/lib/sections/sections";

describe("sections", () => {
  it("has exactly 3 available sections", () => {
    const available = getAvailableSections();
    expect(available).toHaveLength(3);
  });

  it("available sections include the 3 MVP sections", () => {
    const ids = getAvailableSections().map((s) => s.id);
    expect(ids).toContain("toddler-kids-care");
    expect(ids).toContain("dmv-driving");
    expect(ids).toContain("au-pair-program");
  });

  it("getSectionById returns correct section", () => {
    const section = getSectionById("dmv-driving");
    expect(section).toBeDefined();
    expect(section?.label).toBe("DMV y Manejo");
    expect(section?.available).toBe(true);
  });

  it("getSectionById returns undefined for unknown section", () => {
    const section = getSectionById("unknown-section");
    expect(section).toBeUndefined();
  });

  it("coming soon sections exist", () => {
    const unavailable = sections.filter((s) => !s.available);
    expect(unavailable.length).toBeGreaterThan(0);
  });

  it("all sections have required fields", () => {
    sections.forEach((section) => {
      expect(section.id).toBeTruthy();
      expect(section.label).toBeTruthy();
      expect(section.description).toBeTruthy();
      expect(section.icon).toBeTruthy();
      expect(typeof section.available).toBe("boolean");
    });
  });
});
