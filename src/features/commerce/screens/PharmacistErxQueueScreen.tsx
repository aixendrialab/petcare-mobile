import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import type { Order } from "../types";
import { fetchProviderOrders, setProviderOrderStatus } from "../api";

export default function PharmacistErxQueueScreen() {
  const role = "pharmacy" as const;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [items, setItems] = useState<Order[]>([]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProviderOrders(role);
      // show orders that require RX and not attached
      setItems(data.filter((o) => o.prescription_required && !o.prescription_attached));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function verify(order_id: number) {
    setBusyId(order_id);
    try {
      // For mock: simply confirm order after "verification".
      // Later: call /provider/orders/{id}/verify-prescription
      await setProviderOrderStatus(role, order_id, "CONFIRMED");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>eRx Queue</Text>
      <Text style={styles.sub}>Orders waiting for prescription verification</Text>

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
              <Pressable
                onPress={() => router.push({ pathname: "/pharmacist/orders/[id]", params: { id: String(item.id) } })}
              >
                <Text style={styles.cardTitle}>Order #{item.id}</Text>
                <Text style={{ opacity: 0.7, marginTop: 6 }}>
                  Total: ₹ {item.total_amount} • Status: {item.status}
                </Text>
              </Pressable>

              <View style={{ height: 10 }} />

              <Pressable
                style={styles.primaryBtn}
                onPress={() => verify(item.id)}
                disabled={busyId === item.id}
              >
                <Text style={styles.primaryBtnText}>{busyId === item.id ? "Verifying…" : "Verify Prescription"}</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No pending eRx right now.</Text>}
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
