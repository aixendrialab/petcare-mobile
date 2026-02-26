import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DiscoverItemModel, IconRegistry } from "../types";
import { HomeTheme, toneColors } from "../theme";

export function DiscoverItemCard({ item, icons }: { item: DiscoverItemModel; icons: IconRegistry }) {
  const c = toneColors(item.tone);
  return (
    <Pressable onPress={item.onPress} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
      <View style={[styles.row, { backgroundColor: HomeTheme.cardBg, borderColor: HomeTheme.border }]}>
        <View style={[styles.icon, { backgroundColor: c.bg, borderColor: c.border }]}>{icons[item.iconName]}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item.subtitle ? (
            <Text style={styles.sub} numberOfLines={1}>
              {item.subtitle}
            </Text>
          ) : null}
        </View>
        <Text style={styles.chev}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: HomeTheme.radius.card,
    borderWidth: 1,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: { fontWeight: "900", color: HomeTheme.text },
  sub: { marginTop: 2, fontWeight: "700", color: HomeTheme.textMuted, fontSize: 12 },
  chev: { fontSize: 18, color: HomeTheme.textMuted },
});
