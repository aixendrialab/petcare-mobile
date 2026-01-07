import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { HeartIcon, PinIcon, TruckIcon } from "../icons/ShopIcons";

export function StickyAddToCartBar({
  busy,
  inStock,

  qty = 1,
  minQty = 1,
  maxQty = 99,
  onChangeQty,

  primaryText,
  secondaryText = "Buy Now",

  // ✅ NEW: delivery + wishlist
  deliverTo,
  etaText,
  shippingFeeText,
  onPressDeliverTo,

  wished,
  onToggleWish,

  onBack,
  onPrimary,
  onSecondary,
}: {
  busy: boolean;
  inStock: boolean;

  qty?: number;
  minQty?: number;
  maxQty?: number;
  onChangeQty?: (next: number) => void;

  primaryText: string;
  secondaryText?: string;

  // Delivery line
  deliverTo?: string;            // "Ram Satish • Vizag • 5300xx"
  etaText?: string;              // "Free delivery Tomorrow"
  shippingFeeText?: string;      // "₹40 delivery" (optional)
  onPressDeliverTo?: () => void; // open address picker later

  // Wishlist
  wished?: boolean;
  onToggleWish?: () => void;

  onBack: () => void;
  onPrimary: () => void;
  onSecondary?: () => void;
}) {
  const disabled = busy || !inStock;

  const dec = () => onChangeQty?.(Math.max(minQty, qty - 1));
  const inc = () => onChangeQty?.(Math.min(maxQty, qty + 1));

  return (
    <View style={styles.wrap}>
      {/* Top info row */}
      {(deliverTo || etaText || onToggleWish) ? (
        <View style={styles.infoRow}>
          <Pressable
            style={[styles.deliverTo, !onPressDeliverTo && { opacity: 0.85 }]}
            onPress={onPressDeliverTo}
            disabled={!onPressDeliverTo}
          >
            <PinIcon size={16} />
            <Text style={styles.infoText} numberOfLines={1}>
              {deliverTo ? `Deliver to ${deliverTo}` : "Deliver to"}
            </Text>
          </Pressable>

          <View style={styles.etaWrap}>
            {!!etaText && (
              <View style={styles.etaPill}>
                <TruckIcon size={16} />
                <Text style={styles.etaText} numberOfLines={1}>{etaText}</Text>
                {!!shippingFeeText && (
                  <Text style={[styles.etaText, { opacity: 0.75 }]}>
                    {" "}• {shippingFeeText}
                  </Text>
                )}
              </View>
            )}
          </View>

          {!!onToggleWish && (
            <Pressable style={styles.wishBtn} onPress={onToggleWish}>
              <HeartIcon filled={!!wished} />
            </Pressable>
          )}
        </View>
      ) : null}

      {/* Bottom action row */}
      <View style={styles.bar}>
        {/* Back */}
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        {/* Qty */}
        {onChangeQty && (
          <View style={styles.qtyWrap}>
            <Pressable
              style={[styles.qtyBtn, qty <= minQty && styles.qtyDisabled]}
              onPress={dec}
              disabled={qty <= minQty}
            >
              <Text style={styles.qtyText}>−</Text>
            </Pressable>

            <Text style={styles.qtyValue}>{qty}</Text>

            <Pressable
              style={[styles.qtyBtn, qty >= maxQty && styles.qtyDisabled]}
              onPress={inc}
              disabled={qty >= maxQty}
            >
              <Text style={styles.qtyText}>+</Text>
            </Pressable>
          </View>
        )}

        {/* Buy now */}
        {onSecondary && (
          <Pressable
            style={[styles.secondaryBtn, disabled && { opacity: 0.5 }]}
            disabled={disabled}
            onPress={onSecondary}
          >
            <Text style={styles.secondaryText}>{secondaryText}</Text>
          </Pressable>
        )}

        {/* Add */}
        <Pressable
          style={[styles.primaryBtn, disabled && { opacity: 0.55 }]}
          disabled={disabled}
          onPress={onPrimary}
        >
          <Text style={styles.primaryText}>{primaryText}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },

  deliverTo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1.2,
    minWidth: 120,
  },
  infoText: { fontWeight: "900", opacity: 0.9 },

  etaWrap: { flex: 1.6, alignItems: "flex-end" },
  etaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
    maxWidth: "100%",
  },
  etaText: { fontWeight: "900", opacity: 0.9 },

  wishBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  bar: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  backText: { fontSize: 18, fontWeight: "900" },

  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  qtyDisabled: { opacity: 0.4 },
  qtyText: { fontSize: 18, fontWeight: "900" },
  qtyValue: { minWidth: 28, textAlign: "center", fontWeight: "900" },

  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  secondaryText: { fontWeight: "900", opacity: 0.9 },

  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  primaryText: { textAlign: "center", fontWeight: "900" },
});
