/**
 * E.164 normalisation. Ported from the TSI Stock Brokers dashboard
 * (src/lib/utils.ts), generalised to honour the country code the demo form's
 * dropdown supplies instead of assuming +91.
 */

const E164 = /^\+[1-9]\d{7,14}$/;

export function isE164(phone) {
  return E164.test(String(phone ?? "").trim());
}

/** Country codes the Demo form offers, longest-first so +971 wins over +97. */
const KNOWN_CODES = ["971", "91", "65", "44", "1"];

/**
 * Best-effort E.164 normalisation.
 *
 * `defaultCountryCode` comes from the form's dropdown, so a bare 10-digit
 * Indian mobile and a bare 9-digit UAE mobile both resolve correctly. A number
 * the user typed with its own `+` or `00` prefix always wins over the dropdown.
 *
 * Returns null when the input can't be made into a valid E.164 number.
 */
export function toE164(raw, defaultCountryCode = "91") {
  const cleaned = String(raw ?? "").trim().replace(/[\s()\-.]/g, "");
  if (!cleaned) return null;

  const cc = String(defaultCountryCode ?? "91").replace(/\D/g, "") || "91";

  let candidate;
  if (cleaned.startsWith("+")) {
    candidate = "+" + cleaned.slice(1).replace(/\D/g, "");
  } else {
    const digits = cleaned.replace(/\D/g, "");
    if (!digits) return null;

    if (digits.startsWith("00")) {
      candidate = "+" + digits.slice(2);
    } else if (digits.startsWith("0")) {
      // Trunk prefix — strip it and apply the selected country code.
      candidate = `+${cc}${digits.replace(/^0+/, "")}`;
    } else if (digits.startsWith(cc) && digits.length > cc.length + 5) {
      // Already carries its country code, just without the plus.
      candidate = "+" + digits;
    } else {
      candidate = `+${cc}${digits}`;
    }
  }

  return isE164(candidate) ? candidate : null;
}

/** Which of the known country codes a normalised number belongs to, if any. */
export function countryCodeOf(e164) {
  const digits = String(e164 ?? "").replace(/\D/g, "");
  return KNOWN_CODES.find((c) => digits.startsWith(c)) ?? null;
}
