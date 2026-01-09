import React, { useMemo } from "react";
import { View, ScrollView, Pressable, Text, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import type { ProductDetail, OfferCard, ProductMedia } from "../../types";
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
  item: ProductDetail;

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

  onOpenItem: (productId: number) => void;
}) {
  const images: ProductMedia[] = useMemo(() => {
    return (item.media ?? []).filter((m) => (m.media_type ?? "IMAGE") === "IMAGE");
  }, [item.media]);

  /** Best offer is first one (server already orders by price ASC) */
  const offer: OfferCard | undefined = item.offers?.[0];

  const promoBadges = useMemo(() => {
    const p = offer?.promotions ?? [];
    // show max 2 promo titles
    return p.slice(0, 2).map((x) => x.title).filter(Boolean);
  }, [offer?.promotions]);

  const primaryBadges = useMemo(() => {
    // combine promo titles + any generic badges
    const out: string[] = [];
    for (const b of promoBadges) out.push(b);
    return out;
  }, [promoBadges]);

  const reviewPreview = item.review_previews?.[0];
  const W = Dimensions.get("window").width;
  const GAP = 12;
  const IMG_W = Math.min(420, W - 32); // padding 16 on each side
  const IMG_H = IMG_W;
  const previews = item.review_previews ?? [];

  const PAGE_W = Math.max(320, W - 32);      // ✅ full viewport page (minus padding)
  function onOpenRoute(arg0: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 130 }}>
        {/* Top bar */}
        <View style={styles.topRow}>
          <Pressable style={styles.iconBtn} onPress={onBack}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.topTitle} numberOfLines={1}>
            {item.title}
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
        <Pressable style={styles.deliverBar} onPress={onChangeDeliverTo} disabled={!onChangeDeliverTo}>
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
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x, idx) => `${x.uri}-${idx}`}
            snapToInterval={PAGE_W}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item: img }) => (
              <View style={{ width: PAGE_W, alignItems: "center" }}>
                <View style={{ width: IMG_W }}>
                  <Image
                    source={{ uri: img.uri }}
                    style={{ width: IMG_W, height: IMG_H, borderRadius: 18 }}
                    resizeMode="cover"
                  />
                  {!!img.label && <Text style={styles.imgLabel}>{img.label}</Text>}
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.heroFallback}>
            <Text style={{ opacity: 0.7 }}>No images</Text>
          </View>
        )}

        {/* Title + rating */}
        <Text style={styles.h1}>{item.title}</Text>

        {!!item.short_desc && (
          <Text style={[styles.muted, { marginTop: 6, fontWeight: "700" }]} numberOfLines={3}>
            {item.short_desc}
          </Text>
        )}

        <View style={styles.metaRow}>
          <Stars value={ratingAvg} size={12} />
          <Text style={styles.muted}> {Number.isFinite(ratingAvg) ? ratingAvg.toFixed(1) : "0.0"} </Text>
          <Text style={styles.muted}>({ratingCount ?? 0})</Text>
        </View>

        {/* Price + badges */}
        <View style={{ marginTop: 12 }}>
          <PriceBlock
            price={offer?.price ?? item.offers?.[0]?.price}
            mrp={offer?.mrp ?? undefined}
            discountPct={offer?.discount_pct ?? undefined}
            badges={primaryBadges}
            boughtRecentlyLabel={boughtLabel}
          />

          <View style={styles.badgeRow}>
            {!!item.tags?.length ? <Badge text={item.tags[0]} /> : null}
          </View>
        </View>

        {/* Seller */}
        {offer?.store ? (
          <View style={{ marginTop: 12 }}>
            <SellerCard store={offer.store} fulfillment={offer.fulfillment} />
          </View>
        ) : null}

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
              <Text style={styles.muted}> {Number.isFinite(ratingAvg) ? ratingAvg.toFixed(1) : "0.0"} </Text>
              <Text style={styles.muted}>({ratingCount ?? 0})</Text>
            </View>

            {previews.length ? (
              <View style={{ marginTop: 10 }}>
                {previews.slice(0, 3).map((r, idx) => (
                  <View
                    key={String(r.id ?? idx)}
                    style={{
                      paddingTop: idx === 0 ? 0 : 10,
                      marginTop: idx === 0 ? 0 : 10,
                      borderTopWidth: idx === 0 ? 0 : 1,
                      borderColor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    {!!r.title && <Text style={{ fontWeight: "900" }}>{r.title}</Text>}
                    {!!r.body && (
                      <Text style={[styles.muted, { marginTop: 6 }]} numberOfLines={3}>
                        {r.body}
                      </Text>
                    )}
                  </View>
                ))}

                <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                  <Pressable onPress={() => onOpenRoute(`/parent/shop/item/${item.product_id}/reviews` as any)}>
                    <Text style={{ fontWeight: "900", opacity: 0.9 }}>See all →</Text>
                  </Pressable>
                  <Pressable onPress={() => onOpenRoute(`/parent/shop/item/${item.product_id}/write-review` as any)}>
                    <Text style={{ fontWeight: "900", opacity: 0.9 }}>Write a review →</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.muted}>No reviews yet.</Text>
                <Pressable
                  style={{ marginTop: 10 }}
                  onPress={() => onOpenRoute(`/parent/shop/item/${item.product_id}/write-review` as any)}
                >
                  <Text style={{ fontWeight: "900", opacity: 0.9 }}>Be the first to write a review →</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Blocks */}
        {item.frequently_bought_together?.items?.length ? (
          <HorizontalShelf
            title={item.frequently_bought_together.title}
            items={item.frequently_bought_together.items}
            onOpenItem={onOpenItem}
          />
        ) : null}

        {item.similar_products?.items?.length ? (
          <HorizontalShelf
            title={item.similar_products.title}
            items={item.similar_products.items}
            onOpenItem={onOpenItem}
          />
        ) : null}

        {item.more_to_explore?.items?.length ? (
          <HorizontalShelf
            title={item.more_to_explore.title}
            items={item.more_to_explore.items}
            onOpenItem={onOpenItem}
          />
        ) : null}

        {item.top_deals?.items?.length ? (
          <HorizontalShelf title={item.top_deals.title} items={item.top_deals.items} onOpenItem={onOpenItem} />
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
