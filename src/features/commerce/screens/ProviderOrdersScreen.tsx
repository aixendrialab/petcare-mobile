import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchProviderOrders } from "../api";
import type { OrderListItem } from "../types";
import type { ProviderRole } from "@/src/features/providers/types";

export default function ProviderOrdersScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<OrderListItem[]>([]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProviderOrders(role);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [role]);

  const base = role === "pharmacist" ? "/pharmacist/orders/[id]" : "/vendor/orders/[id]";

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Orders</Text>
      <Text style={{ opacity: 0.7, marginTop: 4 }}>Role: {role}</Text>

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
              onPress={() => router.push({ pathname: base as any, params: { id: String(item.id) } })}
            >
              <Text style={styles.cardTitle}>Order #{item.id}</Text>
              <Text style={{ opacity: 0.7, marginTop: 6 }}>
                {item.status} • ₹ {item.grand_total}
              </Text>
              <Text style={{ opacity: 0.6, marginTop: 4 }}>{new Date(item.created_at).toLocaleString()}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No orders yet.</Text>}
        />
      )}

      <Pressable style={styles.btn} onPress={load}>
        <Text>Refresh</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "900" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: "900" },
  btn: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
});
