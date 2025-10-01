// src/utils/phone.ts

/**
 * Normalize Indian mobile numbers to E.164 (+91XXXXXXXXXX).
 * Accepts inputs like:
 *   9840185469
 *   09840185469
 *   919840185469
 *   +919840185469
 *   +91 98401 85469
 * Returns: "+919840185469" or null if invalid.
 */
export function normalizeToE164(raw: string): string | null {
  if (!raw) return null;

  const trimmed = (raw + '').trim();

  // Already E.164?
  if (/^\+91\d{10}$/.test(trimmed)) return trimmed;

  // Keep only digits to reason about variants
  let digits = trimmed.replace(/\D+/g, '');

  // Remove a single leading 0 (common local format)
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // If the user typed 12 digits starting with 91, treat it as a country code + local
  if (digits.length === 12 && digits.startsWith('91')) {
    const local10 = digits.slice(2);
    return isValidIndianMobile(local10) ? `+91${local10}` : null;
  }

  // If the user typed exactly 10 digits, assume Indian local mobile
  if (digits.length === 10) {
    return isValidIndianMobile(digits) ? `+91${digits}` : null;
  }

  // Anything else is invalid for now
  return null;
}

/** Basic sanity for Indian mobile numbers: 10 digits starting 6-9 */
function isValidIndianMobile(local10: string): boolean {
  return /^[6-9]\d{9}$/.test(local10);
}

/** Pretty print for dialog: "+91 98401 85469" */
export function prettyForDialog(e164: string): string {
  // Expect "+919XXXXXXXXX"
  const m = /^\+91(\d{5})(\d{5})$/.exec(e164.replace(/\s+/g, ''));
  if (!m) return e164;
  return `+91 ${m[1]} ${m[2]}`;
}
