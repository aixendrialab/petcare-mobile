// src/api.ts
import axios from 'axios';
import { API_BASE } from './config';

export const api = axios.create({ baseURL: API_BASE });

// Attach/clear Authorization
export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export const get = async <T>(url: string): Promise<T> =>
  (await api.get<T>(url)).data;
export const post = async <T>(url: string, data?: any): Promise<T> =>
  (await api.post<T>(url, data)).data;
export const put = async <T>(url: string, data?: any): Promise<T> =>
  (await api.put<T>(url, data)).data;
export const del = async <T>(url: string): Promise<T> => {
  console.log('📡 DELETE', url);
  const res = await api.delete<T>(url);
  console.log('✅ DELETE response', res.status, res.data);
  return res.data;
};
export default api;

// ---- Request interceptor: normalize URL to absolute *once* ----
api.interceptors.request.use((cfg) => {
  const base = (cfg.baseURL ?? '') as string;
  const rel  = (cfg.url ?? '') as string;

  // Build a proper absolute URL (handles stray quotes in base, double slashes, etc.)
  const cleanedBase = base.trim().replace(/^['"]|['"]$/g, '');  // dequote just in case
  const absolute = new URL(rel.replace(/^\/+/, ''), cleanedBase.endsWith('/') ? cleanedBase : cleanedBase + '/').toString();

  // Freeze the final URL onto cfg and drop baseURL so Axios won’t recompute
  cfg.url = absolute;
  // @ts-ignore Axios typing: set baseURL undefined to prevent double-join
  cfg.baseURL = undefined;

  console.log('→', (cfg.method || 'GET').toUpperCase(), absolute, { headers: cfg.headers, data: cfg.data });
  return cfg;
});

// ---- Response interceptor: truthful final URL + guard against HTML ----
api.interceptors.response.use(
  (res) => {
    const ct = res.headers?.['content-type'] || '';
    // With the request patch, res.config.url is already absolute & truthful
    console.log('←', res.status, res.config.method?.toUpperCase(), res.config.url, ct);

    // If we *still* see HTML, we definitely hit the web dev server (navigation/redirect/SW)
    if (ct.includes('text/html')) {
      console.error('Unexpected HTML from API — likely a redirect/navigation to the web dev server.');
      // throw new Error('Unexpected HTML from API'); // keep disabled while debugging
    }
    return res;
  },
  (err) => {
    console.log('✖', err?.response?.status, err?.config?.url, err?.message);
    throw err;
  }
);
