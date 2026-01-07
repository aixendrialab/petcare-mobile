import React from "react";
import { View, Text, FlatList, Image, Pressable, StyleSheet } from "react-native";
import type { CatalogMiniItem } from "../types";
import { Badge } from "./Badge";
import { Stars } from "./Stars";

export function HorizontalShelf({
  title,
  items,
  onOpenItem,
}: {
  title: string;
  items: CatalogMiniItem[];
  onOpenItem: (id: number) => void;
}) {
  if (!items?.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(x) => String(x.id)}
        renderItem={({ item }) => {
          const img = item.primary_image || "https://picsum.photos/seed/petcaremini/240/240";
          return (
            <Pressable style={styles.card} onPress={() => onOpenItem(item.id)}>
              <Image source={{ uri: img }} style={styles.img} />
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
                <Text style={styles.price}>₹ {Math.round(item.price.amount)}</Text>
                {!!item.mrp && item.mrp.amount > item.price.amount ? (
                  <Text style={styles.mrp}>₹ {Math.round(item.mrp.amount)}</Text>
                ) : null}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
                <Stars value={item.rating?.avg ?? 4.2} />
                <Text style={styles.muted}>({item.rating?.count ?? 0})</Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {(item.badges ?? []).slice(0, 1).map((b) => (
                  <Badge key={b} text={b} variant="deal" />
                ))}
              </View>
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
