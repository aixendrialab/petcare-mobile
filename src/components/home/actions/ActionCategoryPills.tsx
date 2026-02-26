import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { ActionsModel } from "../types";
import { HomeTheme } from "../theme";

export function ActionCategoryPills({ model }: { model: ActionsModel }) {
  const cats = model.categories;
  if (!cats?.enabled) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      {cats.items.map((c) => {
        const selected = cats.selectedKey === c.key;
        return (
          <Pressable
            key={c.key}
            onPress={() => cats.onSelect?.(c.key)}
            style={({ pressed }) => [
              styles.pill,
              selected ? styles.pillSelected : null,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.pillText, selected ? styles.pillTextSelected : null]}>{c.label}</Text>
          </Pressable>
        );
      })}
      <View style={{ width: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: HomeTheme.spacing.lg,
    gap: 10,
    paddingTop: 12,
    paddingBottom: 10,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: HomeTheme.radius.pill,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: HomeTheme.border,
  },
  pillSelected: {
    backgroundColor: "#E0F2FE",
    borderColor: "#BAE6FD",
  },
  pillText: {
    fontWeight: "900",
    color: HomeTheme.textMuted,
  },
  pillTextSelected: {
    color: "#0B3B5B",
  },
});
