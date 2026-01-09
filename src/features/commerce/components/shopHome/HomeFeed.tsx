import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import type { ProductCard } from "../../types";
import { MiniItemCard } from "./MiniItemCard";

const CARD_W = 160;
const CARD_GAP = 12;
const COLS = 3;
const VIEWPORT_W = CARD_W * COLS + CARD_GAP * (COLS - 1);

export function HomeFeed({
  title = "More for you",
  subtitle = "Browse more as you scroll",
  items,
  onOpenItem,
}: {
  title?: string;
  subtitle?: string;
  items: ProductCard[];
  onOpenItem: (productId: number) => void;
}) {
  const data = useMemo(() => items ?? [], [items]);
  if (!data.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{subtitle}</Text>

      <FlatList
        data={data}
        keyExtractor={(it) => String(it.product_id)}
        numColumns={COLS}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <MiniItemCard item={item} onPress={() => onOpenItem(item.product_id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 18, width: VIEWPORT_W, maxWidth: "100%" },
  title: { fontSize: 16, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7, fontSize: 12, fontWeight: "700" },
  listContent: { marginTop: 12 },
  row: { gap: CARD_GAP, marginBottom: CARD_GAP },
  cell: { width: CARD_W },
});
