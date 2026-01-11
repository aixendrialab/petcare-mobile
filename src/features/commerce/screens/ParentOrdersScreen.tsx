import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchMyOrders } from "../api";
import type { OrderListItem } from "../types";

export default function ParentOrdersScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<OrderListItem[]>([]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchMyOrders();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>My Orders</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push({ pathname: "/parent/orders/[id]" as any, params: { id: String(item.id) } })}
            >
              <Text style={styles.cardTitle}>Order #{item.id}</Text>
              <Text style={{ opacity: 0.7, marginTop: 6 }}>
                {item.store_name} • {item.status}
              </Text>
              <Text style={{ marginTop: 6, fontWeight: "900" }}>₹ {item.grand_total}</Text>
              <Text style={{ marginTop: 4, opacity: 0.6 }}>
                {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No orders yet.</Text>}
        />
      )}

      <Pressable style={styles.secondaryBtn} onPress={() => router.push("/parent/shop" as any)}>
        <Text style={styles.secondaryBtnText}>Go to Shop</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "800" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: "900" },
  secondaryBtn: { marginTop: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "700", opacity: 0.9 },
});
