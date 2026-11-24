# arabic-commerce-kit

**أدوات عملية للتجارة الإلكترونية العربية** — أرقام تليفونات، أسعار، طلبات واتساب، وبحث بالنص العربي.
مصممة أصلًا لاحتياجات تجار الدفع عند الاستلام (COD) في مصر والوطن العربي، وبدون أي مكتبات خارجية وقت التشغيل (zero runtime dependencies).

Practical utilities for Arabic e-commerce — phone numbers, prices, WhatsApp orders and Arabic text search — built for COD merchants in Egypt and the Arab world. Zero runtime dependencies, TypeScript-first.

## Install

```bash
npm install arabic-commerce-kit
```

## Features & examples

### Phone numbers — أرقام التليفونات

Customers type numbers in every possible way: Arabic digits, spaces, `+20`, `0020`. Normalize them all to E.164:

```ts
import { normalizePhone, egyptianOperator } from "arabic-commerce-kit";

normalizePhone("٠١٠١٢٣٤٥٦٧٨");        // "+201012345678"
normalizePhone("+20 101 234 5678");   // "+201012345678"
normalizePhone("01369559310");        // null (invalid prefix)
egyptianOperator("01012345678");      // "Vodafone"
```

Country rules included: Egypt, Saudi Arabia, UAE, Kuwait, Jordan.

### Prices — الأسعار

```ts
import { formatPrice, parsePrice, orderTotals } from "arabic-commerce-kit";

formatPrice(1250.5);                          // "1,250.50 EGP"
formatPrice(900, { locale: "ar" });           // "٩٠٠ جنيه"
parsePrice("١٢٥٠ جنيه");                      // 1250
orderTotals([{ price: 500, qty: 2 }], { shipping: 60 });
// { subtotal: 1000, discount: 0, shipping: 60, total: 1060 }
```

### WhatsApp orders — طلبات واتساب

Turn a cart into a ready-to-send `wa.me` link with a clear Arabic order summary:

```ts
import { buildWhatsAppOrderLink } from "arabic-commerce-kit";

const link = buildWhatsAppOrderLink("01012345678", [
  { name: "حذاء رياضي", price: 850, qty: 1 },
  { name: "شراب قطن", price: 75, qty: 2 },
], { storeName: "متجر النور", shipping: 50 });
```

The customer opens the link and gets this message prefilled:

```
طلب جديد — متجر النور
--------------------------
• حذاء رياضي × 1 = ٨٥٠ جنيه
• شراب قطن × 2 = ١٥٠ جنيه
--------------------------
شحن: ٥٠ جنيه
الإجمالي: ١٬٠٥٠ جنيه
الدفع: عند الاستلام
```

### Arabic text search — البحث بالنص العربي

One stored title should match every spelling a customer might type:

```ts
import { arabicIncludes, normalizeArabic, slugifyArabic } from "arabic-commerce-kit";

arabicIncludes("تيشيرت رجالي قطن", "رجالى");   // true (ى/ي unified)
normalizeArabic("حذاءٌ رياضى");               // "حذاء رياضي"
slugifyArabic("حذاء رياضي رجالي!");            // "حذاء-رياضي-رجالي"
```

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). New country rules, invoice helpers and real-world merchant edge cases are especially welcome.

## License

[MIT](LICENSE) © Louay Hesham
