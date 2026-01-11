import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchOrder } from "../api";
import type { OrderDetail } from "../types";

export default function ParentOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);

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
        <Text style={{ opacity: 0.7 }}>Order not found.</Text>
        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const total = order.totals?.grand_total ?? 0;

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Order #{order.id}</Text>
      <Text style={{ opacity: 0.7, marginTop: 6 }}>
        {order.store?.display_name ?? "Store"} • {order.status}
      </Text>
      <Text style={{ opacity: 0.7, marginTop: 4 }}>
        {order.created_at ? new Date(order.created_at).toLocaleString() : ""}
      </Text>

      <View style={{ height: 12 }} />

      <FlatList
        data={order.items ?? []}
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
        ListFooterComponent={
          <View style={{ marginTop: 10 }}>
            <Text style={styles.total}>Total: ₹ {total}</Text>

            <View style={styles.deliveryBox}>
              <Text style={{ fontWeight: "900" }}>Delivery Address</Text>
              <Text style={{ opacity: 0.75, marginTop: 6 }}>
                {order.address?.recipient} • {order.address?.phone ?? ""}
              </Text>
              <Text style={{ opacity: 0.75, marginTop: 6 }}>
                {order.address?.line1}
                {order.address?.line2 ? `, ${order.address.line2}` : ""}
              </Text>
              <Text style={{ opacity: 0.75, marginTop: 4 }}>
                {order.address?.city}, {order.address?.state} • {order.address?.pincode}
              </Text>
            </View>
          </View>
        }
      />

      <Pressable style={styles.btn} onPress={() => router.push("/parent/orders" as any)}>
        <Text>Back to Orders</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "900" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  btn: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },
  total: { fontSize: 16, fontWeight: "900", marginTop: 10 },
  deliveryBox: { marginTop: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
});
