// src/phone.ts
export function normalizePhone(raw: string, defaultCountry = '+91') {
  const digits = raw.replace(/\D+/g, '');      // keep digits only
  if (!digits) return { e164: '', pretty: '' };

  // If it already includes a country code (starts with 0? 1? 91?) keep it simple:
  const hasPlus = /^\+/.test(raw);
  const withCountry = hasPlus ? raw : `${defaultCountry}${digits.replace(/^0+/, '')}`;

  // Pretty version for the confirm dialog (simple grouping; adjust per market)
  const pretty = withCountry.replace(/(\+\d{1,3})(\d{5})(\d+)/, '$1 $2 $3');

  return { e164: withCountry, pretty };
}
