import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import type { CatalogCategory } from "../../types";

const LABEL: Record<CatalogCategory, string> = {
  FOOD: "Food",
  ACCESSORY: "Accessories",
  MEDICINE: "Medicine",
  SERVICE: "Services",
};

export function CategoriesRow({
  categories,
  onPick,
}: {
  categories: CatalogCategory[];
  onPick: (c: CatalogCategory) => void;
}) {
  const cats = useMemo(() => categories ?? [], [categories]);
  if (!cats.length) return null;

  return (
    <View style={{ marginTop: 14 }}>
      <View style={styles.headRow}>
        <Text style={styles.h2}>Categories</Text>
        <Text style={styles.hint}>Swipe</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
        {cats.map((c) => (
          <Pressable key={c} style={styles.chip} onPress={() => onPick(c)}>
            <Text style={styles.chipText}>{LABEL[c] ?? c}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  h2: { fontSize: 16, fontWeight: "900" },
  hint: { opacity: 0.6, fontWeight: "800", fontSize: 12 },

  chip: {
    marginRight: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  chipText: { fontWeight: "900", opacity: 0.9 },
});
