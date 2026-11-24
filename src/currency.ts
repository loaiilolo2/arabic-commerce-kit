/**
 * Money helpers: formatting prices the way Arab customers read them,
 * and parsing the messy price strings merchants copy from suppliers.
 */
import { toLatinDigits } from "./phone.js";

export interface FormatPriceOptions {
  /** ISO-ish currency code shown after the amount. Default "EGP". */
  currency?: string;
  /** Arabic label for the currency, e.g. "جنيه". Used when locale is Arabic. */
  currencyLabelAr?: string;
  /** "ar" renders Arabic-Indic digits (١٢٣) and the Arabic label. Default "en". */
  locale?: "ar" | "en";
  /** Fraction digits. Default 2, trimmed when the value is a whole number. */
  decimals?: number;
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicDigits(input: string): string {
  return input.replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** Format a numeric amount, e.g. formatPrice(1250.5) -> "1,250.50 EGP". */
export function formatPrice(amount: number, options: FormatPriceOptions = {}): string {
  const { currency = "EGP", currencyLabelAr = "جنيه", locale = "en", decimals = 2 } = options;
  if (!Number.isFinite(amount)) throw new Error("formatPrice: amount must be a finite number");
  const fixed = amount.toFixed(decimals);
  const [intPart, fracRaw] = fixed.split(".");
  const fracPart = fracRaw && /^0+$/.test(fracRaw) ? "" : fracRaw;
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const plain = fracPart ? `${grouped}.${fracPart}` : grouped;
  if (locale === "ar") {
    return `${toArabicDigits(plain.replace(/,/g, "٬"))} ${currencyLabelAr}`;
  }
  return `${plain} ${currency}`;
}

/**
 * Parse a price typed by a human: "١٢٥٠ جنيه", "1,250.50", "EGP 900", "900ج".
 * Returns the numeric value, or null when no number is present.
 */
export function parsePrice(input: string): number | null {
  const latin = toLatinDigits(input).replace(/[,٬\s]/g, "");
  const match = latin.match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

/** COD order totals: items minus a percentage or fixed discount, plus shipping. */
export function orderTotals(
  items: { price: number; qty: number }[],
  options: { discountPercent?: number; discountFixed?: number; shipping?: number } = {},
): OrderTotals {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const percentDiscount = options.discountPercent ? (subtotal * options.discountPercent) / 100 : 0;
  const discount = Math.min(subtotal, percentDiscount + (options.discountFixed ?? 0));
  const shipping = options.shipping ?? 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return { subtotal: round2(subtotal), discount: round2(discount), shipping: round2(shipping), total: round2(total) };
}
