import React from "react";
import { Text, StyleSheet, View } from "react-native";
import type { QuickTone } from "../types";
import { HomeTheme, toneColors } from "../theme";

export function SectionLabelChip({ text, tone }: { text: string; tone?: QuickTone }) {
  const c = toneColors(tone);
  return (
    <View style={[styles.chip, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.text, { color: c.fg }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: HomeTheme.radius.pill,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
