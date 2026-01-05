import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addToCart, fetchShopItem } from "../api";
import type { CatalogItem } from "../types";

export default function ParentProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<CatalogItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShopItem(id);
      setItem(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load item");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onAddToCart() {
    if (!item) return;
    setBusy(true);
    try {
      await addToCart(item.id, 1);
      router.push("/parent/cart");
    } catch (e) {
      // keep silent for now; add toast later
    } finally {
      setBusy(false);
    }
  }

  function onBackToList() {
    // ✅ Best behavior: go back to the exact list page with its params/state
    if (router.canGoBack?.()) {
      router.back();
      return;
    }

    // Fallback if this page was opened directly (rare in app, more common in web)
    router.replace("/parent/shop/list");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading…</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "tomato" }}>{error || "Not found"}</Text>
        <Pressable style={styles.btn} onPress={load}>
          <Text>Retry</Text>
        </Pressable>

        <Pressable style={[styles.btn, { marginTop: 10 }]} onPress={onBackToList}>
          <Text>Back to List</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>{item.name}</Text>
      <Text style={styles.sub}>
        {item.category} • {item.kind}
      </Text>

      <View style={{ height: 12 }} />

      <Text style={styles.desc}>{item.description || "—"}</Text>

      <View style={{ height: 12 }} />
      <Text style={styles.price}>₹ {item.price}</Text>

      {!!item.rx_required && (
        <Text style={{ marginTop: 10, color: "orange", fontWeight: "700" }}>
          Prescription required
        </Text>
      )}

      <View style={{ flex: 1 }} />

      <Pressable style={styles.primaryBtn} onPress={onAddToCart} disabled={busy}>
        <Text style={styles.primaryBtnText}>{busy ? "Adding…" : "Add to Cart"}</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={onBackToList}>
        <Text style={styles.secondaryBtnText}>Back to List</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 20, fontWeight: "800" },
  sub: { marginTop: 6, opacity: 0.7 },
  desc: { marginTop: 8, opacity: 0.85, lineHeight: 20 },
  price: { fontSize: 18, fontWeight: "900" },
  btn: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.12)" },

  primaryBtn: { padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "700", opacity: 0.9 },
});
