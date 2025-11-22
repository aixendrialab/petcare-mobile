// src/api.ts
import axios from "axios";
import Constants from "expo-constants";

// --- Single Source of Truth ---
const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  Constants.expoConfig?.extra?.API_BASE;

if (!API_BASE) {
  console.error("❌ API_BASE is undefined! Check your .env or app.config.ts");
}

console.log("🔌 Using API_BASE =", API_BASE);

// --- Axios client ---
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// --- Auth header helper ---
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// --- Simple wrappers ---
export const get = async <T>(url: string): Promise<T> =>
  (await api.get<T>(url)).data;

export const post = async <T>(url: string, data?: any): Promise<T> =>
  (await api.post<T>(url, data)).data;

export const put = async <T>(url: string, data?: any): Promise<T> =>
  (await api.put<T>(url, data)).data;

export const del = async <T>(url: string): Promise<T> => {
  console.log("📡 DELETE", url);
  const res = await api.delete<T>(url);
  console.log("✅ DELETE response", res.status, res.data);
  return res.data;
};

// -----------------------------------------------------------
// REQUEST INTERCEPTOR: Normalize URL to a *true absolute URL*
// -----------------------------------------------------------
api.interceptors.request.use((cfg) => {
  const base = API_BASE ?? "";
  const rel = cfg.url ?? "";

  const cleanedBase = base.trim().replace(/^['"]|['"]$/g, "");

  const absolute = new URL(
    rel.replace(/^\/+/, ""),
    cleanedBase.endsWith("/") ? cleanedBase : cleanedBase + "/"
  ).toString();

  cfg.url = absolute;
  // @ts-ignore suppress mismatch
  cfg.baseURL = undefined; // avoid double-prepending

  console.log(
    "→",
    (cfg.method || "GET").toUpperCase(),
    absolute,
    { headers: cfg.headers, data: cfg.data }
  );

  return cfg;
});

// -----------------------------------------------------------
// RESPONSE INTERCEPTOR: Verify final URL + detect HTML issues
// -----------------------------------------------------------
api.interceptors.response.use(
  (res) => {
    const ct = res.headers?.["content-type"] || "";
    console.log(
      "←",
      res.status,
      res.config.method?.toUpperCase(),
      res.config.url,
      ct
    );

    if (ct.includes("text/html")) {
      console.error(
        "❌ HTML received — this means a redirect or Expo dev server handled the request!"
      );
    }

    return res;
  },
  (err) => {
    console.log("✖ ERROR", err?.response?.status, err?.config?.url, err?.message);
    throw err;
  }
);

export default api;
