import { ProviderRole } from "../providers/types";

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
