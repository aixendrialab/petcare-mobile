type MinimalRouter = { push: (href: any) => void };

import type {
  IconRegistry,
  RoleHomeModel,
  SecondaryContextItem,
  ActionTileModel,
  AttentionItemModel,
  SectionModel,
  QuickTone,
} from "@/src/components/home";

import type { PharmacyHomeSummary } from "./types";

function toneFromCount(n: number, warnAt = 5): QuickTone {
  if (n >= warnAt) return "warning";
  if (n > 0) return "primary";
  return "neutral";
}

function moneyINR(n: number) {
  try {
    return `₹${Number(n).toLocaleString()}`;
  } catch {
    return `₹${n}`;
  }
}

export type BuildPharmacyHomeModelArgs = {
  summary: PharmacyHomeSummary;
  router: MinimalRouter;
  icons: IconRegistry;
  greeting: string;
  isLoading?: boolean;
};

export function buildPharmacyHomeModel(args: BuildPharmacyHomeModelArgs): RoleHomeModel {
  const { summary, router, icons, greeting, isLoading } = args;

  const activeOutlet = summary.outlets.find((o) => o.id === summary.activeOutletId) ?? null;

  const secondaryItems: SecondaryContextItem[] = summary.outlets.map((o) => ({
    key: String(o.id),
    title: o.name,
    subtitle: `${o.city} • ${o.readyToDispense} ready • ${o.lowStockCount} low stock`,
    onPress: () => router.push({ pathname: "/pharmacist/home", params: { outletId: String(o.id) } } as any),
  }));

  const attentionItems: AttentionItemModel[] = [
    {
      key: "pendingVerification",
      iconName: "prescription",
      tone: toneFromCount(summary.prescriptions.pendingVerification, 4),
      title: `${summary.prescriptions.pendingVerification} Rx pending verification`,
      subtitle: "Review & approve",
      cta: { text: "Verify", onPress: () => router.push("/pharmacist/prescriptions" as any) },
    },
    {
      key: "readyToDispense",
      iconName: "pills",
      tone: summary.prescriptions.readyToDispense ? "success" : "neutral",
      title: `${summary.prescriptions.readyToDispense} ready to dispense`,
      subtitle: "Pack / pickup / delivery",
      cta: { text: "Dispense", onPress: () => router.push("/pharmacist/dispense" as any) },
    },
    {
      key: "controlled",
      iconName: "syringe",
      tone: toneFromCount(summary.prescriptions.controlledPending, 1),
      title: `${summary.prescriptions.controlledPending} controlled pending`,
      subtitle: "Requires approval",
      cta: { text: "Review", onPress: () => router.push("/pharmacist/controlled" as any) },
    },
    {
      key: "expiry",
      iconName: "calendar",
      tone: toneFromCount(summary.inventory.expiringSoonCount, 1),
      title: `${summary.inventory.expiringSoonCount} expiring soon`,
      subtitle: "Check batches",
      cta: { text: "Manage", onPress: () => router.push("/pharmacist/expiry" as any) },
    },
    {
      key: "lowStock",
      iconName: "cart",
      tone: toneFromCount(summary.inventory.lowStockCount, 3),
      title: `${summary.inventory.lowStockCount} low-stock items`,
      subtitle: summary.inventory.lowStockItems.slice(0, 2).map((x) => x.name).join(" • "),
      cta: { text: "Restock", onPress: () => router.push("/pharmacist/inventory" as any) },
    },
  ];

  const tiles: ActionTileModel[] = [
    { key: "rx", title: "Prescriptions", subtitle: "Verify & track", tone: "primary", iconName: "prescription", badgeText: String(summary.prescriptions.pendingVerification || ""), onPress: () => router.push("/pharmacist/prescriptions" as any) },
    { key: "dispense", title: "Dispense", subtitle: "Pack / pickup", tone: "success", iconName: "pills", badgeText: String(summary.prescriptions.readyToDispense || ""), onPress: () => router.push("/pharmacist/dispense" as any) },
    { key: "orders", title: "Orders", subtitle: "Dispatch", tone: "primary", iconName: "truck", onPress: () => router.push("/pharmacist/orders" as any) },

    { key: "inventory", title: "Inventory", subtitle: "Stock & batches", tone: "warning", iconName: "cart", badgeText: String(summary.inventory.lowStockCount || ""), onPress: () => router.push("/pharmacist/inventory" as any) },
    { key: "catalog", title: "Catalog", subtitle: "SKUs & pricing", tone: "neutral", iconName: "store", onPress: () => router.push("/pharmacist/catalog" as any) },
    { key: "po", title: "Purchase Orders", subtitle: "Reorder", tone: "neutral", iconName: "upload", onPress: () => router.push("/pharmacist/purchase-orders" as any) },

    { key: "billing", title: "Billing", subtitle: "Payments", tone: "primary", iconName: "history", badgeText: String(summary.billing.pendingPayments || ""), onPress: () => router.push("/pharmacist/billing" as any) },
    { key: "reports", title: "Reports", subtitle: "Sales & stock", tone: "neutral", iconName: "history", onPress: () => router.push("/pharmacist/reports" as any) },
    { key: "messages", title: "Messages", subtitle: "Support", tone: "neutral", iconName: "history", onPress: () => router.push("/pharmacist/messages" as any) },
  ];

  const sections: SectionModel[] = [
    {
      key: "recentRx",
      title: "Recent Prescriptions",
      onSeeAll: () => router.push("/pharmacist/prescriptions" as any),
      content: {
        kind: "rows",
        rows: summary.recentPrescriptions.slice(0, 3).map((r) => ({
          key: String(r.id),
          primary: `${r.petName}: ${r.drugLine}`,
          secondary: `${r.status.replaceAll("_", " ")} • ${r.ownerName}`,
          tertiary: r.vetName ? `By ${r.vetName}` : undefined,
          onPress: () => router.push({ pathname: "/pharmacist/prescriptions/[id]", params: { id: String(r.id) } } as any),
        })),
        empty: { text: "No prescriptions yet." },
      },
    },
    {
      key: "expiryWatch",
      title: "Expiry Watchlist",
      onSeeAll: () => router.push("/pharmacist/expiry" as any) ,
      content: {
        kind: "rows",
        rows: summary.inventory.expiringBatches.slice(0, 3).map((b) => ({
          key: String(b.id),
          primary: `${b.name} • ${b.batchNo}`,
          secondary: `Expires in ${b.daysLeft} day(s)`,
          onPress: () => router.push("/pharmacist/expiry" as any),
        })),
        empty: { text: "No expiring batches 🎉" },
      },
    },
    {
      key: "lowStockPreview",
      title: "Low Stock",
      onSeeAll: () => router.push("/pharmacist/inventory" as any),
      content: {
        kind: "rows",
        rows: summary.inventory.lowStockItems.slice(0, 3).map((x) => ({
          key: String(x.id),
          primary: x.name,
          secondary: `Qty: ${x.qty}${x.reorderLevel ? ` • Reorder at ${x.reorderLevel}` : ""}`,
          onPress: () => router.push("/pharmacist/inventory" as any),
        })),
        empty: { text: "Stock looks good ✅" },
      },
    },
    {
      key: "salesSnapshot",
      title: "Sales Snapshot",
      onSeeAll: () => router.push("/pharmacist/reports" as any) ,
      content: {
        kind: "rows",
        rows: [
          { key: "rev", primary: "Revenue today", secondary: moneyINR(summary.kpis.todayRevenue) },
          { key: "rx", primary: "Prescriptions today", secondary: String(summary.kpis.prescriptionsToday) },
          { key: "pend", primary: "Pending dispense", secondary: String(summary.kpis.pendingDispense) },
        ],
      },
    },
  ];

  const headerSubtitle = `${activeOutlet?.name ?? "Pharmacy"}${activeOutlet?.city ? ` • ${activeOutlet.city}` : ""}`;

  const headerSummary = `Today: ${moneyINR(summary.kpis.todayRevenue)} • ${summary.kpis.prescriptionsToday} Rx • ${summary.kpis.pendingDispense} pending dispense`;

  return {
    role: "PHARMACIST",
    icons,
    header: {
      greeting,
      subtitle: headerSubtitle,
      roleBadge: { label: "Pharmacist" },
      summary: {
        isLoading: !!isLoading,
        tone: toneFromCount(summary.kpis.pendingDispense, 5),
        text: headerSummary,
      },
    },
    secondaryContext: {
      title: "Outlets",
      items: secondaryItems,
      onAdd: { label: "Add Outlet", onPress: () => router.push("/pharmacist/onboarding" as any) },
      showStatus: false,
    },
    attention: {
      title: "Now",
      items: attentionItems,
      maxVisible: 5,
      empty: { text: "All caught up 🎉" },
    },
    actions: {
      title: "What would you like to do?",
      tiles,
      grid: { tilesPerRow: 3, maxVisible: 9 },
      seeAll: { label: "See all", onPress: () => router.push("/pharmacist/actions" as any) },
    },
    sections: {
      items: sections,
    },
    discover: {
      title: "Discover",
      items:
        (summary.discover ?? []).map((d) => ({
          key: d.key,
          title: d.title,
          subtitle: d.subtitle ?? undefined,
          iconName: "history",
          tone: "neutral",
          onPress: () => router.push("/pharmacist/discover" as any),
        })) ?? [],
    },
  };
}