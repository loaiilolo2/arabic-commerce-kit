import { describe, it, expect } from "vitest";
import { formatPrice, parsePrice, orderTotals, toArabicDigits } from "../src/currency.js";

describe("formatPrice", () => {
  it("formats with grouping and trims whole numbers", () => {
    expect(formatPrice(1250)).toBe("1,250 EGP");
    expect(formatPrice(1250.5)).toBe("1,250.50 EGP");
  });
  it("formats Arabic locale with Arabic-Indic digits", () => {
    expect(formatPrice(900, { locale: "ar" })).toBe("٩٠٠ جنيه");
  });
});

describe("parsePrice", () => {
  it("parses messy human input", () => {
    expect(parsePrice("١٢٥٠ جنيه")).toBe(1250);
    expect(parsePrice("1,250.50")).toBe(1250.5);
    expect(parsePrice("EGP 900")).toBe(900);
    expect(parsePrice("لا يوجد سعر")).toBeNull();
  });
});

describe("orderTotals", () => {
  it("applies discount and shipping", () => {
    const t = orderTotals(
      [
        { price: 500, qty: 2 },
        { price: 200, qty: 1 },
      ],
      { discountPercent: 10, shipping: 60 },
    );
    expect(t.subtotal).toBe(1200);
    expect(t.discount).toBe(120);
    expect(t.total).toBe(1140);
  });
});

describe("toArabicDigits", () => {
  it("converts digits", () => {
    expect(toArabicDigits("2026")).toBe("٢٠٢٦");
  });
});
