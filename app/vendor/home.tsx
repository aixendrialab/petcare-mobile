import React, { useEffect, useState } from "react";
import { Screen, Tile } from "@/src/ui";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { fetchVendorDashboard } from "@/src/features/commerce/api";

export default function VendorHome() {
  const [kpi, setKpi] = useState<{ pending_orders: number; low_stock: number; active_items: number } | null>(null);

  useEffect(() => {
    fetchVendorDashboard().then(setKpi).catch(() => setKpi(null));
  }, []);

  return (
    <Screen title="Vendor / Shop" subtitle="Catalog • Inventory • Orders • Delivery">
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}><Text style={styles.kpiVal}>{kpi?.pending_orders ?? "—"}</Text><Text style={styles.kpiLbl}>Pending orders</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiVal}>{kpi?.low_stock ?? "—"}</Text><Text style={styles.kpiLbl}>Low stock</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiVal}>{kpi?.active_items ?? "—"}</Text><Text style={styles.kpiLbl}>Active items</Text></View>
      </View>

      <View style={{ height: 14 }} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        <Tile icon="speedometer-outline" label="Dashboard" caption="Summary" onPress={() => router.push("/vendor/dashboard")} />
        <Tile icon="pricetag-outline" label="Catalog" caption="Items" onPress={() => router.push("/vendor/catalog")} />
        <Tile icon="cube-outline" label="Inventory" caption="Stock" onPress={() => router.push("/vendor/inventory")} />
        <Tile icon="cart-outline" label="Orders" caption="Pack" onPress={() => router.push("/vendor/orders")} />
        <Tile icon="bicycle-outline" label="Delivery" caption="Dispatch" onPress={() => router.push("/vendor/delivery")} />
        <Tile icon="person-circle-outline" label="Profile" caption="Business" onPress={() => router.push("/vendor/profile")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpiRow: { flexDirection: "row", gap: 10 },
  kpiCard: { flex: 1, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 12 },
  kpiVal: { fontSize: 18, fontWeight: "900" },
  kpiLbl: { marginTop: 6, opacity: 0.7, fontWeight: "700" },
});
