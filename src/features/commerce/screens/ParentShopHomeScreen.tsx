import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const CATS = [
  { key: "ACCESSORY", title: "Accessories" },
  { key: "MEDICINE", title: "Medicines" },
  { key: "FOOD", title: "Food / Nutrition" }
  //,
  //{ key: "BOARDING", title: "Boarding / Hostels" },
];

export default function ParentShopHomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Shop</Text>
      <Text style={styles.sub}>Browse nearby stores and services</Text>

      <View style={{ height: 12 }} />

      {CATS.map((c) => (
        <Pressable
          key={c.key}
          style={styles.card}
          onPress={() => router.push({ pathname: "/parent/shop/list", params: { category: c.key } })}
        >
          <Text style={styles.cardTitle}>{c.title}</Text>
          <Text style={styles.cardSub}>Explore</Text>
        </Pressable>
      ))}

      <View style={{ height: 18 }} />

      <Pressable style={styles.primaryBtn} onPress={() => router.push("/parent/cart")}>
        <Text style={styles.primaryBtnText}>Go to Cart</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => router.push("/parent/orders")}>
        <Text style={styles.secondaryBtnText}>My Orders</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 22, fontWeight: "700" },
  sub: { marginTop: 4, opacity: 0.7 },
  card: {
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12, padding: 14, marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSub: { marginTop: 4, opacity: 0.6 },
  primaryBtn: { marginTop: 6, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "700" },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "600", opacity: 0.9 },
});
