import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { fetchCart, placeOrder } from "../api";

type CartItem = { catalog_item_id: number; name: string; qty: number; unit_price: number; line_total: number; provider_id: number };

export default function ParentCartScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ items: CartItem[]; total_amount: number } | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchCart();
      setCart(data as any);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onPlaceOrder() {
    if (!cart?.items?.length) return;

    // For now: assume single provider in cart (you can enforce this in server mock)
    const provider_id = cart.items[0].provider_id;

    setBusy(true);
    try {
      const res = await placeOrder({
        provider_id,
        items: cart.items.map((x) => ({ catalog_item_id: x.catalog_item_id, qty: x.qty })),
      });
      router.replace({ pathname: "/parent/orders/[id]", params: { id: String(res.order_id) } });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading cart…</Text>
      </View>
    );
  }

  const items = cart?.items ?? [];
  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Cart</Text>

      <FlatList
        data={items}
        keyExtractor={(x) => String(x.catalog_item_id)}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: "800" }}>{item.name}</Text>
            <Text style={{ opacity: 0.7, marginTop: 6 }}>
              Qty: {item.qty} • ₹ {item.unit_price}
            </Text>
            <Text style={{ marginTop: 6, fontWeight: "800" }}>₹ {item.line_total}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>Cart is empty.</Text>}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ₹ {cart?.total_amount ?? 0}</Text>
        <Pressable style={styles.primaryBtn} onPress={onPlaceOrder} disabled={busy || items.length === 0}>
          <Text style={styles.primaryBtnText}>{busy ? "Placing…" : "Place Order"}</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.push("/parent/shop")}>
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 20, fontWeight: "800" },
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },

  footer: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)", paddingTop: 12 },
  total: { fontSize: 16, fontWeight: "900", marginBottom: 10 },

  primaryBtn: { padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "700", opacity: 0.9 },
});
