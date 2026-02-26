import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DiscoverModel, IconRegistry } from "../types";
import { HomeTheme } from "../theme";
import { DiscoverItemCard } from "./DiscoverItemCard";

export function DiscoverAccordion({ model, icons }: { model: DiscoverModel; icons: IconRegistry }) {
  const [open, setOpen] = React.useState(!(model.collapsedByDefault ?? true) ? true : false);

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((v) => !v)} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{model.title}</Text>
          <Text style={styles.chev}>{open ? "▾" : "▸"}</Text>
        </View>
      </Pressable>
      {open ? (
        <View style={styles.list}>
          {model.items.map((it) => (
            <DiscoverItemCard key={it.key} item={it} icons={icons} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: HomeTheme.spacing.lg,
    marginTop: HomeTheme.spacing.xl,
    marginBottom: HomeTheme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: HomeTheme.textMuted,
    letterSpacing: 0.3,
  },
  chev: { color: HomeTheme.textMuted, fontSize: 16, fontWeight: "900" },
  list: {
    marginTop: 10,
    gap: 10,
  },
});
