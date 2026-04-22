// src/features/vendor/home/types.ts

export type VendorKpi = {
  key: string;
  label: string;
  value: string;
  tone?: "neutral" | "primary" | "success" | "warning";
  hint?: string;
};

export type VendorStoreChip = {
  id: number;
  display_name: string;
  city?: string | null;
  pendingOrders?: number;
  lowStock?: number;
};

export type VendorOrderPreview = {
  order_id: number;
  customer_name: string;
  city?: string | null;
  items_count: number;
  age_min: number;
  status: "NEW" | "PACK" | "READY" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
  amount: number;
  currency: string;
};

export type VendorLowStockItem = {
  sku_id: number;
  title: string;
  variant?: string | null;
  stock_qty: number;
  reorder_level: number;
};

export type VendorReviewPreview = {
  rating_avg: number;
  rating_count: number;
  latest?: {
    customer_name: string;
    rating: number;
    note?: string | null;
    age_days: number;
  };
};

export type VendorHomeSummary = {
  activeStoreId: number | null;
  stores: VendorStoreChip[];

  today: {
    orders: number;
    revenue: number;
    currency: string;
    shipped: number;
    cancelled: number;
  };

  kpis: VendorKpi[];

  attention: {
    pendingOrders: number;
    longestPendingMins: number;

    lowStockCount: number;
    lowStockTop: string[];

    returnsOpen: number;
    ticketsOpen: number;
  };

  previews: {
    pendingOrders: VendorOrderPreview[];
    lowStock: VendorLowStockItem[];
    reviews: VendorReviewPreview;
  };
};
