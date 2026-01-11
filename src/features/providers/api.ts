import api from "@/src/api";
import { AdjustStockIn, AdjustStockResponse, 
  ProviderProfile, ProviderRole, ProviderStore, 
  StoreInventoryResponse, StoreInventoryRow, 
  StoreItemsResponse, StoreOfferRow, 
  StoreOfferUpsertIn, StoreOfferUpsertResponse } from "./types";
import { OrderDetail } from "../commerce/types";

function qsRole(role: ProviderRole) {
  return `role=${encodeURIComponent(role)}`;
}

export async function fetchMyProvider(role: ProviderRole): Promise<ProviderProfile | null> {
  const res = await api.get(`/providers/me?role=${role}`);
  return res.data?.provider ?? null;
}

export async function upsertMyProvider(role: ProviderRole, provider: Partial<ProviderProfile>) {
  return api.post(`/providers/me?role=${role}`, provider);
}

export async function fetchProviderOrder(role: ProviderRole, order_id: number): Promise<OrderDetail> {
  const res = await api.get(`/provider/orders/${order_id}?role=${role}`);
  return res.data.order as OrderDetail;
}

export async function fetchMyStores(role: ProviderRole): Promise<ProviderStore[]> {
  const res = await api.get(`/providers/my-stores?role=${role}`);
  return res.data?.items ?? [];
}

// store context versions
export async function fetchStoreOffers(role: ProviderRole, store_id: number): Promise<any[]> {
  const res = await api.get(`/store/items?role=${role}&store_id=${store_id}`);
  return res.data?.items ?? [];
}

export async function upsertStoreOffer(role: ProviderRole, store_id: number, payload: Record<string, any>) {
  return api.post(`/store/items?role=${role}&store_id=${store_id}`, payload);
}

// catalog master
export async function fetchMyCatalogProducts(
  role: ProviderRole,
  params: { q?: string; category?: string; limit?: number; offset?: number } = {}
) {
  const clean: Record<string, any> = { role };

  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const s = String(v);
    if (!s || s === "undefined" || s === "null") continue;
    clean[k] = v;
  }

  const qs = new URLSearchParams(clean as any).toString();
  const res = await api.get(`/catalog/products?${qs}`);
  return res.data?.items ?? [];
}

// ✅ NEW: create a new store (multi-store per user+role)
export async function createProviderStore(
  role: ProviderRole,
  provider: Partial<ProviderProfile>
): Promise<{ store_id: number }> {
  const res = await api.post(`/providers/stores?role=${role}`, provider);
  // support either store_id or id just in case
  const store_id = res.data?.store_id ?? res.data?.id;
  if (!store_id) throw new Error("Missing store_id from server response");
  return { store_id: Number(store_id) };
}

/**
 * Store offers (catalog listings) - store scoped
 * (You'll pass store_id once backend supports it; keep optional for now.)
 */
export async function fetchStoreItems(role: ProviderRole, store_id?: number): Promise<StoreOfferRow[]> {
  const qs = new URLSearchParams();
  qs.set("role", role);
  if (store_id) qs.set("store_id", String(store_id));

  const res = await api.get(`/store/items?${qs.toString()}`);
  return (res.data as StoreItemsResponse)?.items ?? [];
}

export async function upsertStoreItem(
  role: ProviderRole,
  payload: StoreOfferUpsertIn,
  store_id?: number
): Promise<StoreOfferUpsertResponse> {
  const qs = new URLSearchParams();
  qs.set("role", role);
  if (store_id) qs.set("store_id", String(store_id));

  const res = await api.post(`/store/items?${qs.toString()}`, payload);
  return res.data as StoreOfferUpsertResponse;
}

/**
 * Inventory - store scoped
 */
export async function fetchStoreInventory(role: ProviderRole, store_id?: number): Promise<StoreInventoryRow[]> {
  const qs = new URLSearchParams();
  qs.set("role", role);
  if (store_id) qs.set("store_id", String(store_id));

  const res = await api.get(`/store/inventory?${qs.toString()}`);
  return (res.data as StoreInventoryResponse)?.items ?? [];
}

export async function adjustStoreStock(
  role: ProviderRole,
  payload: AdjustStockIn,
  store_id?: number
): Promise<AdjustStockResponse> {
  const qs = new URLSearchParams();
  qs.set("role", role);
  if (store_id) qs.set("store_id", String(store_id));

  const res = await api.post(`/store/inventory/adjust?${qs.toString()}`, payload);
  return res.data as AdjustStockResponse;
}

export async function createCatalogProduct(role: ProviderRole, payload: any) {
  const res = await api.post(`/catalog/products?${qsRole(role)}`, payload);
  return res.data as { ok: boolean; product_id: number };
}

export async function fetchCatalogProduct(role: ProviderRole, product_id: number) {
  const res = await api.get(`/catalog/products/${product_id}?${qsRole(role)}`);
  // server returns { product: {...} }
  return res.data?.product;
}

export async function updateCatalogProduct(role: ProviderRole, product_id: number, payload: any) {
  const res = await api.patch(`/catalog/products/${product_id}?${qsRole(role)}`, payload);
  return res.data;
}

export async function createCatalogSku(role: ProviderRole, product_id: number, payload: any) {
  const res = await api.post(`/catalog/products/${product_id}/skus?${qsRole(role)}`, payload);
  return res.data as { ok: boolean; sku_id: number };
}

export async function addCatalogMedia(role: ProviderRole, product_id: number, payload: any) {
  const res = await api.post(`/catalog/products/${product_id}/media?${qsRole(role)}`, payload);
  return res.data as { ok: boolean; media_id: number };
}

export async function deleteCatalogMedia(role: ProviderRole, media_id: number) {
  const res = await api.delete(`/catalog/media/${media_id}?${qsRole(role)}`);
  return res.data;
}

export async function replaceCatalogSpecs(role: ProviderRole, product_id: number, items: any[]) {
  const res = await api.put(`/catalog/products/${product_id}/specs?${qsRole(role)}`, items);
  return res.data;
}

export async function replaceCatalogTags(role: ProviderRole, product_id: number, tags: string[]) {
  const res = await api.put(`/catalog/products/${product_id}/tags?${qsRole(role)}`, tags);
  return res.data;
}
