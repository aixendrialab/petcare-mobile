import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ChipModel } from "../types";
import { HomeTheme, toneColors } from "../theme";

export function ContextMiniBadges({ badges }: { badges?: ChipModel[] }) {
  if (!badges || badges.length === 0) return null;
  return (
    <View style={styles.row}>
      {badges.slice(0, 3).map((b, idx) => {
        const c = toneColors(b.tone);
        return (
          <View key={idx} style={[styles.chip, { backgroundColor: c.bg, borderColor: c.border }]}>
            <Text style={[styles.text, { color: c.fg }]} numberOfLines={1}>
              {b.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: HomeTheme.radius.pill,
    borderWidth: 1,
  },
  text: { fontSize: 11, fontWeight: "800" },
});
