// src/features/providers/types.ts

export type ProviderRole = "vet" | "vendor" | "pharmacist" | "nutritionist" | "hostel";

export type ProviderStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "PENDING";

export interface ProviderProfile {
  id: number;
  role: ProviderRole;
  display_name: string;
  phone?: string;
  email?: string;
  logo_uri: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;

  license_no?: string;        // for PHARMACY
  license_valid_till?: string; // ISO date
  status: ProviderStatus;
}

export type ProviderStore = {
  id: number;
  role: ProviderRole;
  display_name: string;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  status: string;
};

export type CatalogCategory = "FOOD" | "ACCESSORY" | "MEDICINE" | "SERVICE";

export type Currency = "INR" | string;

export type StoreOfferRow = {
  offer_id: number;
  store_id: number;
  product_id: number;
  sku_id: number;

  category: CatalogCategory;
  title: string;
  brand?: string | null;

  price: number;
  mrp?: number | null;
  currency: Currency;
  discount_pct?: number | null;

  stock_qty: number;
  reorder_level: number;

  is_active: boolean;

  shipping_fee?: number | null;
  eta_text?: string | null;
  eta_days_min?: number | null;
  eta_days_max?: number | null;
  returnable?: boolean | null;
  warranty_months?: number | null;
};

export type StoreItemsResponse = { items: StoreOfferRow[] };

export type StoreOfferUpsertIn = {
  offer_id?: number | null; // update by offer_id
  sku_id?: number | null;   // create/update by sku_id

  price?: number | null;
  mrp?: number | null;
  discount_pct?: number | null;

  stock_qty?: number | null;
  reorder_level?: number | null;

  is_active?: boolean | null;

  shipping_fee?: number | null;
  eta_text?: string | null;
  eta_days_min?: number | null;
  eta_days_max?: number | null;
  returnable?: boolean | null;
  warranty_months?: number | null;
};

export type StoreOfferUpsertResponse =
  | { ok: true; offer_id: number }
  | { ok: boolean; offer_id?: number };

  export type StoreInventoryRow = {
  offer_id: number;
  store_id: number;
  product_id: number;
  sku_id: number;

  title: string;
  variant?: string | null;

  stock_qty: number;
  reorder_level: number;

  price: number;
  mrp?: number | null;
  currency: Currency;

  is_active: boolean;
};

export type StoreInventoryResponse = { items: StoreInventoryRow[] };

export type AdjustStockIn = {
  sku_id: number;
  delta: number;
  reorder_level?: number | null;
};

export type AdjustStockResponse = {
  ok: true;
  offer_id: number;
  stock_qty: number;
};