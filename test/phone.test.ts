import { describe, it, expect } from "vitest";
import { normalizePhone, isValidPhone, egyptianOperator, toLatinDigits } from "../src/phone.js";

describe("normalizePhone (EG)", () => {
  it("normalizes a plain national number", () => {
    expect(normalizePhone("01012345678")).toBe("+201012345678");
  });
  it("accepts +20 and 0020 forms", () => {
    expect(normalizePhone("+20 101 234 5678")).toBe("+201012345678");
    expect(normalizePhone("00201012345678")).toBe("+201012345678");
  });
  it("accepts Arabic-Indic digits", () => {
    expect(normalizePhone("٠١٠١٢٣٤٥٦٧٨")).toBe("+201012345678");
  });
  it("rejects wrong prefixes and lengths", () => {
    expect(normalizePhone("01312345678")).toBeNull();
    expect(normalizePhone("0101234567")).toBeNull();
    expect(isValidPhone("01012345678")).toBe(true);
  });
});

describe("egyptianOperator", () => {
  it("detects operators by prefix", () => {
    expect(egyptianOperator("01012345678")).toBe("Vodafone");
    expect(egyptianOperator("01112345678")).toBe("Etisalat");
    expect(egyptianOperator("01212345678")).toBe("Orange");
    expect(egyptianOperator("01512345678")).toBe("WE");
  });
});

describe("toLatinDigits", () => {
  it("converts both Arabic digit blocks", () => {
    expect(toLatinDigits("١٢٣۴۵۶")).toBe("123456");
  });
});
