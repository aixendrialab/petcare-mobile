import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import type { ProductCard } from "../../types";
import { Badge } from "../Badge";
import { Stars } from "../Stars";

function formatINR(amount?: number) {
  const a = typeof amount === "number" ? amount : 0;
  return `₹${Math.round(a)}`;
}

export function MiniItemCard({
  item,
  onPress,
}: {
  item: ProductCard;
  onPress: () => void;
}) {
  const img = item.primary_image || "https://picsum.photos/seed/petcare-mini/300/300";

  const price = item.best_price?.amount ?? 0;
  const mrp = item.mrp?.amount ?? 0;

  const hasDiscount = useMemo(() => mrp > 0 && price > 0 && mrp > price, [mrp, price]);
  const offPct = useMemo(() => {
    if (item.discount_pct != null) return item.discount_pct;
    if (!hasDiscount) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  }, [item.discount_pct, hasDiscount, mrp, price]);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: img }} style={styles.image} />

        {!!item.badges?.length && (
          <View style={styles.badgeOverlay}>
            <Badge text={item.badges[0]} variant="deal" />
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.ratingRow}>
        <Stars value={item.rating_avg ?? 0} size={12} />
        <Text style={styles.ratingText}>
          {(item.rating_avg ?? 0).toFixed(1)} ({item.rating_count ?? 0})
        </Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatINR(price)}</Text>

        {hasDiscount ? (
          <>
            <Text style={styles.mrp}>{formatINR(mrp)}</Text>
            <Text style={styles.off}>-{offPct}%</Text>
          </>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  imageWrap: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
    position: "relative",
  },
  image: { width: "100%", height: 110 },

  badgeOverlay: { position: "absolute", left: 8, top: 8 },

  title: { marginTop: 10, fontWeight: "900", fontSize: 13, opacity: 0.95 },

  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  ratingText: { opacity: 0.75, fontWeight: "800", fontSize: 11 },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  price: { fontWeight: "900", fontSize: 15 },
  mrp: { textDecorationLine: "line-through", opacity: 0.55, fontWeight: "800", fontSize: 12 },
  off: { fontWeight: "900", opacity: 0.9, fontSize: 12 },
});
