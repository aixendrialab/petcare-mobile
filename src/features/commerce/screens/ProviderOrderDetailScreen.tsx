import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchOrder, setProviderOrderStatus } from "../api";
import type { OrderDetail, OrderStatus } from "../types";
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
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      // NOTE: this endpoint is parent-owned (checks parent_user_id).
      // For true provider detail you should add /provider/orders/{id} on backend.
      const data = await fetchOrder(id);
      setOrder(data);
    } catch (e: any) {
      setOrder(null);
      setErr(e?.message ?? "Order not accessible via parent endpoint");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    load();
  }, [id]);

  const next = useMemo(() => (order ? NEXT_STATUS[order.status] : null), [order]);

  async function advance() {
    if (!order || !next) return;
    setBusy(true);
    try {
      await setProviderOrderStatus(role, order.id, next);
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
        <Text style={{ opacity: 0.8, textAlign: "center" }}>
          {err ?? "Order not found"}
        </Text>
        <Text style={{ opacity: 0.6, marginTop: 10, textAlign: "center" }}>
          Provider order detail needs a backend endpoint like GET /provider/orders/{`{id}`} (role-scoped).
        </Text>
        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  const total = order.totals?.grand_total ?? 0;

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Order #{order.id}</Text>
      <Text style={{ opacity: 0.7, marginTop: 6 }}>
        Status: {order.status} • Total: ₹ {total}
      </Text>

      <View style={{ height: 12 }} />

      <FlatList
        data={order.items}
        keyExtractor={(x) => `${x.product_id}:${x.sku_id}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: "800" }}>{item.title}</Text>
            <Text style={{ opacity: 0.7, marginTop: 6 }}>
              Qty: {item.qty} • ₹ {item.unit_price}
            </Text>
            <Text style={{ marginTop: 6, fontWeight: "900" }}>₹ {item.line_total}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ opacity: 0.6, marginTop: 12 }}>No items in this order</Text>}
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
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },
  btn: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtn: { padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800" },
});
