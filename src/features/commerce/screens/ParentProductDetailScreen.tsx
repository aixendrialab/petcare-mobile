import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addToCart, fetchShopProduct } from "../api";
import type { ProductDetail } from "../types";
import { ShopItemShell } from "../components/shopItem/ShopItemShell";

export default function ParentProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShopProduct(productId);
      setItem(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load item");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!productId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  function onBack() {
    if ((router as any).canGoBack?.()) router.back();
    else router.replace("/parent/shop/list");
  }

  /** Choose the cheapest offer by default */
  const bestOffer = item?.offers?.[0];

  async function onAddToCart(qtyToAdd: number = 1) {
    if (!bestOffer) return;
    setBusy(true);
    try {
      await addToCart(bestOffer.offer_id, qtyToAdd);
      router.push("/parent/cart");
    } finally {
      setBusy(false);
    }
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
        <Pressable style={[styles.btn, { marginTop: 10 }]} onPress={onBack}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  const ratingAvg = item.review_summary?.rating_avg ?? 0;
  const ratingCount = item.review_summary?.rating_count ?? 0;
  const boughtLabel = item.bought_recently_label ?? undefined;

  const inStock = bestOffer?.fulfillment?.in_stock ?? true;

  const etaText = bestOffer?.fulfillment?.eta_text ?? "Fast delivery";
  const shippingFeeText = bestOffer?.fulfillment?.shipping_fee
    ? `₹${bestOffer.fulfillment.shipping_fee.amount} delivery`
    : "Free delivery";

  return (
    <ShopItemShell
      item={item}
      ratingAvg={ratingAvg}
      ratingCount={ratingCount}
      boughtLabel={boughtLabel}
      busy={busy}
      inStock={inStock}
      onGoToCart={() => router.push("/parent/cart")}
      qty={qty}
      onChangeQty={setQty}
      wished={wished}
      onToggleWish={() => setWished((v) => !v)}
      deliverTo={"Delivering to you"}
      onChangeDeliverTo={() => router.push("/parent/profile" as any)}
      etaText={etaText}
      shippingFeeText={shippingFeeText}
      onBack={onBack}
      onAddToCart={(q) => onAddToCart(q)}
      onBuyNow={(q) => onAddToCart(q)}
      onOpenItem={(pid) =>
        router.push({ pathname: "/parent/shop/item/[id]", params: { id: String(pid) } })
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  btn: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.12)" },
});
