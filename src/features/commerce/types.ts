import { ProviderRole } from "../providers/types";

/** =========================
 *  Existing commerce primitives
 *  ========================= */

export type CatalogKind = "PRODUCT" | "SERVICE";
export type CatalogCategory = "MEDICINE" | "FOOD" | "ACCESSORY" | "BOARDING" | "DIET_PLAN";

export interface ProviderSummary {
  id: number;
  role: ProviderRole;
  display_name: string;
  city?: string;
  rating?: number;
}

export interface CatalogItem {
  id: number;
  provider_id: number;
  kind: CatalogKind;
  category: CatalogCategory;

  name: string;
  description?: string;
  price: number; // in INR rupees for now
  active: boolean;

  rx_required?: boolean; // for MEDICINE
  image_uri?: string;

  // OPTIONAL future enhancements (safe additions; won't break callers)
  rating_avg?: number;
  rating_count?: number;
  mrp?: number;
  discount_pct?: number;
  limited_deal?: boolean;
  store_name?: string;
  stock_qty?: number;
}

export interface InventoryItem {
  catalog_item_id: number;
  stock_qty: number;
  reorder_level?: number;

  // pharmacy-specific optional fields
  batch_no?: string;
  expiry_date?: string; // ISO date
}

export type OrderStatus =
  | "CREATED"
  | "CONFIRMED"
  | "PACKED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  catalog_item_id: number;
  name: string;
  qty: number;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: number;
  parent_id: number;
  provider: ProviderSummary;

  status: OrderStatus;
  total_amount: number;
  created_at: string; // ISO datetime

  items: OrderItem[];
  delivery?: {
    status: "PENDING" | "OUT_FOR_DELIVERY" | "DELIVERED";
    tracking_ref?: string;
    eta?: string; // ISO datetime
  };

  // pharmacy
  prescription_required?: boolean;
  prescription_attached?: boolean;
}

/** =========================
 *  Rich shop browsing types
 *  (used for Amazon-like UI)
 *  ========================= */


export type ShopImage = {
  id: string;
  uri: string; // https://...
  label?: string; // "Front", "Back", etc
};


export type MiniItem = {
  id: number;
  name: string;
  price: Money;
  mrp?: Money; // show discount if mrp > price
  primary_image?: string;
  rating?: RatingSummary;
  badges?: string[]; // ["Limited time deal"]
};

export type Money = { amount: number; currency: "INR" };

export type RatingSummary = {
  avg: number; // 0..5
  count: number;
  breakdown?: { stars: 1 | 2 | 3 | 4 | 5; pct: number }[];
};

export type CatalogImage = {
  id: string;
  uri: string;
  label?: string;
};

export type SpecKV = { k: string; v: string };

export type DiscountHint = {
  title: string;
  message: string;
  progress?: { current: Money; target: Money };
};

export type ReviewPreview = {
  id: number;
  user_display: string;
  rating: number;
  title?: string;
  body: string;
  created_at: string;
  images?: CatalogImage[];
};

export type SellerInfo = {
  seller_id: number;
  display_name: string;
  role: ProviderRole;
  rating?: RatingSummary;
  badges?: string[];
  city?: string;
  returnable?: boolean;
  delivery_promise?: {
    eta_text: string;
    eta_date?: string;
    shipping_fee?: Money;
    in_stock?: boolean;
  };
};

export type CatalogMiniItem = {
  id: number;
  name: string;
  price: Money;
  mrp?: Money;
  primary_image?: string;
  rating?: RatingSummary;
  badges?: string[];
};

export type ShopHome = {
  as_of: string;
  hero?: { title: string; subtitle?: string; banner_uri?: string };
  discount_hints?: DiscountHint[];
  sections: {
    key: string;
    title: string;
    subtitle?: string;
    items: CatalogMiniItem[];
    cta?: { title: string; route: string };
  }[];
};

/**
 * ✅ Rich item detail (Amazon-like)
 * Use this ONLY on product detail screen.
 */
export type CatalogItemDetail = {
  id: number;
  name: string;
  description?: string;

  price: Money;
  mrp?: Money;
  discount_badges?: string[];
  discount_pct?: number;
  bought_recently?: { label: string };

  images: CatalogImage[];

  rating?: RatingSummary;

  seller: SellerInfo;

  tags?: string[];
  specs: SpecKV[];

  reviews: {
    summary: RatingSummary;
    top?: ReviewPreview[];
    ask_suggestions?: string[];
  };

  frequently_bought_together?: {
    title: string;
    items: CatalogMiniItem[];
  };

  similar?: {
    title: string;
    items: CatalogMiniItem[];
  };
};

export type VendorDashboard = {
  role: ProviderRole;
  as_of: string;
  kpis: { title: string; value: string; hint?: string; trend?: "up" | "down" | "flat" }[];
  actions: { title: string; caption?: string; route: string; badge?: string }[];
};
