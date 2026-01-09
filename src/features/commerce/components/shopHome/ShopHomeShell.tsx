import React, { useMemo } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import type { ShopHome, CatalogCategory, ProductCard } from "../../types";
import { ShopSearchBar } from "./ShopSearchBar";
import { DeliverToBar } from "./DeliverToBar";
import { CategoriesRow } from "./CategoriesRow";
import { HomeHeroCard } from "./HomeHeroCard";
import { DiscountHintsRow } from "./DiscountHintsRow";
import { HomeShelf } from "./HomeShelf";
import { HomeFeed } from "./HomeFeed";

export function ShopHomeShell({
  home,
  q,
  onChangeQ,
  onSearch,
  deliverTo,
  onChangeDeliverTo,
  onPickCategory,
  onOpenItem,
  onOpenRoute,
  onGoToCart,
  onMyOrders,
}: {
  home: ShopHome;

  q: string;
  onChangeQ: (v: string) => void;
  onSearch: () => void;

  deliverTo: string;
  onChangeDeliverTo?: () => void;

  onPickCategory: (c: CatalogCategory) => void;
  onOpenItem: (productId: number) => void;
  onOpenRoute: (route?: string) => void;

  onGoToCart: () => void;
  onMyOrders: () => void;
}) {
  const sections = useMemo(
    () => (home.sections ?? []).filter((s) => (s.items ?? []).length > 0),
    [home.sections]
  );

  const categories = useMemo(() => {
    const keys = new Set<string>();
    for (const s of sections) keys.add(s.key);
    keys.delete("DEALS");
    keys.delete("TRENDING");
    keys.delete("FOR_YOU");
    return Array.from(keys) as CatalogCategory[];
  }, [sections]);

  // Order shelves: specials first, then categories
  const orderedSections = useMemo(() => {
    const byKey = new Map(sections.map((s) => [s.key, s]));
    const out: any[] = [];
    ["DEALS", "TRENDING", "FOR_YOU"].forEach((k) => {
      const s = byKey.get(k);
      if (s) out.push(s);
    });
    ["FOOD", "ACCESSORY", "MEDICINE", "SERVICE"].forEach((k) => {
      const s = byKey.get(k);
      if (s) out.push(s);
    });
    // any others at end
    for (const s of sections) {
      if (!out.find((x) => x.key === s.key)) out.push(s);
    }
    return out;
  }, [sections]);

  // “More for you” feed (dedupe)
  const feedItems = useMemo(() => {
    const all = orderedSections.flatMap((s) => s.items ?? []);
    const seen = new Set<number>();
    const uniq: ProductCard[] = [];
    for (const it of all) {
      const pid = it.product_id;
      if (!pid || seen.has(pid)) continue;
      seen.add(pid);
      uniq.push(it);
    }
    return uniq.slice(0, 24);
  }, [orderedSections]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.h1}>Shop</Text>
      <Text style={styles.sub}>Buy products & services for your pet</Text>

      <ShopSearchBar value={q} onChange={onChangeQ} onSubmit={onSearch} />
      <DeliverToBar value={deliverTo} onPress={onChangeDeliverTo} />

      {/* Hero first (small) */}
      <HomeHeroCard home={home} onPress={(route) => onOpenRoute(route)} />

      {/* Discount hints (compact) */}
      <DiscountHintsRow hints={home.discount_hints} />

      {/* Categories */}
      <CategoriesRow categories={categories} onPick={onPickCategory} />

      {/* Shelves */}
      {orderedSections.map((sec) => (
        <HomeShelf
          key={sec.key}
          title={sec.title}
          subtitle={sec.subtitle ?? undefined}
          items={sec.items}
          onOpenItem={onOpenItem}
          onSeeAll={sec.cta?.route ? () => onOpenRoute(sec.cta?.route) : undefined}
        />
      ))}

      {/* Bottom actions (optional, small) */}
      <View style={{ height: 10 }} />
      <Pressable style={styles.ghostBtn} onPress={onGoToCart}>
        <Text style={styles.ghostText}>Go to Cart</Text>
      </Pressable>
      <Pressable style={styles.ghostBtn} onPress={onMyOrders}>
        <Text style={styles.ghostText}>My Orders</Text>
      </Pressable>

      {/* Feed */}
      <HomeFeed items={feedItems} onOpenItem={onOpenItem} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 22, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7 },

  ghostBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  ghostText: { textAlign: "center", fontWeight: "900" },
});
