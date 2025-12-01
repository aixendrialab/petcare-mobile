// src/ui/validators.ts

export const isEmail = (msg = "Invalid email") => (value: string) => {
  if (!value) return null;  // let required rule handle empty
  const ok = /\S+@\S+\.\S+/.test(value);
  return ok ? null : msg;
};

export const minLen = (n: number, msg?: string) => (value: string) => {
  if (!value) return null;
  return value.length >= n ? null : (msg || `Minimum length is ${n}`);
};

export const isPhone = (msg = "Invalid phone number") => (value: string) => {
  if (!value) return null;
  return /^[0-9]{10}$/.test(value) ? null : msg;
};

// Add more validators (PAN, GSTIN etc) later
