import { ProviderRole } from "../providers/types";

/** =========================
 *  Common primitives
 *  ========================= */

export type Money = { amount: number; currency: "INR" };

export type RatingSummary = {
  avg: number;
  count: number;
};

export type MediaType = "IMAGE" | "VIDEO";

/** =========================
 *  Shop categories (v2)
 *  ========================= */

export type CatalogCategory = "FOOD" | "ACCESSORY" | "MEDICINE" | "SERVICE";

/** =========================
 *  Shop Home (server: /shop/home)
 *  ========================= */

export type ProductCard = {
  product_id: number;
  category: CatalogCategory;
  title: string;
  brand?: string | null;
  primary_image?: string | null;

  best_price?: Money | null;
  mrp?: Money | null;
  discount_pct?: number | null;

  rating_avg?: number | null;
  rating_count?: number | null;

  badges?: string[];
};

export type ShopHomeSection = {
  key: string;
  title: string;
  subtitle?: string | null;
  items: ProductCard[];
  cta?: { title: string; route: string } | null;
};

export type ShopHome = {
  deliver_to_text?: string;
  hero?: ShopHomeHero | null;
  discount_hints?: DiscountHint[];
  sections: ShopHomeSection[];
};


/** =========================
 *  Product detail (server: /shop/products/{product_id})
 *  ========================= */

export type BrandSummary = {
  id: number;
  name: string;
  about?: string | null;
  logo_uri?: string | null;
  website?: string | null;
};

export type TaxInfo = {
  code?: string | null;      // e.g. GST_18
  gst_pct?: number | null;   // e.g. 18
  hsn_code?: string | null;
};

export type ProductMedia = {
  media_type: MediaType;
  uri: string;
  label?: string | null;
  sort_order?: number;
};

export type ProductSpec = {
  spec_group: string; // "Top highlights" | "Product details" | ...
  key: string;
  value: string;
  sort_order?: number;
};

export type SkuOption = {
  sku_id: number;
  variant_key?: string | null;
  variant_value?: string | null;
  pack_label?: string | null;
  sku_code?: string | null;
};

export type StoreSummary = {
  id: number;
  role: ProviderRole;
  display_name: string;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;

  logo_uri?: string | null;
  about?: string | null;

  rating_avg?: number | null;
  rating_count?: number | null;
  orders_30d?: number | null;

  badges?: string[];
};

export type Promotion = {
  id: number;
  title: string;
  subtitle?: string | null;
  promo_type: "DISCOUNT" | "COUPON" | "BANK" | "BUNDLE";
  discount_pct?: number | null;
  discount_amount?: Money | null;
  min_qty: number;
};

export type FulfillmentPromise = {
  shipping_fee?: Money | null;
  eta_text?: string | null;
  eta_days_min?: number | null;
  eta_days_max?: number | null;
  returnable?: boolean | null;
  warranty_months?: number | null;
  in_stock?: boolean | null;
};

export type OfferCard = {
  offer_id: number;
  store: StoreSummary;
  sku: { sku_id: number };

  price: Money;
  mrp?: Money | null;
  discount_pct?: number | null;

  stock_qty: number;

  fulfillment?: FulfillmentPromise | null;
  promotions?: Promotion[];
};

export type ReviewVoteSummary = {
  helpful: number;
  not_helpful: number;
  my_vote?: boolean | null;
};

export type ReviewMedia = {
  media_type: MediaType;
  uri: string;
  sort_order?: number;
};

export type ReviewPreview = {
  id: number;
  user_display: string;
  rating: number;
  title?: string | null;
  body: string;
  created_at: string;
  is_verified_purchase: boolean;

  media?: ReviewMedia[];
  votes?: ReviewVoteSummary;
};

export type ReviewSummary = {
  rating_avg: number;
  rating_count: number;
};

export type QuestionAnswer = {
  question_id: number;
  question: string;
  asked_by: string;
  asked_at: string;

  answer_id?: number | null;
  answer?: string | null;
  answered_by?: string | null;
  answered_at?: string | null;
};

export type ProductBlock = {
  title: string;
  items: ProductCard[];
};

export type ProductDetail = {
  product_id: number;
  category: CatalogCategory;

  title: string;
  short_desc?: string | null;
  description?: string | null;

  brand?: BrandSummary | null;
  brand_text?: string | null;

  tax?: TaxInfo | null;
  prescription_required: boolean;

  variant_theme?: string | null;
  media: ProductMedia[];
  specs: ProductSpec[];
  tags: string[];
  skus: SkuOption[];

  offers: OfferCard[];

  review_summary: ReviewSummary;
  review_previews: ReviewPreview[];
  bought_recently_label?: string | null;

  qa: QuestionAnswer[];

  frequently_bought_together?: ProductBlock | null;
  similar_products?: ProductBlock | null;
  more_to_explore?: ProductBlock | null;
  top_deals?: ProductBlock | null;
};

/** =========================
 *  Cart (server: GET /cart?mine=1)
 *  ========================= */

export type CartLine = {
  cart_item_id: number;
  offer_id: number;

  store: { id: number; display_name: string };

  product_id: number;
  sku_id: number;

  title: string;
  variant?: string | null;

  qty: number;

  unit_price: number;
  currency: string;
  line_total: number;

  primary_image?: string | null;
  in_stock: boolean;
};

export type CartTotals = {
  items_total: number;
  discount_total: number;
  shipping_fee: number;
  tax_total: number;
  grand_total: number;
};

export type Address = {
  id: number;
  label?: string | null;
  recipient: string;
  phone?: string | null;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  lat?: number | null;
  lng?: number | null;
  is_default: boolean;
};

export type CartResponse = {
  items: CartLine[];
  address?: Address | null;
  totals: CartTotals;
};

/** =========================
 *  Orders (server: /orders, /orders/{id})
 *  ========================= */

export type OrderStatus =
  | "CREATED"
  | "CONFIRMED"
  | "PACKED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderListItem = {
  id: number;
  store_id: number;
  store_name: string;
  status: OrderStatus;
  grand_total: number;
  currency: string;
  created_at: string;
};

export type OrderItem = {
  product_id: number;
  sku_id: number;
  title: string;
  qty: number;

  unit_price: number;
  mrp?: number | null;
  discount_amt: number;

  gst_pct: number;
  gst_amt: number;

  line_total: number;
};

export type OrderDetail = {
  id: number;
  store: { id: number; display_name: string };
  status: OrderStatus;
  created_at: string;
  currency: string;

  totals: CartTotals;

  address: {
    label?: string | null;
    recipient: string;
    phone?: string | null;
    line1: string;
    line2?: string | null;
    landmark?: string | null;
    city: string;
    state: string;
    pincode: string;
  };

  items: OrderItem[];
};

export type InventoryItem = {
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
  currency: string;

  is_active: boolean;
};

export type VendorDashboard = {
  role: ProviderRole;
  as_of: string;
  kpis: { title: string; value: string; hint?: string; trend?: "up" | "down" | "flat" }[];
  actions: { title: string; caption?: string; route: string; badge?: string }[];
};

export type DiscountHint = {
  title: string;
  message: string;
  progress?: { current: Money; target: Money };
};

export type ShopHomeHero = {
  title: string;
  subtitle?: string | null;
  banner_uri?: string | null;
  route?: string | null;
};
