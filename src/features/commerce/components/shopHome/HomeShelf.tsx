import React, { useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { CatalogMiniItem } from "../../types";
import { MiniItemCard } from "./MiniItemCard";

const CARD_W = 160;
const CARD_GAP = 12;
const SNAP = CARD_W + CARD_GAP;

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={2.2}
        strokeLinecap="round"
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

/**
 * B7 additions:
 *  - inset padding + nicer snapping feel
 *  - edge-fade overlays (no gradient lib)
 *  - optional quick-add overlay button
 */
export function HomeShelf({
  title,
  subtitle,
  items,
  onOpenItem,
  onSeeAll,
  seeAllText = "See all",
  loading = false,

  // B7
  onQuickAdd,
  fadeColor = "rgba(0,0,0,1)",
}: {
  title: string;
  subtitle?: string;
  items: CatalogMiniItem[];
  onOpenItem: (id: number) => void;
  onSeeAll?: () => void;
  seeAllText?: string;
  loading?: boolean;

  /** Optional: show a small + button on each card */
  onQuickAdd?: (id: number) => void;

  /** Background color used for edge fades (match your page bg) */
  fadeColor?: string;
}) {
  if (!loading && (!items || items.length === 0)) return null;

  const listRef = useRef<FlatList<CatalogMiniItem>>(null);

  const data = useMemo(() => {
    if (loading) {
      return Array.from({ length: 6 }, (_, i) => ({ id: -(i + 1) } as any));
    }
    return items;
  }, [items, loading]);

  function onScrollEnd(_e: NativeSyntheticEvent<NativeScrollEvent>) {
    // kept for future (analytics/active index)
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

      {/* Shelf wrapper so we can overlay edge fades */}
      <View style={styles.shelfWrap}>
        <FlatList
          ref={listRef}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(it: any, idx) => String(it?.id ?? idx)}
          style={{ marginTop: 10 }}
          contentContainerStyle={styles.listContent} // ✅ inset padding
          snapToInterval={SNAP}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }: any) => {
            if (loading) return <SkeletonCard />;

            const it = item as CatalogMiniItem;

            return (
              <View style={styles.cardWrap}>
                <MiniItemCard item={it} onPress={() => onOpenItem(it.id)} />

                {!!onQuickAdd && (
                  <Pressable
                    style={styles.quickAddBtn}
                    onPress={() => onQuickAdd(it.id)}
                    hitSlop={10}
                  >
                    <PlusIcon size={16} />
                  </Pressable>
                )}
              </View>
            );
          }}
        />

        {/* Edge fades (simple stacked opacities; no extra libs) */}

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

  shelfWrap: { position: "relative" },

  // ✅ inset so first/last card breathes like Amazon
  listContent: {
    paddingLeft: 2,
    paddingRight: 14,
  },

  // wrapper so we can overlay + button without touching MiniItemCard internals
  cardWrap: { position: "relative" },

  quickAddBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  // Skeletons (same as B6)
  skelCard: {
    width: CARD_W,
    marginRight: CARD_GAP,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  skelImg: {
    height: 110,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  skelLine1: {
    marginTop: 10,
    height: 12,
    borderRadius: 8,
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  skelLine2: {
    marginTop: 8,
    height: 10,
    borderRadius: 8,
    width: "70%",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  skelLine3: {
    marginTop: 10,
    height: 12,
    borderRadius: 8,
    width: "55%",
    backgroundColor: "rgba(255,255,255,0.09)",
  },

  // Edge fades: 3 layers each side
  fadeLeft: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 0,
    width: 18,
    opacity: 0.35,
  },
  fadeLeft2: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 0,
    width: 12,
    opacity: 0.55,
  },
  fadeLeft3: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 0,
    width: 7,
    opacity: 0.78,
  },

  fadeRight: {
    position: "absolute",
    right: 0,
    top: 10,
    bottom: 0,
    width: 18,
    opacity: 0.35,
  },
  fadeRight2: {
    position: "absolute",
    right: 0,
    top: 10,
    bottom: 0,
    width: 12,
    opacity: 0.55,
  },
  fadeRight3: {
    position: "absolute",
    right: 0,
    top: 10,
    bottom: 0,
    width: 7,
    opacity: 0.78,
  },
});
