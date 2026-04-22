// src/features/vendor/home/mock.ts
import type { VendorHomeSummary } from "./types";

export function mockVendorHomeSummary(activeStoreId: number | null = 101): VendorHomeSummary {
  const stores = [
    { id: 101, display_name: "PetCare Store – Vizag", city: "Visakhapatnam", pendingOrders: 7, lowStock: 3 },
    { id: 102, display_name: "PetCare Store – Gachibowli", city: "Hyderabad", pendingOrders: 2, lowStock: 1 },
    { id: 103, display_name: "PetCare Store – Gurgaon", city: "Gurgaon", pendingOrders: 5, lowStock: 6 },
  ];

  const active = stores.find((s) => s.id === activeStoreId) ?? stores[0];

  return {
    activeStoreId: active?.id ?? null,
    stores,
    today: {
      orders: active?.pendingOrders ?? 0,
      revenue: 18420,
      currency: "INR",
      shipped: 9,
      cancelled: 1,
    },
    kpis: [
      { key: "pending", label: "Pending", value: String(active?.pendingOrders ?? 0), tone: "warning", hint: "Need packing" },
      { key: "lowStock", label: "Low stock", value: String(active?.lowStock ?? 0), tone: "warning", hint: "Reorder soon" },
      { key: "active", label: "Active listings", value: "128", tone: "success", hint: "+4 this week" },
      { key: "rating", label: "Rating", value: "4.6", tone: "primary", hint: "312 reviews" },
    ],
    attention: {
      pendingOrders: active?.pendingOrders ?? 0,
      longestPendingMins: 42,
      lowStockCount: active?.lowStock ?? 0,
      lowStockTop: ["Pedigree Adult 3kg", "Amoxicillin 250mg", "Rabies Vaccine"].slice(
        0,
        Math.max(1, Math.min(3, active?.lowStock ?? 0))
      ),
      returnsOpen: 1,
      ticketsOpen: 2,
    },
    previews: {
      pendingOrders: [
        { order_id: 56789, customer_name: "Priya", city: "Vizag", items_count: 3, age_min: 18, status: "NEW", amount: 1299, currency: "INR" },
        { order_id: 56790, customer_name: "Rahul", city: "Vizag", items_count: 1, age_min: 31, status: "PACK", amount: 399, currency: "INR" },
        { order_id: 56791, customer_name: "Asha", city: "Vizag", items_count: 2, age_min: 39, status: "READY", amount: 749, currency: "INR" },
      ],
      lowStock: [
        { sku_id: 9001, title: "Pedigree Adult", variant: "3kg", stock_qty: 2, reorder_level: 5 },
        { sku_id: 9002, title: "Amoxicillin", variant: "250mg", stock_qty: 6, reorder_level: 10 },
        { sku_id: 9003, title: "Rabies Vaccine", variant: "1 dose", stock_qty: 1, reorder_level: 4 },
      ],
      reviews: {
        rating_avg: 4.6,
        rating_count: 312,
        latest: { customer_name: "Sana", rating: 5, note: "Fast delivery and good packaging.", age_days: 1 },
      },
    },
  };
}
