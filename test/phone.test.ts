import { describe, it, expect } from "vitest";
import { normalizePhone, isValidPhone, egyptianOperator, toLatinDigits } from "../src/phone.js";

describe("normalizePhone (EG)", () => {
  it("normalizes a plain national number", () => {
    expect(normalizePhone("01069559310")).toBe("+201069559310");
  });
  it("accepts +20 and 0020 forms", () => {
    expect(normalizePhone("+20 106 955 9310")).toBe("+201069559310");
    expect(normalizePhone("00201069559310")).toBe("+201069559310");
  });
  it("accepts Arabic-Indic digits", () => {
    expect(normalizePhone("٠١٠٦٩٥٥٩٣١٠")).toBe("+201069559310");
  });
  it("rejects wrong prefixes and lengths", () => {
    expect(normalizePhone("01369559310")).toBeNull();
    expect(normalizePhone("0106955931")).toBeNull();
    expect(isValidPhone("01069559310")).toBe(true);
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
