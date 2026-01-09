import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import type { ShopHome, CatalogCategory, ProductCard } from "../../types";
import { ShopSearchBar } from "./ShopSearchBar";
import { DeliverToBar } from "./DeliverToBar";
import { CategoriesRow } from "./CategoriesRow";
import { HomeHeroCard } from "./HomeHeroCard";
import { DiscountHintsRow } from "./DiscountHintsRow";
import { HomeShelf } from "./HomeShelf";
import { fetchShopFeed } from "../../api"; // ✅ add (below)
import { MiniItemCard } from "./MiniItemCard";

const CARD_W = 160;
const CARD_GAP = 12;
const COLS = 3;

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
    for (const s of sections) {
      if (!out.find((x) => x.key === s.key)) out.push(s);
    }
    return out;
  }, [sections]);

  // Initial feed seed from home sections (fast first paint)
  const initialFeed = useMemo(() => {
    const all = orderedSections.flatMap((s) => s.items ?? []);
    const seen = new Set<number>();
    const uniq: ProductCard[] = [];
    for (const it of all) {
      const pid = it.product_id;
      if (!pid || seen.has(pid)) continue;
      seen.add(pid);
      uniq.push(it);
    }
    return uniq;
  }, [orderedSections]);

  // ✅ Live search filtering (in-memory, instant)
  const normalizedQ = (q ?? "").trim().toLowerCase();
  const filteredItems = useMemo(() => {
    if (!normalizedQ) return [];
    const all = (home.sections ?? []).flatMap((s) => s.items ?? []);
    const seen = new Set<number>();
    const out: ProductCard[] = [];
    for (const it of all) {
      const pid = it.product_id;
      if (!pid || seen.has(pid)) continue;
      const hay = `${it.title ?? ""} ${it.brand ?? ""} ${it.category ?? ""}`.toLowerCase();
      if (hay.includes(normalizedQ)) {
        seen.add(pid);
        out.push(it);
      }
    }
    return out;
  }, [home.sections, normalizedQ]);

  // ✅ Infinite feed state (only used when q is empty)
  const [feed, setFeed] = useState<ProductCard[]>(initialFeed.slice(0, 24));
  const [offset, setOffset] = useState<number>(feed.length);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // reset feed when home changes (e.g. refresh)
    const seed = initialFeed.slice(0, 24);
    setFeed(seed);
    setOffset(seed.length);
    setHasMore(true);
  }, [initialFeed]);

  const loadMore = useCallback(async () => {
    if (normalizedQ) return; // don't paginate during search filter
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const excludeIds = feed.map((x) => x.product_id).filter(Boolean);

      const next = await fetchShopFeed({
        limit: 24,
        offset,
        exclude_ids: excludeIds,
      });

      if (!next.length) {
        setHasMore(false);
        return;
      }

      // de-dupe by product_id
      setFeed((prev) => {
        const seen = new Set(prev.map((x) => x.product_id));
        const add = next.filter((x) => x.product_id && !seen.has(x.product_id));
        return [...prev, ...add];
      });

      setOffset((prev) => prev + next.length);
    } finally {
      setLoadingMore(false);
    }
  }, [normalizedQ, loadingMore, hasMore, offset]);

  const data = normalizedQ ? filteredItems : feed;

  return (
    <FlatList
      style={styles.page}
      contentContainerStyle={{ paddingBottom: 24 }}
      data={data}
      keyExtractor={(it) => String(it.product_id)}
      numColumns={COLS}
      columnWrapperStyle={styles.row}
      onEndReachedThreshold={0.6}
      onEndReached={loadMore}
      ListHeaderComponent={
        <>
          <Text style={styles.h1}>Shop</Text>
          <Text style={styles.sub}>Buy products & services for your pet</Text>

          <ShopSearchBar value={q} onChange={onChangeQ} onSubmit={onSearch} />
          <DeliverToBar value={deliverTo} onPress={onChangeDeliverTo} />

          {/* Show hero/shelves only when NOT searching */}
          {!normalizedQ ? (
            <>
              <HomeHeroCard home={home} onPress={(route) => onOpenRoute(route)} />
              <DiscountHintsRow hints={home.discount_hints} />
              <CategoriesRow categories={categories} onPick={onPickCategory} />

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

              <View style={{ height: 10 }} />
              <Pressable style={styles.ghostBtn} onPress={onGoToCart}>
                <Text style={styles.ghostText}>Go to Cart</Text>
              </Pressable>
              <Pressable style={styles.ghostBtn} onPress={onMyOrders}>
                <Text style={styles.ghostText}>My Orders</Text>
              </Pressable>

              <Text style={styles.feedTitle}>More for you</Text>
              <Text style={styles.feedSub}>Browse more as you scroll</Text>
            </>
          ) : (
            <>
              <Text style={styles.feedTitle}>Results</Text>
              <Text style={styles.feedSub}>{filteredItems.length} items</Text>
            </>
          )}
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <MiniItemCard item={item} onPress={() => onOpenItem(item.product_id)} />
        </View>
      )}

      ListFooterComponent={
        !normalizedQ && loadingMore ? (
          <Text style={{ paddingVertical: 14, opacity: 0.7 }}>Loading more…</Text>
        ) : null
      }
    />
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

  feedTitle: { marginTop: 18, fontSize: 16, fontWeight: "900" },
  feedSub: { marginTop: 4, opacity: 0.7, fontSize: 12, fontWeight: "700" },

  row: { gap: CARD_GAP, marginBottom: CARD_GAP },
  cell: {
    width: CARD_W,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
