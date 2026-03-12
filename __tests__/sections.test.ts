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
  });

  it("all sections have required fields", () => {
    sections.forEach((section) => {
      expect(section.id).toBeTruthy();
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
});
