copilot/au-pair-go-mvp-structure
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
import { sections, getSectionById } from "@/lib/sections/sections";

describe("sections", () => {
  it("has at least 3 available sections", () => {
    const available = sections.filter((s) => s.available);
    expect(available.length).toBeGreaterThanOrEqual(3);
  });

  it("includes toddler, dmv, and aupair sections", () => {
    const ids = sections.map((s) => s.id);
    expect(ids).toContain("toddler");
    expect(ids).toContain("dmv");
    expect(ids).toContain("aupair");
main
  });

  it("all sections have required fields", () => {
    sections.forEach((section) => {
      expect(section.id).toBeTruthy();
 copilot/au-pair-go-mvp-structure
      expect(section.label).toBeTruthy();
      expect(section.description).toBeTruthy();
      expect(section.icon).toBeTruthy();
      expect(typeof section.available).toBe("boolean");
    });
  });
      expect(section.title).toBeTruthy();
      expect(section.description).toBeTruthy();
      expect(section.icon).toBeTruthy();
      expect(typeof section.available).toBe("boolean");
      expect(section.color).toBeTruthy();
    });
  });

  it("toddler, dmv, and aupair sections are available", () => {
    const toddler = getSectionById("toddler");
    const dmv = getSectionById("dmv");
    const aupair = getSectionById("aupair");
    expect(toddler?.available).toBe(true);
    expect(dmv?.available).toBe(true);
    expect(aupair?.available).toBe(true);
  });
});

describe("getSectionById", () => {
  it("returns correct section", () => {
    const section = getSectionById("toddler");
    expect(section).toBeDefined();
    expect(section?.id).toBe("toddler");
  });

  it("returns undefined for nonexistent section", () => {
    const section = getSectionById("nonexistent");
    expect(section).toBeUndefined();
  });
 main
});
