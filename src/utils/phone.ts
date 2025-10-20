// src/utils/phone.ts
export function normalizePhone(raw: string, defaultCountry: 'IN' = 'IN') {
  if (!raw) return { e164: '', pretty: '' };

  // Trim and keep only '+' and digits
  let s = raw.trim().replace(/[^\d+]/g, '');

  // If it already starts with +, keep it normalized
  if (s.startsWith('+')) {
    const e164 = '+' + s.slice(1).replace(/\D/g, '');
    return { e164, pretty: e164 };
  }

  // Drop leading zeros
  s = s.replace(/^0+/, '');

  if (defaultCountry === 'IN') {
    // If it starts with '91', assume it's Indian, prefix '+' if missing
    if (s.startsWith('91')) {
      const e164 = '+' + s;
      return { e164, pretty: e164 };
    }

    // Otherwise prefix '+91' to whatever remains
    const e164 = '+91' + s;
    return { e164, pretty: e164 };
  }

  // Fallback generic case
  const e164 = '+' + s;
  return { e164, pretty: e164 };
}
