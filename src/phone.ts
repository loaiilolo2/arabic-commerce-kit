/**
 * Phone number helpers for Egypt and common Arab markets.
 * Focus: numbers a COD merchant actually receives from customers —
 * typed in Arabic-Indic digits, with spaces, starting with 0, +20, or 0020.
 */

export interface CountryRule {
  /** International dialing code without "+", e.g. "20" for Egypt. */
  dialCode: string;
  /** Length of the national number including the trunk 0, e.g. 11 for Egypt. */
  nationalLength: number;
  /** Regex the national number (with trunk 0) must match. */
  pattern: RegExp;
}

export const COUNTRY_RULES: Record<string, CountryRule> = {
  EG: { dialCode: "20", nationalLength: 11, pattern: /^01[0125]\d{8}$/ },
  SA: { dialCode: "966", nationalLength: 10, pattern: /^05\d{8}$/ },
  AE: { dialCode: "971", nationalLength: 10, pattern: /^05\d{8}$/ },
  KW: { dialCode: "965", nationalLength: 8, pattern: /^[569]\d{7}$/ },
  JO: { dialCode: "962", nationalLength: 10, pattern: /^07[789]\d{7}$/ },
};

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EASTERN_ARABIC_INDIC = "۰۱۲۳۴۵۶۷۸۹";

/** Convert Arabic-Indic / Eastern Arabic-Indic digits in a string to Latin digits. */
export function toLatinDigits(input: string): string {
  return input.replace(/[٠-٩۰-۹]/g, (ch) => {
    const a = ARABIC_INDIC.indexOf(ch);
    if (a >= 0) return String(a);
    return String(EASTERN_ARABIC_INDIC.indexOf(ch));
  });
}

/** Strip everything except digits and a leading "+". */
export function cleanPhone(input: string): string {
  const latin = toLatinDigits(input).trim();
  const digits = latin.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? "+" + digits.slice(1).replace(/\+/g, "") : digits.replace(/\+/g, "");
}

/**
 * Normalize a phone number to E.164 format (e.g. "+201012345678").
 * Returns null when the number cannot be normalized for the given country.
 */
export function normalizePhone(input: string, country: keyof typeof COUNTRY_RULES = "EG"): string | null {
  const rule = COUNTRY_RULES[country];
  if (!rule) return null;
  let n = cleanPhone(input);
  if (n.startsWith("+")) n = n.slice(1);
  if (n.startsWith("00")) n = n.slice(2);
  // International form without "+": dial code + national number without trunk 0.
  if (n.startsWith(rule.dialCode) && n.length === rule.dialCode.length + rule.nationalLength - 1) {
    const national = "0" + n.slice(rule.dialCode.length);
    return rule.pattern.test(national) ? "+" + rule.dialCode + national.slice(1) : null;
  }
  // Plain national form.
  if (n.length === rule.nationalLength && rule.pattern.test(n)) {
    return "+" + rule.dialCode + n.slice(1);
  }
  return null;
}

/** True when the number is a valid mobile for the given country. */
export function isValidPhone(input: string, country: keyof typeof COUNTRY_RULES = "EG"): boolean {
  return normalizePhone(input, country) !== null;
}

/** Egyptian mobile operator from the prefix. Returns null for non-Egyptian/invalid numbers. */
export function egyptianOperator(input: string): "Vodafone" | "Orange" | "Etisalat" | "WE" | null {
  const e164 = normalizePhone(input, "EG");
  if (!e164) return null;
  const national = "0" + e164.slice(3); // back to the 01x national form
  const prefix = national.slice(0, 3);
  switch (prefix) {
    case "010":
      return "Vodafone";
    case "011":
      return "Etisalat";
    case "012":
      return "Orange";
    case "015":
      return "WE";
    default:
      return null;
  }
}
