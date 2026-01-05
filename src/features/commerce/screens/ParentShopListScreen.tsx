import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchShopItems } from "../api";
import type { CatalogItem } from "../types";

export default function ParentShopListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = useMemo(() => String(params.category ?? ""), [params.category]);

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const ALLOWED = new Set(["ACCESSORY", "MEDICINE", "FOOD"]);
  const safeCategory = ALLOWED.has(category) ? category : "";
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShopItems({
        category: safeCategory || undefined,
        q: q || undefined,
        limit: 50,
        offset: 0,
      });

      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>{category ? `${category} Items` : "Shop Items"}</Text>

      <View style={styles.searchRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search…"
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.searchInput}
        />
        <Pressable style={styles.searchBtn} onPress={load}>
          <Text style={styles.searchBtnText}>Go</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: "tomato" }}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={load}>
            <Text>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push({ pathname: "/parent/shop/item/[id]", params: { id: String(item.id) } })}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub} numberOfLines={2}>
                {item.description || "—"}
              </Text>
              <View style={styles.row}>
                <Text style={styles.badge}>{item.category}</Text>
                <Text style={styles.price}>₹ {item.price}</Text>
              </View>
              {!!item.rx_required && (
                <Text style={{ marginTop: 6, color: "orange", fontWeight: "600" }}>Prescription required</Text>
              )}
            </Pressable>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No items found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  retryBtn: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.12)" },

  searchRow: { flexDirection: "row", gap: 10, marginTop: 12, marginBottom: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
  },
  searchBtn: { paddingHorizontal: 14, justifyContent: "center", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  searchBtnText: { fontWeight: "700" },

  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: "700", fontSize: 16 },
  cardSub: { marginTop: 6, opacity: 0.7 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, alignItems: "center" },
  badge: { opacity: 0.7, fontWeight: "600" },
  price: { fontWeight: "800" },
});
