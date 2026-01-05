import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen, Tile } from "@/src/ui";
import type { ProviderRole } from "../types";
import { fetchMyProvider } from "../api";
import { fetchProviderOrders, fetchInventory } from "@/src/features/commerce/api";
import type { Order } from "@/src/features/commerce/types";

type Kpi = {
  ordersTotal: number;
  pending: number;
  toPack: number;
  inDelivery: number;
  delivered: number;
  cancelled: number;
  rxPending: number;       // pharmacy-only
  lowStock: number;
};

function roleBase(role: ProviderRole) {
  switch (role) {
    case "pharmacy":
      return "/pharmacist";
    case "vendor":
      return "/vendor";
    case "hostel":
      return "/hostel";
    case "nutritionist":
      return "/nutritionist";
    case "vet":
      return "/vet";
    default:
      return "/roles";
  }
}

function computeKpis(role: ProviderRole, orders: Order[], inventory: any[]): Kpi {
  const statusCount = (s: string) => orders.filter((o: any) => o.status === s).length;

  const rxPending =
    role === "pharmacy"
      ? orders.filter((o: any) => o.prescription_required && !o.prescription_attached).length
      : 0;

  const lowStock = inventory.filter((x: any) => {
    const qty = Number(x.stock_qty ?? 0);
    const rl = Number(x.reorder_level ?? 0);
    return rl > 0 && qty <= rl;
  }).length;

  const pending = orders.filter((o: any) => ["CREATED", "CONFIRMED", "PACKED", "DISPATCHED"].includes(o.status)).length;

  return {
    ordersTotal: orders.length,
    pending,
    toPack: statusCount("CONFIRMED"),
    inDelivery: statusCount("DISPATCHED"),
    delivered: statusCount("DELIVERED"),
    cancelled: statusCount("CANCELLED"),
    rxPending,
    lowStock,
  };
}

export default function ProviderDashboardScreen({ role }: { role: ProviderRole }) {
  const [loading, setLoading] = useState(true);
  const [providerOk, setProviderOk] = useState<boolean>(true);
  const [kpi, setKpi] = useState<Kpi | null>(null);

  const base = useMemo(() => roleBase(role), [role]);

  async function load() {
    setLoading(true);
    try {
      const p = await fetchMyProvider(role);
      const ok = !!p && (p.status === "ACTIVE" || p.status === "PENDING"); // allow PENDING for mock
      setProviderOk(ok);

      // even if profile missing, still load counts (mock-friendly)
      const [orders, inv] = await Promise.all([
        fetchProviderOrders(role).catch(() => []),
        fetchInventory(role).catch(() => []),
      ]);

      setKpi(computeKpis(role, orders as any, inv as any));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [role]);

  function go(path: string) {
    router.push(path as any);
  }

  if (loading) {
    return (
      <Screen title="Dashboard" subtitle={`${role}`}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading…</Text>
        </View>
      </Screen>
    );
  }

  const rxBadge = role === "pharmacy" ? (kpi?.rxPending ?? 0) : undefined;
  const lowStockBadge = kpi?.lowStock ?? 0;

  return (
    <Screen title="Dashboard" subtitle={`${role} • Today snapshot`}>
      {!providerOk ? (
        <Pressable style={styles.warnBox} onPress={() => go(`${base}/onboarding`)}>
          <Text style={{ fontWeight: "900" }}>Complete your profile</Text>
          <Text style={{ opacity: 0.75, marginTop: 4 }}>
            Add business details{role === "pharmacy" ? " & license" : ""} to enable store features.
          </Text>
          <Text style={{ marginTop: 8, fontWeight: "800", opacity: 0.9 }}>Go to Onboarding →</Text>
        </Pressable>
      ) : null}

      <View style={styles.grid}>
        {role === "pharmacy" ? (
          <Tile
            icon="document-text-outline"
            label="eRx Queue"
            caption={`${rxBadge ?? 0} pending`}
            onPress={() => go(`${base}/erx`)}
          />
        ) : null}

        <Tile
          icon="cart-outline"
          label="Orders"
          caption={`${kpi?.pending ?? 0} pending`}
          onPress={() => go(`${base}/orders`)}
        />

        <Tile
          icon="pricetag-outline"
          label="Catalog"
          caption="Manage items"
          onPress={() => go(`${base}/catalog`)}
        />

        <Tile
          icon="cube-outline"
          label="Inventory"
          caption={lowStockBadge > 0 ? `${lowStockBadge} low stock` : "All good"}
          onPress={() => go(`${base}/inventory`)}
        />

        {role === "vendor" ? (
          <Tile icon="bicycle-outline" label="Delivery" caption="Dispatch & delivered" onPress={() => go(`${base}/delivery`)} />
        ) : null}

        <Tile icon="person-circle-outline" label="Profile" caption="Business details" onPress={() => go(`${base}/profile`)} />
      </View>

      <View style={{ height: 14 }} />

      <View style={styles.kpiBox}>
        <Text style={styles.kpiTitle}>Summary</Text>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Total orders</Text>
          <Text style={styles.kpiValue}>{kpi?.ordersTotal ?? 0}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>To pack (CONFIRMED)</Text>
          <Text style={styles.kpiValue}>{kpi?.toPack ?? 0}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>In delivery (DISPATCHED)</Text>
          <Text style={styles.kpiValue}>{kpi?.inDelivery ?? 0}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Delivered</Text>
          <Text style={styles.kpiValue}>{kpi?.delivered ?? 0}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Cancelled</Text>
          <Text style={styles.kpiValue}>{kpi?.cancelled ?? 0}</Text>
        </View>

        {role === "pharmacy" ? (
          <View style={styles.kpiRow}>
            <Text style={styles.kpiLabel}>eRx pending</Text>
            <Text style={[styles.kpiValue, { color: "orange" }]}>{kpi?.rxPending ?? 0}</Text>
          </View>
        ) : null}

        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Low stock</Text>
          <Text style={[styles.kpiValue, lowStockBadge > 0 ? { color: "orange" } : null]}>{lowStockBadge}</Text>
        </View>

        <Pressable style={styles.refreshBtn} onPress={load}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  warnBox: {
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.35)",
    backgroundColor: "rgba(255,165,0,0.08)",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  kpiBox: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
    marginTop: 6,
  },
  kpiTitle: { fontWeight: "900", marginBottom: 10 },
  kpiRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  kpiLabel: { opacity: 0.75, fontWeight: "700" },
  kpiValue: { fontWeight: "900" },

  refreshBtn: {
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  refreshText: { textAlign: "center", fontWeight: "900" },
});
