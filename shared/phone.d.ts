/**
 * Types for the shared phone helpers. The implementation lives in phone.js so
 * that the Express server (plain ESM, no build step) and the Vite/TS frontend
 * can both import the exact same normalisation — the number the form promises
 * to dial must be the number the server dials.
 */

export declare function isE164(phone: unknown): boolean;

export declare function toE164(
  raw: unknown,
  defaultCountryCode?: string
): string | null;

export declare function countryCodeOf(e164: unknown): string | null;
