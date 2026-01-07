import React from "react";
import { View, ScrollView, Pressable, Text, StyleSheet, Image, FlatList } from "react-native";
import type { CatalogItemDetail } from "../../types";
import { Stars } from "../Stars";
import { Badge } from "../Badge";
import { PriceBlock } from "../PriceBlock";
import { SellerCard } from "../SellerCard";
import { SpecsAccordion } from "../SpecsAccordion";
import { HorizontalShelf } from "../HorizontalShelf";
import { StickyAddToCartBar } from "./StickyAddToCartBar";
import { HeartIcon, CartIcon, TruckIcon, PinIcon } from "../icons/ShopIcons";

export function ShopItemShell({
  item,
  ratingAvg,
  ratingCount,
  boughtLabel,
  busy,
  inStock,
  onGoToCart,
  qty,
  onChangeQty,

  wished,
  onToggleWish,

  deliverTo,
  onChangeDeliverTo,
  etaText,
  shippingFeeText,

  onBack,
  onAddToCart,
  onBuyNow,
  onOpenItem,
}: {
  item: CatalogItemDetail;
  ratingAvg: number;
  ratingCount: number;
  boughtLabel?: string;

  busy: boolean;
  inStock: boolean;

  onGoToCart: () => void;

  qty: number;
  onChangeQty: (q: number) => void;

  wished: boolean;
  onToggleWish: () => void;

  deliverTo: string;
  onChangeDeliverTo?: () => void;
  etaText: string;
  shippingFeeText: string;

  onBack: () => void;
  onAddToCart: (qty: number) => void;
  onBuyNow: (qty: number) => void;

  onOpenItem: (id: number) => void;
}) {
  const images = item.images ?? [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 130 }}>
        {/* Top bar */}
        <View style={styles.topRow}>
          <Pressable style={styles.iconBtn} onPress={onBack}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.topTitle} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable style={styles.iconBtn} onPress={onToggleWish}>
              <HeartIcon size={18} filled={wished} />
            </Pressable>

            <Pressable style={styles.iconBtn} onPress={onGoToCart}>
              <CartIcon size={18} />
            </Pressable>
          </View>
        </View>

        {/* Deliver + promise strip */}
        <Pressable
          style={styles.deliverBar}
          onPress={onChangeDeliverTo}
          disabled={!onChangeDeliverTo}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <PinIcon size={16} />
            <Text style={styles.deliverTitle} numberOfLines={1}>
              Deliver to {deliverTo}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
            <TruckIcon size={16} />
            <Text style={styles.deliverMeta} numberOfLines={1}>
              {etaText} • {shippingFeeText}
            </Text>
          </View>
        </Pressable>

        {/* Image carousel */}
        {images.length ? (
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x) => x.id}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item: img }) => (
              <View style={styles.imageWrap}>
                <Image source={{ uri: img.uri }} style={styles.heroImg} resizeMode="cover" />
                {!!img.label && <Text style={styles.imgLabel}>{img.label}</Text>}
              </View>
            )}
          />
        ) : (
          <View style={styles.heroFallback}>
            <Text style={{ opacity: 0.7 }}>No images</Text>
          </View>
        )}

        {/* Title + rating */}
        <Text style={styles.h1}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Stars value={ratingAvg} size={12} />
          <Text style={styles.muted}> {ratingAvg.toFixed(1)} </Text>
          <Text style={styles.muted}>({ratingCount})</Text>
        </View>

        {/* Price + badges */}
        <View style={{ marginTop: 12 }}>
          <PriceBlock
            price={item.price}
            mrp={item.mrp}
            discountPct={item.discount_pct}
            badges={item.discount_badges}
            boughtRecentlyLabel={boughtLabel}
          />

          <View style={styles.badgeRow}>
            {!!item.tags?.length ? <Badge text={item.tags[0]} /> : null}
          </View>
        </View>

        {/* Seller */}
        <View style={{ marginTop: 12 }}>
          <SellerCard seller={item.seller} />
        </View>

        {/* Description */}
        {!!item.description && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About this item</Text>
            <Text style={[styles.muted, { marginTop: 8, lineHeight: 20 }]}>{item.description}</Text>
          </View>
        )}

        {/* Specs */}
        <View style={{ marginTop: 12 }}>
          <SpecsAccordion specs={item.specs ?? []} />
        </View>

        {/* Reviews (simple preview) */}
        <View style={{ marginTop: 12 }}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer reviews</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
              <Stars value={ratingAvg} size={12} />
              <Text style={styles.muted}> {ratingAvg.toFixed(1)} </Text>
              <Text style={styles.muted}>({ratingCount})</Text>
            </View>

            {!!item.reviews?.top?.length && (
              <Text style={[styles.muted, { marginTop: 10 }]} numberOfLines={3}>
                {item.reviews.top[0].body}
              </Text>
            )}
          </View>
        </View>

        {/* Frequently bought together */}
        {item.frequently_bought_together?.items?.length ? (
          <HorizontalShelf
            title={item.frequently_bought_together.title}
            items={item.frequently_bought_together.items}
            onOpenItem={onOpenItem}
          />
        ) : null}

        {/* Similar */}
        {item.similar?.items?.length ? (
          <HorizontalShelf
            title={item.similar.title}
            items={item.similar.items}
            onOpenItem={onOpenItem}
          />
        ) : null}
      </ScrollView>

      {/* Bottom bar */}
      <StickyAddToCartBar
        busy={busy}
        inStock={inStock}
        qty={qty}
        onChangeQty={onChangeQty}
        primaryText={busy ? "Adding…" : inStock ? "Add to Cart" : "Out of stock"}
        secondaryText={"Buy now"}
        onBack={onBack}
        onPrimary={() => onAddToCart(qty)}
        onSecondary={() => onBuyNow(qty)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },

  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontWeight: "900", fontSize: 18, opacity: 0.95 },
  topTitle: { flex: 1, marginHorizontal: 10, fontWeight: "900", fontSize: 16, opacity: 0.9 },

  deliverBar: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  deliverTitle: { fontWeight: "900", flex: 1 },
  deliverMeta: { opacity: 0.75, flex: 1 },

  imageWrap: { marginRight: 12 },
  heroImg: { width: 280, height: 280, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.06)" },
  imgLabel: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "900",
  },
  heroFallback: {
    height: 280,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  h1: { fontSize: 18, fontWeight: "900", marginTop: 6 },
  muted: { opacity: 0.7 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },

  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },

  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14, marginTop: 12 },
  cardTitle: { fontWeight: "900", fontSize: 14 },
});
