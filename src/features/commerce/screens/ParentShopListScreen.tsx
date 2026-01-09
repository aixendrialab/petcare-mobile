import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, TextInput, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchShopItems } from "../api";
import type { ProductCard, CatalogCategory } from "../types";
import { Badge } from "../components/Badge";
import { Stars } from "../components/Stars";

function ProductRowCard({
  item,
  onOpen,
}: {
  item: ProductCard;
  onOpen: () => void;
}) {
  const img = item.primary_image || "https://picsum.photos/seed/petcare/240/240";
  const price = item.best_price?.amount ?? 0;
  const mrp = item.mrp?.amount ?? 0;

  return (
    <Pressable style={styles.rowCard} onPress={onOpen}>
      <Image source={{ uri: img }} style={styles.thumb} />

      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

        {!!item.brand && (
          <Text style={styles.muted} numberOfLines={1}>
            {item.brand}
          </Text>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Stars value={item.rating_avg ?? 0} />
          <Text style={styles.muted}> ({item.rating_count ?? 0})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹ {Math.round(price)}</Text>
          {mrp > price ? <Text style={styles.mrp}>₹ {Math.round(mrp)}</Text> : null}
          {!!item.discount_pct ? <Text style={styles.off}>-{item.discount_pct}%</Text> : null}
        </View>

        <View style={styles.badgeRow}>
          {!!item.badges?.length && <Badge text={item.badges[0]} variant="deal" />}
        </View>
      </View>
    </Pressable>
  );
}

export default function ParentShopListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = useMemo(() => String(params.category ?? ""), [params.category]);
  const initialQ = useMemo(() => String(params.q ?? ""), [params.q]);

  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ProductCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ALLOWED = new Set<CatalogCategory>(["ACCESSORY", "MEDICINE", "FOOD", "SERVICE"]);
  const safeCategory = (ALLOWED.has(category as any) ? category : "") as CatalogCategory | "";

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
      <Text style={styles.h1}>{safeCategory ? safeCategory : "Shop"}</Text>

      <View style={styles.searchRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search products…"
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.searchInput}
          onSubmitEditing={load}
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
          keyExtractor={(x) => String(x.product_id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <ProductRowCard
              item={item}
              onOpen={() =>
                router.push({ pathname: "/parent/shop/item/[id]", params: { id: String(item.product_id) } })
              }
            />
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No items found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "900" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  retryBtn: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.12)" },

  searchRow: { flexDirection: "row", gap: 10, marginTop: 12, marginBottom: 10 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchBtn: { paddingHorizontal: 14, justifyContent: "center", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  searchBtnText: { fontWeight: "900" },

  rowCard: { flexDirection: "row", gap: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 12, marginBottom: 10, alignItems: "center" },
  thumb: { width: 72, height: 72, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)" },

  title: { fontWeight: "900", fontSize: 14 },
  muted: { opacity: 0.7, marginTop: 2, fontSize: 12 },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  price: { fontWeight: "900", fontSize: 16 },
  mrp: { textDecorationLine: "line-through", opacity: 0.6 },
  off: { fontWeight: "900", color: "tomato" },

  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" },
});
