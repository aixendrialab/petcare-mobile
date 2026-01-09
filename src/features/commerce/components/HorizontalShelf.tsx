import React from "react";
import { View, Text, FlatList, Pressable, Image, StyleSheet } from "react-native";
import type { ProductCard } from "../types";
import { Stars } from "./Stars";
import { Badge } from "./Badge";

export function HorizontalShelf({
  title,
  items,
  onOpenItem,
}: {
  title: string;
  items: ProductCard[];
  onOpenItem: (productId: number) => void;
}) {
  if (!items?.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(x) => String(x.product_id)}
        renderItem={({ item }) => {
          const img = item.primary_image || "https://picsum.photos/seed/petcaremini/240/240";
          const price = item.best_price?.amount ?? 0;
          const mrp = item.mrp?.amount ?? 0;
          return (
            <Pressable style={styles.card} onPress={() => onOpenItem(item.product_id)}>
              <Image source={{ uri: img }} style={styles.img} />
              <Text style={styles.name} numberOfLines={2}>{item.title}</Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
                <Text style={styles.price}>₹ {Math.round(price)}</Text>
                {mrp > price ? <Text style={styles.mrp}>₹ {Math.round(mrp)}</Text> : null}
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
                <Stars value={item.rating_avg ?? 0} />
                <Text style={styles.muted}>({item.rating_count ?? 0})</Text>
              </View>

              {!!item.badges?.length && (
                <View style={{ marginTop: 8 }}>
                  <Badge text={item.badges[0]} variant="deal" />
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12 },
  title: { fontWeight: "900", fontSize: 14, marginBottom: 10 },
  card: { width: 160, marginRight: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 10 },
  img: { width: "100%", height: 96, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)" },
  name: { marginTop: 8, fontWeight: "900", fontSize: 12 },
  price: { fontWeight: "900" },
  mrp: { textDecorationLine: "line-through", opacity: 0.6 },
  muted: { opacity: 0.7, fontSize: 12 },
});
