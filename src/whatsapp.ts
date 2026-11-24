/**
 * WhatsApp order links: turn a cart into a ready-to-send wa.me link
 * with a clear Arabic order summary — the flow COD merchants use daily.
 */
import { normalizePhone } from "./phone.js";
import { formatPrice, orderTotals } from "./currency.js";

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface BuildOrderOptions {
  storeName?: string;
  shipping?: number;
  discountPercent?: number;
  customerNote?: string;
  /** Shown in the message, e.g. "الدفع عند الاستلام". */
  paymentLabel?: string;
}

/** Build the Arabic order summary message (plain text, WhatsApp-ready). */
export function buildOrderMessage(items: OrderItem[], options: BuildOrderOptions = {}): string {
  const totals = orderTotals(items, {
    shipping: options.shipping,
    discountPercent: options.discountPercent,
  });
  const lines: string[] = [];
  lines.push(options.storeName ? `طلب جديد — ${options.storeName}` : "طلب جديد");
  lines.push("--------------------------");
  for (const it of items) {
    lines.push(`• ${it.name} × ${it.qty} = ${formatPrice(it.price * it.qty, { locale: "ar" })}`);
  }
  lines.push("--------------------------");
  if (totals.discount > 0) lines.push(`خصم: ${formatPrice(totals.discount, { locale: "ar" })}`);
  if (totals.shipping > 0) lines.push(`شحن: ${formatPrice(totals.shipping, { locale: "ar" })}`);
  lines.push(`الإجمالي: ${formatPrice(totals.total, { locale: "ar" })}`);
  lines.push(`الدفع: ${options.paymentLabel ?? "عند الاستلام"}`);
  if (options.customerNote) lines.push(`ملحوظة: ${options.customerNote}`);
  return lines.join("\n");
}

/**
 * Build a wa.me link for the merchant's number with the order prefilled.
 * Throws when the merchant number is not a valid Egyptian mobile.
 */
export function buildWhatsAppOrderLink(
  merchantPhone: string,
  items: OrderItem[],
  options: BuildOrderOptions = {},
): string {
  const e164 = normalizePhone(merchantPhone, "EG");
  if (!e164) throw new Error(`buildWhatsAppOrderLink: invalid Egyptian phone: ${merchantPhone}`);
  const text = encodeURIComponent(buildOrderMessage(items, options));
  return `https://wa.me/${e164.slice(1)}?text=${text}`;
}
