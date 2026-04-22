// src/features/vendor/home/buildVendorHomeModel.ts

import type {
  ActionTileModel,
  AttentionItemModel,
  IconRegistry,
  QuickTone,
  RoleHomeModel,
  SecondaryContextItem,
  SectionModel,
  SectionRowModel,
} from "@/src/components/home";

import type { VendorHomeSummary, VendorOrderPreview, VendorLowStockItem } from "./types";

export type MinimalRouter = { push: (href: any) => void };

export type BuildVendorHomeModelArgs = {
  summary: VendorHomeSummary;
  router: MinimalRouter;
  icons: IconRegistry;
  greeting: string;
  subtitle?: string;
  isLoading?: boolean;
};

function toneFromCount(n: number): QuickTone {
  if (n <= 0) return "neutral";
  if (n <= 2) return "primary";
  return "warning";
}

function money(amount: number, currency: string) {
  try {
    if (currency === "INR") return `₹${amount.toLocaleString()}`;
    return `${currency} ${amount.toLocaleString()}`;
  } catch {
    return `${currency} ${amount}`;
  }
}

function orderPrimary(o: VendorOrderPreview): string {
  return `#${o.order_id} • ${o.customer_name}`;
}

function orderSecondary(o: VendorOrderPreview): string {
  const parts = [`${o.items_count} item${o.items_count === 1 ? "" : "s"}`, `${o.status}`];
  if (o.city) parts.unshift(o.city);
  return parts.join(" • ");
}

function orderTertiary(o: VendorOrderPreview): string {
  return `${o.age_min}m • ${money(o.amount, o.currency)}`;
}

function lowStockPrimary(x: VendorLowStockItem): string {
  return `${x.title}${x.variant ? ` • ${x.variant}` : ""}`;
}

function lowStockSecondary(x: VendorLowStockItem): string {
  return `Stock ${x.stock_qty} • Reorder @ ${x.reorder_level}`;
}

export function buildVendorHomeModel(args: BuildVendorHomeModelArgs): RoleHomeModel {
  const { summary, router, icons, greeting, subtitle, isLoading } = args;

  const activeStore = summary.stores.find((s) => s.id === summary.activeStoreId) ?? null;

  const secondaryItems: SecondaryContextItem[] = [
    ...summary.stores.map((s) => ({
      key: String(s.id),
      title: s.display_name,
      subtitle:
        `${s.city ?? ""}`.trim() +
        `${s.pendingOrders != null || s.lowStock != null ? ` • ${s.pendingOrders ?? 0} pending • ${s.lowStock ?? 0} low` : ""}`,
      imageUri: null,
      status: s.id === summary.activeStoreId ? "ok" : undefined,
      badges: [
        { text: `${s.pendingOrders ?? 0} pending`, tone: toneFromCount(s.pendingOrders ?? 0) },
        { text: `${s.lowStock ?? 0} low`, tone: (s.lowStock ?? 0) ? "warning" : "neutral" },
      ],
      onPress: () => router.push({ pathname: "/vendor/home_demo", params: { store_id: String(s.id) } } as any),
    })),
    {
      key: "add-store",
      title: "+ Add Store",
      subtitle: "Create a new store",
      imageUri: null,
      onPress: () => router.push("/vendor/onboarding" as any),
    },
  ];

  const tiles: ActionTileModel[] = [
    {
      key: "orders",
      title: "Orders",
      subtitle: "Pack & dispatch",
      tone: "primary",
      iconName: "truck",
      badgeText: summary.attention.pendingOrders ? String(summary.attention.pendingOrders) : undefined,
      badgeTone: summary.attention.pendingOrders ? "warning" : undefined,
      onPress: () => router.push("/vendor/orders" as any),
    },
    {
      key: "inventory",
      title: "Inventory",
      subtitle: "Stock & alerts",
      tone: "warning",
      iconName: "cart",
      badgeText: summary.attention.lowStockCount ? String(summary.attention.lowStockCount) : undefined,
      badgeTone: summary.attention.lowStockCount ? "warning" : undefined,
      onPress: () => router.push("/vendor/inventory" as any),
    },
    {
      key: "catalog",
      title: "Catalog",
      subtitle: "Products & pricing",
      tone: "success",
      iconName: "store",
      onPress: () => router.push("/vendor/catalog" as any),
    },
    {
      key: "upload",
      title: "Add product",
      subtitle: "Photos & details",
      tone: "neutral",
      iconName: "upload",
      onPress: () => router.push("/vendor/upload" as any),
    },
    {
      key: "delivery",
      title: "Delivery",
      subtitle: "Shipments",
      tone: "neutral",
      iconName: "truck",
      onPress: () => router.push("/vendor/delivery" as any),
    },
    {
      key: "profile",
      title: "Profile",
      subtitle: "Business",
      tone: "neutral",
      iconName: "history",
      onPress: () => router.push("/vendor/profile" as any),
    },
  ];

  const attentionItems: AttentionItemModel[] = [
    {
      key: "pending",
      iconName: "truck",
      tone: summary.attention.pendingOrders ? "warning" : "neutral",
      title: `${summary.attention.pendingOrders} orders pending`,
      subtitle: `Longest pending • ${summary.attention.longestPendingMins}m`,
      cta: { text: "Open orders", onPress: () => router.push("/vendor/orders" as any) },
    },
    {
      key: "low-stock",
      iconName: "cart",
      tone: summary.attention.lowStockCount ? "warning" : "neutral",
      title: `${summary.attention.lowStockCount} low-stock items`,
      subtitle: summary.attention.lowStockTop.join(" • ") || "All good",
      cta: { text: "View stock", onPress: () => router.push("/vendor/inventory" as any) },
    },
    {
      key: "returns",
      iconName: "history",
      tone: summary.attention.returnsOpen ? "primary" : "neutral",
      title: `${summary.attention.returnsOpen} return(s) open`,
      subtitle: "Review and resolve",
      cta: { text: "Review", onPress: () => router.push("/vendor/orders" as any) },
    },
    {
      key: "tickets",
      iconName: "history",
      tone: summary.attention.ticketsOpen ? "primary" : "neutral",
      title: `${summary.attention.ticketsOpen} support ticket(s)`,
      subtitle: "Customer queries",
      cta: { text: "Open", onPress: () => router.push("/vendor/settings" as any) },
    },
  ];

  const sections: SectionModel[] = [];

  const pendingRows: SectionRowModel[] = summary.previews.pendingOrders.slice(0, 3).map((o) => ({
    key: String(o.order_id),
    primary: orderPrimary(o),
    secondary: orderSecondary(o),
    tertiary: orderTertiary(o),
    leftIconName: "truck",
    onPress: () => router.push({ pathname: "/vendor/orders/[id]", params: { id: String(o.order_id) } } as any),
  }));

  sections.push({
    key: "pending-orders",
    title: "Pending Orders",
    accent: { iconName: "truck", tone: "primary" },
    onSeeAll: () => router.push("/vendor/orders" as any),
    content: {
      kind: "rows",
      rows: pendingRows,
      empty: { text: "No pending orders 🎉" },
    },
  });

  const stockRows: SectionRowModel[] = summary.previews.lowStock.slice(0, 3).map((x) => ({
    key: String(x.sku_id),
    primary: lowStockPrimary(x),
    secondary: lowStockSecondary(x),
    leftIconName: "cart",
    onPress: () => router.push("/vendor/inventory" as any),
  }));

  sections.push({
    key: "inventory",
    title: "Inventory Alerts",
    accent: { iconName: "cart", tone: "warning" },
    onSeeAll: () => router.push("/vendor/inventory" as any),
    content: {
      kind: "rows",
      rows: stockRows,
      empty: { text: "Stock looks healthy" },
    },
  });

  sections.push({
    key: "today",
    title: "Today",
    accent: { iconName: "store", tone: "success" },
    content: {
      kind: "rows",
      rows: [
        { key: "orders", primary: "Orders", secondary: String(summary.today.orders) },
        { key: "revenue", primary: "Revenue", secondary: money(summary.today.revenue, summary.today.currency) },
        { key: "shipped", primary: "Shipped", secondary: String(summary.today.shipped) },
      ],
    },
  });

  const r = summary.previews.reviews;
  sections.push({
    key: "reviews",
    title: "Reviews",
    accent: { iconName: "history", tone: "primary" },
    onSeeAll: () => router.push("/vendor/profile" as any),
    content: {
      kind: "rows",
      rows: [
        { key: "rating", primary: "Rating", secondary: `${r.rating_avg} • ${r.rating_count} reviews` },
        ...(r.latest
          ? [
              {
                key: "latest",
                primary: `Latest: ${r.latest.customer_name} • ${r.latest.rating}★`,
                secondary: r.latest.note ?? "",
                tertiary: `${r.latest.age_days}d ago`,
              },
            ]
          : []),
      ],
      empty: { text: "No reviews yet" },
    },
  });

  const summaryText = activeStore
    ? `Today: ${summary.today.orders} orders • ${money(summary.today.revenue, summary.today.currency)} revenue`
    : "Select a store";

  return {
    role: "VENDOR",
    icons,
    header: {
      greeting,
      subtitle,
      roleBadge: { label: "Vendor" },
      summary: {
        isLoading: !!isLoading,
        tone: summary.attention.pendingOrders || summary.attention.lowStockCount ? "warning" : "neutral",
        text: summaryText,
      },
    },
    secondaryContext: {
      title: "Your Stores",
      items: secondaryItems,
      onAdd: { label: "Add Store", onPress: () => router.push("/vendor/onboarding" as any) },
      showStatus: false,
    },
    actions: {
      title: "What would you like to do?",
      tiles,
      grid: { tilesPerRow: 3, maxVisible: 9 },
      seeAll: { label: "See all", onPress: () => router.push("/vendor/actions" as any) },
    },
    attention: {
      title: "Now",
      items: attentionItems,
      maxVisible: 4,
      empty: { text: "All caught up 🎉" },
    },
    sections: {
      items: sections,
    },
    discover: {
      title: "Discover",
      collapsedByDefault: true,
      items: [
        {
          key: "promo",
          title: "Boost sales with Promotions",
          subtitle: "Create discounts for slow movers",
          iconName: "store",
          tone: "success",
          onPress: () => router.push("/vendor/catalog" as any),
        },
        {
          key: "pack",
          title: "Packing tips",
          subtitle: "Reduce returns & damage",
          iconName: "truck",
          tone: "primary",
          onPress: () => router.push("/vendor/orders" as any),
        },
      ],
    },
  };
}
