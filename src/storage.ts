// src/storage.ts
// Cross-platform storage: localStorage on web, AsyncStorage on native, with a safe in-memory fallback.

const TOKEN_KEY = "auth_token";

type Dict = Record<string, string>;

let mem: Dict = {};

const isWeb = typeof window !== "undefined" && !!window.localStorage;

// Lazy load AsyncStorage only on native
let AsyncStorage: undefined | { getItem(k: string): Promise<string | null>; setItem(k: string, v: string): Promise<void>; removeItem(k: string): Promise<void>; clear(): Promise<void>; };
if (!isWeb) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AsyncStorage = require("@react-native-async-storage/async-storage").default;
  } catch {
    AsyncStorage = undefined;
  }
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return mem[key] ?? null;
    }
  }
  if (AsyncStorage) return AsyncStorage.getItem(key);
  return mem[key] ?? null;
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch { /* fallthrough */ }
  }
  if (AsyncStorage) return AsyncStorage.setItem(key, value);
  mem[key] = value;
}

async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch { /* fallthrough */ }
  }
  if (AsyncStorage) return AsyncStorage.removeItem(key);
  delete mem[key];
}

async function clearAll(): Promise<void> {
  if (isWeb) {
    try {
      window.localStorage.clear();
      return;
    } catch { /* fallthrough */ }
  }
  if (AsyncStorage) return AsyncStorage.clear();
  mem = {};
}

// Token helpers
export async function getToken(): Promise<string | null> {
  return getItem(TOKEN_KEY);
}
export async function setToken(token: string): Promise<void> {
  await setItem(TOKEN_KEY, token);
}
export async function clearToken(): Promise<void> {
  await removeItem(TOKEN_KEY);
}

// Generic helpers (if you want them)
export const storage = {
  get: getItem,
  set: setItem,
  remove: removeItem,
  clearAll,
  getToken,
  setToken,
  clearToken,
};

export default storage;
