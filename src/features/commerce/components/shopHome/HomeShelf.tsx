import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { ProductCard } from "../../types";
import { MiniItemCard } from "./MiniItemCard";

const CARD_W = 160;
const CARD_GAP = 12;
const SNAP = CARD_W + CARD_GAP;

const VISIBLE_COUNT = 3;
const VIEWPORT_W = CARD_W * VISIBLE_COUNT + CARD_GAP * (VISIBLE_COUNT - 1);

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d={dir === "left" ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"}
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SkeletonCard() {
  return (
    <View style={styles.skelCard}>
      <View style={styles.skelImg} />
      <View style={styles.skelLine1} />
      <View style={styles.skelLine2} />
      <View style={styles.skelLine3} />
    </View>
  );
}

export function HomeShelf({
  title,
  subtitle,
  items,
  onOpenItem,
  onSeeAll,
  seeAllText = "See all",
  loading = false,
}: {
  title: string;
  subtitle?: string;
  items: ProductCard[];
  onOpenItem: (productId: number) => void;
  onSeeAll?: () => void;
  seeAllText?: string;
  loading?: boolean;
}) {
  if (!loading && (!items || items.length === 0)) return null;

  const listRef = useRef<FlatList<ProductCard>>(null);
  const [index, setIndex] = useState(0);

  const data = useMemo(() => {
    if (loading) return Array.from({ length: 6 }, (_, i) => ({ product_id: -(i + 1) } as any));
    return items;
  }, [items, loading]);

  const maxIndex = Math.max(0, (data?.length ?? 0) - 1);
  const canLeft = index > 0;
  const canRight = index < maxIndex;

  function scrollToIndex(next: number) {
    const clamped = Math.max(0, Math.min(maxIndex, next));
    setIndex(clamped);
    listRef.current?.scrollToOffset({ offset: clamped * SNAP, animated: true });
  }

  function onScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x || 0;
    const i = Math.round(x / SNAP);
    setIndex(Math.max(0, Math.min(maxIndex, i)));
  }

  return (
    <View style={{ marginTop: 14 }}>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {!!subtitle && (
            <Text style={styles.sectionSub} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {!!onSeeAll && !loading && (
          <Pressable onPress={onSeeAll} hitSlop={10} style={styles.seeAllPill}>
            <Text style={styles.seeAllText}>{seeAllText}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.shelfViewport}>
        <FlatList
          ref={listRef}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(it: any, idx) => String(it?.product_id ?? idx)}
          style={{ marginTop: 10 }}
          contentContainerStyle={styles.listContent}
          snapToInterval={SNAP}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }: any) => {
            if (loading) return <SkeletonCard />;
            const it = item as ProductCard;
            return (
              <View style={styles.cardWrap}>
                <MiniItemCard item={it} onPress={() => onOpenItem(it.product_id)} />
              </View>
            );
          }}
        />

        {Platform.OS === "web" ? (
          <>
            <Pressable
              style={[styles.arrowBtn, styles.arrowLeft, !canLeft && { opacity: 0.25 }]}
              onPress={() => scrollToIndex(index - 1)}
              disabled={!canLeft}
              hitSlop={10}
            >
              <ArrowIcon dir="left" />
            </Pressable>

            <Pressable
              style={[styles.arrowBtn, styles.arrowRight, !canRight && { opacity: 0.25 }]}
              onPress={() => scrollToIndex(index + 1)}
              disabled={!canRight}
              hitSlop={10}
            >
              <ArrowIcon dir="right" />
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  sectionTitle: { fontSize: 16, fontWeight: "900" },
  sectionSub: { marginTop: 4, opacity: 0.7, fontSize: 12, fontWeight: "700" },

  seeAllPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  seeAllText: { fontWeight: "900", opacity: 0.9, fontSize: 12 },

  shelfViewport: {
    position: "relative",
    width: VIEWPORT_W,
    maxWidth: "100%",
  },

  listContent: { paddingLeft: 0, paddingRight: 0 },

  cardWrap: { position: "relative", marginRight: CARD_GAP },

  arrowBtn: {
    position: "absolute",
    top: 10 + 110 / 2 - 18,
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  arrowLeft: { left: 6 },
  arrowRight: { right: 6 },

  skelCard: {
    width: CARD_W,
    marginRight: CARD_GAP,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  skelImg: { height: 110, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.08)" },
  skelLine1: { marginTop: 10, height: 12, borderRadius: 8, width: "90%", backgroundColor: "rgba(255,255,255,0.08)" },
  skelLine2: { marginTop: 8, height: 10, borderRadius: 8, width: "70%", backgroundColor: "rgba(255,255,255,0.07)" },
  skelLine3: { marginTop: 10, height: 12, borderRadius: 8, width: "55%", backgroundColor: "rgba(255,255,255,0.09)" },
});
