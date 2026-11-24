import { describe, it, expect } from "vitest";
import { normalizeArabic, arabicEquals, arabicIncludes, slugifyArabic } from "../src/text.js";

describe("normalizeArabic", () => {
  it("unifies spelling variants", () => {
    expect(normalizeArabic("حذاءٌ رياضى")).toBe("حذاء رياضي");
    expect(normalizeArabic("إسلام")).toBe("اسلام");
  });
});

describe("arabicEquals / arabicIncludes", () => {
  it("matches across ة/ه and ى/ي variants", () => {
    expect(arabicEquals("مدرسة", "مدرسه")).toBe(true);
    expect(arabicIncludes("تيشيرت رجالي قطن", "رجالى")).toBe(true);
  });
});

describe("slugifyArabic", () => {
  it("keeps Arabic letters and dashes spaces", () => {
    expect(slugifyArabic("حذاء رياضي رجالي!")).toBe("حذاء-رياضي-رجالي");
  });
});
