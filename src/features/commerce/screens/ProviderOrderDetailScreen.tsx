import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchOrder, setProviderOrderStatus } from "../api";
import type { Order, OrderStatus } from "../types";
import type { ProviderRole } from "@/src/features/providers/types";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  CREATED: "CONFIRMED",
  CONFIRMED: "PACKED",
  PACKED: "DISPATCHED",
  DISPATCHED: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

export default function ProviderOrderDetailScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchOrder(id);
      setOrder(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    load();
  }, [id]);

  async function advance() {
    if (!order) return;
    const ns = NEXT_STATUS[order.status];
    if (!ns) return;

    setBusy(true);
    try {
      await setProviderOrderStatus(role, order.id, ns);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!order) return;
    setBusy(true);
    try {
      await setProviderOrderStatus(role, order.id, "CANCELLED");
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={{ opacity: 0.7 }}>Order not found</Text>
        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  const next = NEXT_STATUS[order.status];

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Order #{order.id}</Text>
      <Text style={{ opacity: 0.7, marginTop: 6 }}>Status: {order.status}</Text>
      <Text style={{ opacity: 0.7, marginTop: 4 }}>Total: ₹ {order.total_amount}</Text>

      {!!order.prescription_required && (
        <Text style={{ marginTop: 10, color: order.prescription_attached ? "lightgreen" : "orange", fontWeight: "800" }}>
          RX: {order.prescription_attached ? "Attached" : "Pending"}
        </Text>
      )}

      <View style={{ height: 12 }} />

      <FlatList
        data={order.items ?? []}
        keyExtractor={(x) => String(x.catalog_item_id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: "800" }}>{item.name}</Text>
            <Text style={{ opacity: 0.7, marginTop: 6 }}>
              Qty: {item.qty} • ₹ {item.unit_price}
            </Text>
            <Text style={{ marginTop: 6, fontWeight: "900" }}>₹ {item.line_total}</Text>
          </View>
        )}
      />

      {next ? (
        <Pressable style={styles.primaryBtn} onPress={advance} disabled={busy}>
          <Text style={styles.primaryBtnText}>{busy ? "Updating…" : `Move to ${next}`}</Text>
        </Pressable>
      ) : null}

      {order.status !== "CANCELLED" && order.status !== "DELIVERED" ? (
        <Pressable style={styles.secondaryBtn} onPress={cancel} disabled={busy}>
          <Text style={styles.secondaryBtnText}>{busy ? "Cancelling…" : "Cancel Order"}</Text>
        </Pressable>
      ) : null}

      <Pressable style={styles.btn} onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "900" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },
  btn: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtn: { padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800" },
});
