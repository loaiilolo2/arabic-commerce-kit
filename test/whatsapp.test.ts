import { describe, it, expect } from "vitest";
import { buildOrderMessage, buildWhatsAppOrderLink } from "../src/whatsapp.js";

const items = [
  { name: "حذاء رياضي", price: 850, qty: 1 },
  { name: "شراب قطن", price: 75, qty: 2 },
];

describe("buildOrderMessage", () => {
  it("contains items and the grand total", () => {
    const msg = buildOrderMessage(items, { storeName: "متجر النور", shipping: 50 });
    expect(msg).toContain("حذاء رياضي");
    expect(msg).toContain("الإجمالي");
    expect(msg).toContain("عند الاستلام");
  });
});

describe("buildWhatsAppOrderLink", () => {
  it("builds a wa.me link with encoded text", () => {
    const link = buildWhatsAppOrderLink("01069559310", items);
    expect(link.startsWith("https://wa.me/201069559310?text=")).toBe(true);
  });
  it("throws on an invalid merchant number", () => {
    expect(() => buildWhatsAppOrderLink("123", items)).toThrow();
  });
});
