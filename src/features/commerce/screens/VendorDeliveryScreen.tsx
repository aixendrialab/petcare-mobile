import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import type { ProviderRole } from "@/src/features/providers/types";
import type { Order } from "../types";
import { fetchProviderOrders, setProviderOrderStatus } from "../api";

export default function VendorDeliveryScreen({ role }: { role: ProviderRole }) {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [items, setItems] = useState<Order[]>([]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProviderOrders(role);
      // show only dispatchable/delivery-related
      setItems(data.filter((o) => ["PACKED", "DISPATCHED"].includes(o.status)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [role]);

  async function markOutForDelivery(order_id: number) {
    setBusyId(order_id);
    try {
      await setProviderOrderStatus(role, order_id, "DISPATCHED");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function markDelivered(order_id: number) {
    setBusyId(order_id);
    try {
      await setProviderOrderStatus(role, order_id, "DELIVERED");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Delivery</Text>
      <Text style={styles.sub}>Quick delivery actions</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Order #{item.id}</Text>
              <Text style={{ opacity: 0.7, marginTop: 6 }}>
                Status: {item.status} • ₹ {item.total_amount}
              </Text>

              <View style={{ height: 10 }} />

              {item.status === "PACKED" ? (
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => markOutForDelivery(item.id)}
                  disabled={busyId === item.id}
                >
                  <Text style={styles.primaryBtnText}>{busyId === item.id ? "Updating…" : "Mark Out for Delivery"}</Text>
                </Pressable>
              ) : null}

              {item.status === "DISPATCHED" ? (
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => markDelivered(item.id)}
                  disabled={busyId === item.id}
                >
                  <Text style={styles.primaryBtnText}>{busyId === item.id ? "Updating…" : "Mark Delivered"}</Text>
                </Pressable>
              ) : null}
            </View>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No deliveries right now.</Text>}
        />
      )}

      <Pressable style={styles.secondaryBtn} onPress={load}>
        <Text style={styles.secondaryBtnText}>Refresh</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: "900", fontSize: 16 },

  primaryBtn: { padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },

  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800", opacity: 0.9 },
});
