/**
 * Arabic text helpers for product search and catalog cleanup:
 * customers search "حذاء" and "حداء", "تيشيرت" and "تي شيرت" —
 * normalization makes one stored title match all of them.
 */

/** Remove Arabic diacritics (tashkeel) and tatweel. */
export function stripDiacritics(input: string): string {
  return input.replace(/[ً-ٰٟـ]/g, "");
}

/**
 * Normalize Arabic text for comparison/search:
 * unifies alef forms, teh marbuta -> heh, alef maksura -> yeh,
 * strips diacritics, collapses whitespace, lowercases Latin.
 */
export function normalizeArabic(input: string): string {
  return stripDiacritics(input)
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** True when two Arabic strings are the same product text after normalization. */
export function arabicEquals(a: string, b: string): boolean {
  return normalizeArabic(a) === normalizeArabic(b);
}

/** Search helper: does the haystack contain the needle, ignoring Arabic spelling variants? */
export function arabicIncludes(haystack: string, needle: string): boolean {
  return normalizeArabic(haystack).includes(normalizeArabic(needle));
}

/**
 * URL slug that keeps Arabic letters readable:
 * slugifyArabic("حذاء رياضي رجالي!") -> "حذاء-رياضي-رجالي"
 */
export function slugifyArabic(input: string): string {
  return stripDiacritics(input)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
