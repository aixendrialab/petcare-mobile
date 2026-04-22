// app/vendor/home.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "@/src/auth";
import type { ProviderRole } from "@/src/features/providers/types";

import { RoleHomeShell, IconName, QuickTile, SectionDef, AppliesToItem } from "@/src/components/home/RoleHomeShell";

import {
  StoreIcon,
  CartOutlineIcon,
  TruckOutlineIcon,
  HistoryIcon,
} from "@/src/components/quickActions/QuickActionIcons";

import { useStoreContext } from "@/src/features/providers/storeContext";
import { fetchMyStores, fetchStoreOffers } from "@/src/features/providers/api";

const ICONS: Record<IconName, React.ReactElement> = {
  stethoscope: <HistoryIcon />, // unused for vendor
  syringe: <HistoryIcon />,
  calendar: <HistoryIcon />,
  history: <HistoryIcon />,
  video: <HistoryIcon />,
  upload: <HistoryIcon />,
  store: <StoreIcon />,
  cart: <CartOutlineIcon />,
  truck: <TruckOutlineIcon />,
  pills: <HistoryIcon />,
  bowl: <HistoryIcon />,
  prescription: <HistoryIcon />,
};

type StoreRow = { id: number; display_name: string };

export default function VendorHome() {
  const router = useRouter();
  const { user } = useAuth();

  const role: ProviderRole = "vendor";

  const { store, setStore, hydrate } = useStoreContext();

  const [stores, setStores] = useState<StoreRow[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  // lightweight KPIs (optional)
  const [kpiPending, setKpiPending] = useState<string>("—");
  const [kpiLowStock, setKpiLowStock] = useState<string>("—");
  const [kpiActiveOffers, setKpiActiveOffers] = useState<string>("—");

  useEffect(() => {
    hydrate?.().catch?.(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadStores() {
    setLoadingStores(true);
    try {
      const s = await fetchMyStores(role);
      setStores(s as any);

      // if no store selected, auto-pick latest
      if (!store?.store_id && s?.length) {
        await setStore({ store_id: s[0].id, display_name: s[0].display_name });
      }
    } catch {
      setStores([]);
    } finally {
      setLoadingStores(false);
    }
  }

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // OPTIONAL: store scoped KPIs (enable after store_id is supported in APIs)
  useEffect(() => {
    async function loadKpis() {
      if (!store?.store_id) {
        setKpiPending("—");
        setKpiLowStock("—");
        setKpiActiveOffers("—");
        return;
      }

      try {
        // Active offers count from /store/items
        const offers = await fetchStoreOffers(role, store.store_id).catch(() => []);
        setKpiActiveOffers(String(offers.length));

        // low stock count can be derived from offers (stock_qty <= reorder_level)
        const low = offers.filter((x: any) => Number(x.reorder_level ?? 0) > 0 && Number(x.stock_qty ?? 0) <= Number(x.reorder_level ?? 0)).length;
        setKpiLowStock(String(low));

        // pending orders needs /provider/orders?store_id=... (add later)
        setKpiPending("—");
      } catch {
        setKpiPending("—");
        setKpiLowStock("—");
        setKpiActiveOffers("—");
      }
    }

    loadKpis();
  }, [store?.store_id]);

  const greeting = `Hello, ${user?.name?.trim() || "there"} 👋`;
  const subtitle = user?.phone;

  const appliesToItems: AppliesToItem[] = useMemo(() => {
    const items: AppliesToItem[] = [];

    // Store chips
    for (const s of stores) {
      items.push({
        key: `store-${s.id}`,
        title: s.display_name,
        subtitle: store?.store_id === s.id ? "Selected" : "Tap to select",
        imageUri: null,
        onPress: () => setStore({ store_id: s.id, display_name: s.display_name }),
      });
    }

    // + Add store chip
    items.push({
      key: "store-add",
      title: "+ Add Store",
      subtitle: "Create a new store",
      imageUri: null,
      onPress: () => router.push("/vendor/onboarding" as any),
    });

    return items;
  }, [stores, store?.store_id, router]);

  const tiles: QuickTile[] = useMemo(
    () => [
      { key: "catalog", title: "Catalog", subtitle: "Products", tone: "success", iconName: "store", onPress: () => router.push("/vendor/catalog" as any) },
      { key: "inv", title: "Inventory", subtitle: "Stock", tone: "warning", iconName: "cart", onPress: () => router.push("/vendor/inventory" as any) },
      { key: "orders", title: "Orders", subtitle: "Pack", tone: "primary", iconName: "truck", onPress: () => router.push("/vendor/orders" as any) },
      { key: "delivery", title: "Delivery", subtitle: "Dispatch", tone: "neutral", iconName: "truck", onPress: () => router.push("/vendor/delivery" as any) },
      { key: "profile", title: "Profile", subtitle: "Business", tone: "neutral", iconName: "history", onPress: () => router.push("/vendor/profile" as any) },
    ],
    [router]
  );

  const sections: SectionDef[] = useMemo(() => {
    const selectedStoreName = store?.display_name || "Select a store";

    if (loadingStores) {
      return [
        {
          key: "loading",
          title: "Loading stores…",
          render: () => <KpiRow label="Please wait" value="…" />,
        },
      ];
    }

    if (!stores.length) {
      return [
        {
          key: "noStores",
          title: "No stores yet",
          onSeeAll: () => router.push("/vendor/onboarding" as any),
          render: () => <KpiRow label="Action" value="Create your first store" />,
        },
      ];
    }

    if (!store?.store_id) {
      return [
        {
          key: "pickStore",
          title: "Pick a store",
          render: () => <KpiRow label="Selected" value={selectedStoreName} />,
        },
      ];
    }

    return [
      {
        key: "pendingOrders",
        title: `Pending Orders • ${selectedStoreName}`,
        onSeeAll: () => router.push("/vendor/orders" as any),
        render: () => <KpiRow label="Count" value={kpiPending} />,
      },
      {
        key: "lowStock",
        title: `Low Stock • ${selectedStoreName}`,
        onSeeAll: () => router.push("/vendor/inventory" as any),
        render: () => <KpiRow label="Items" value={kpiLowStock} />,
      },
      {
        key: "activeItems",
        title: `Active Listings • ${selectedStoreName}`,
        onSeeAll: () => router.push("/vendor/catalog" as any),
        render: () => <KpiRow label="Count" value={kpiActiveOffers} />,
      },
    ];
  }, [loadingStores, stores.length, store?.store_id, store?.display_name, kpiPending, kpiLowStock, kpiActiveOffers, router]);

  return (
    <RoleHomeShell
      role="VENDOR"
      greeting={greeting}
      subtitle={subtitle}
      appliesToTitle="Your Stores"
      appliesToItems={appliesToItems}
      tilesTitle="What would you like to do?"
      tilesPerRow={3}
      tiles={tiles}
      icons={ICONS}
      sections={sections}
    />
  );
}

function KpiRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text style={{ fontWeight: "800" }}>{label}</Text>
      <Text style={{ marginTop: 6, opacity: 0.75 }}>{value}</Text>
    </View>
  );
}
