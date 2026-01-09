import api from "@/src/api";
import {
  ShopHome,
  ProductDetail,
  CartResponse,
  OrderListItem,
  OrderDetail,
  ProductCard,
  InventoryItem,
  VendorDashboard,
} from "./types";
import { ProviderRole } from "../providers/types";

/* =========================================================
 * Parent – Shop
 * ========================================================= */

export async function fetchShopHome(params?: { pet_id?: number; city?: string }): Promise<ShopHome> {
  const qs = params ? new URLSearchParams(params as any).toString() : "";
  const res = await api.get(`/shop/home${qs ? `?${qs}` : ""}`);
  return res.data as ShopHome;
}

export async function fetchShopProduct(product_id: number): Promise<ProductDetail> {
  const res = await api.get(`/shop/products/${product_id}`);
  return res.data as ProductDetail;
}

/** Product listing */
export async function fetchShopItems(params: {
  category?: string;
  q?: string;
  tag?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<ProductCard[]> {
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const s = String(v);
    if (!s || s === "undefined" || s === "null") continue;
    clean[k] = v;
  }
  const qs = new URLSearchParams(clean as any).toString();
  // ✅ preferred v2 path
  const res = await api.get(`/shop/products${qs ? `?${qs}` : ""}`);
  return res.data?.items ?? [];
}

/* =========================================================
 * Parent – Cart
 * ========================================================= */

export async function fetchCart(): Promise<CartResponse> {
  const res = await api.get(`/cart?mine=1`);
  return res.data as CartResponse;
}

export async function addToCart(offer_id: number, qty: number) {
  return api.post(`/cart/items`, { offer_id, qty });
}

export async function setCartAddress(address_id: number) {
  return api.post(`/cart/address`, { address_id });
}

/* =========================================================
 * Parent – Orders
 * ========================================================= */

/** ✅ Checkout uses cart + address_id */
export async function placeOrder(payload: { address_id: number }): Promise<{ order_ids: number[] }> {
  const res = await api.post(`/orders/checkout`, payload);
  return res.data as { order_ids: number[] };
}

export async function fetchMyOrders(): Promise<OrderListItem[]> {
  const res = await api.get(`/orders?mine=1`);
  return res.data?.items ?? [];
}

export async function fetchOrder(order_id: number): Promise<OrderDetail> {
  const res = await api.get(`/orders/${order_id}`);
  return res.data.order as OrderDetail;
}

/* =========================================================
 * Provider – Catalog / Inventory
 * ========================================================= */

/** ✅ provider catalog in v2 = store_offers joined with product/sku */
export async function fetchProviderCatalog(role: ProviderRole): Promise<any[]> {
  const res = await api.get(`/store/items?role=${role}`);
  return res.data?.items ?? [];
}

/** ✅ updates offer fields (price/mrp/active/promise); no product creation here */
export async function upsertCatalogItem(role: ProviderRole, payload: Record<string, any>) {
  return api.post(`/store/items?role=${role}`, payload);
}

export async function fetchInventory(role: ProviderRole): Promise<InventoryItem[]> {
  const res = await api.get(`/store/inventory?role=${role}`);
  return res.data?.items ?? [];
}

export async function adjustStock(
  role: ProviderRole,
  payload: { sku_id: number; delta: number; reorder_level?: number }
) {
  return api.post(`/store/inventory/adjust?role=${role}`, payload);
}

/* =========================================================
 * Provider – Orders
 * ========================================================= */

export async function fetchProviderOrders(role: ProviderRole): Promise<any[]> {
  const res = await api.get(`/provider/orders?role=${role}`);
  return res.data?.items ?? [];
}

export async function setProviderOrderStatus(role: ProviderRole, order_id: number, status: string) {
  return api.patch(`/provider/orders/${order_id}/status?role=${role}`, { status });
}

/* =========================================================
 * Provider – Dashboard
 * ========================================================= */

export async function fetchVendorDashboard(role: ProviderRole): Promise<VendorDashboard> {
  const res = await api.get(`/vendor/dashboard?role=${role}`);
  return res.data as VendorDashboard;
}

export async function fetchShopFeed(params: {
  limit?: number;
  offset?: number;
  exclude_ids?: number[];
}): Promise<ProductCard[]> {
  const cleanExclude = (params.exclude_ids ?? [])
    .filter((x) => Number.isFinite(x))
    .map((x) => Number(x));

  // ✅ de-dupe and cap so URL doesn't blow up
  const uniqExclude = Array.from(new Set(cleanExclude)).slice(0, 150);

  const qs = new URLSearchParams();
  qs.set("limit", String(params.limit ?? 24));
  qs.set("offset", String(params.offset ?? 0));

  // FastAPI expects repeated query params: exclude_ids=1&exclude_ids=2...
  uniqExclude.forEach((id) => qs.append("exclude_ids", String(id)));

  const res = await api.get(`/shop/feed?${qs.toString()}`);
  return res.data?.items ?? [];
}
