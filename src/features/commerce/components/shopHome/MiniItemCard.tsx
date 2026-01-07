import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import type { CatalogMiniItem } from "../../types";
import { Badge } from "../Badge";
import { Stars } from "../Stars";

function formatINR(amount?: number) {
  const a = typeof amount === "number" ? amount : 0;
  // keep simple + stable (no Intl dependency issues)
  return `₹${Math.round(a)}`;
}

export function MiniItemCard({
  item,
  onPress,
  onQuickAdd,
  adding = false,
}: {
  item: CatalogMiniItem;
  onPress: () => void;

  /** optional: shows a small + button like Amazon "Add" */
  onQuickAdd?: () => void;
  adding?: boolean;
}) {
  const img = item.primary_image || "https://picsum.photos/seed/petcare-mini/300/300";

  const hasDiscount = useMemo(() => {
    const mrp = item.mrp?.amount ?? 0;
    const price = item.price?.amount ?? 0;
    return mrp > 0 && price > 0 && mrp > price;
  }, [item.mrp?.amount, item.price?.amount]);

  const offPct = useMemo(() => {
    if (!hasDiscount) return 0;
    const mrp = item.mrp!.amount;
    const price = item.price.amount;
    return Math.round(((mrp - price) / mrp) * 100);
  }, [hasDiscount, item.mrp, item.price]);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Image */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: img }} style={styles.image} />

        {/* Badge overlay */}
        {!!item.badges?.length && (
          <View style={styles.badgeOverlay}>
            <Badge text={item.badges[0]} variant="deal" />
          </View>
        )}

        {/* Quick add */}
        {!!onQuickAdd && (
          <Pressable
            style={[styles.quickAdd, adding && { opacity: 0.6 }]}
            onPress={(e) => {
              // prevent opening item when tapping +
              e.stopPropagation?.();
              onQuickAdd();
            }}
            disabled={adding}
            hitSlop={10}
          >
            <Text style={styles.quickAddText}>{adding ? "…" : "+"}</Text>
          </Pressable>
        )}
      </View>

      {/* Name */}
      <Text style={styles.title} numberOfLines={2}>
        {item.name}
      </Text>

      {/* Rating */}
      {!!item.rating && (
        <View style={styles.ratingRow}>
          <Stars value={item.rating.avg} size={12} />
          <Text style={styles.ratingText}>
            {item.rating.avg.toFixed(1)} ({item.rating.count})
          </Text>
        </View>
      )}

      {/* Price row */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatINR(item.price?.amount)}</Text>

        {hasDiscount ? (
          <>
            <Text style={styles.mrp}>{formatINR(item.mrp?.amount)}</Text>
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

  badgeOverlay: {
    position: "absolute",
    left: 8,
    top: 8,
  },

  quickAdd: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  quickAddText: { fontWeight: "900", opacity: 0.95, fontSize: 16 },

  title: { marginTop: 10, fontWeight: "900", fontSize: 13, opacity: 0.95 },

  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  ratingText: { opacity: 0.75, fontWeight: "800", fontSize: 11 },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  price: { fontWeight: "900", fontSize: 15 },
  mrp: { textDecorationLine: "line-through", opacity: 0.55, fontWeight: "800", fontSize: 12 },
  off: { fontWeight: "900", opacity: 0.9, fontSize: 12 },
});
