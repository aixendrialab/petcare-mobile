import api from "@/src/api";
import { CatalogItem, CatalogItemDetail, InventoryItem, Order, ShopHome, VendorDashboard } from "./types";
import { ProviderRole } from "../providers/types";


// Parent cart + orders
export async function fetchCart(): Promise<{ items: any[]; total_amount: number }> {
  const res = await api.get(`/cart?mine=1`);
  return res.data;
}

export async function addToCart(catalog_item_id: number, qty: number) {
  return api.post(`/cart/items`, { catalog_item_id, qty });
}

export async function placeOrder(payload: {
  provider_id: number;
  items: { catalog_item_id: number; qty: number }[];
  prescription_id?: number;
  rx_uri?: string;
}): Promise<{ order_id: number }> {
  const res = await api.post(`/orders`, payload);
  return res.data;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const res = await api.get(`/orders?mine=1`);
  return res.data?.items ?? [];
}

export async function fetchOrder(id: number): Promise<Order> {
  const res = await api.get(`/orders/${id}`);
  return res.data.order; // ✅ items already included
}

// Provider store management
export async function fetchProviderCatalog(role: ProviderRole): Promise<CatalogItem[]> {
  const res = await api.get(`/store/items?role=${role}`);
  return res.data?.items ?? [];
}

export async function upsertCatalogItem(role: ProviderRole, item: Partial<CatalogItem>) {
  return api.post(`/store/items?role=${role}`, item);
}

export async function fetchInventory(role: ProviderRole): Promise<InventoryItem[]> {
  const res = await api.get(`/store/inventory?role=${role}`);
  return res.data?.items ?? [];
}

export async function adjustStock(
  role: ProviderRole,
  payload: {
    catalog_item_id: number;
    delta: number;
    reason?: string;
    batch_no?: string;
    expiry_date?: string;
  }
) {
  return api.post(`/store/inventory/adjust?role=${role}`, payload);
}

// Provider order ops
export async function fetchProviderOrders(role: ProviderRole): Promise<Order[]> {
  const res = await api.get(`/provider/orders?role=${role}`);
  return res.data?.items ?? [];
}

export async function setProviderOrderStatus(role: ProviderRole, order_id: number, status: string) {
  return api.patch(`/provider/orders/${order_id}/status?role=${role}`, { status });
}

/**
 * ✅ Vendor dashboard summary tiles
 * Server can return either:
 *  - { dashboard: VendorDashboard }
 *  - VendorDashboard (direct)
 */
export async function fetchVendorDashboard(role: ProviderRole): Promise<VendorDashboard> {
  const res = await api.get(`/vendor/dashboard?role=${role}`);
  return (res.data?.dashboard ?? res.data) as VendorDashboard;
}

export async function fetchShopItems(params: {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<CatalogItem[]> {
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const s = String(v);
    if (s.trim() === "" || s === "undefined" || s === "null") continue;
    clean[k] = v;
  }
  const qs = new URLSearchParams(clean as any).toString();
  const res = await api.get(`/shop/items${qs ? `?${qs}` : ""}`);
  return res.data?.items ?? [];
}

/** ✅ single endpoint, no versions */
export async function fetchShopItem(id: number): Promise<CatalogItemDetail> {
  const res = await api.get(`/shop/items/${id}`);
  return (res.data?.item ?? res.data) as CatalogItemDetail;
}

// ...keep the rest same...

export async function fetchShopHome(params?: { pet_id?: number; city?: string }): Promise<ShopHome> {
  const qs = params ? new URLSearchParams(params as any).toString() : "";
  const res = await api.get(`/shop/home${qs ? `?${qs}` : ""}`);
  return (res.data?.home ?? res.data) as ShopHome;
}
