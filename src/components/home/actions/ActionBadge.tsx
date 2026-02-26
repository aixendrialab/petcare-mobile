import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { QuickTone } from "../types";
import { HomeTheme, toneColors } from "../theme";

export function ActionBadge({ text, tone }: { text: string; tone?: QuickTone }) {
  const c = toneColors(tone);
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.text, { color: c.fg }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginTop: 8,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: HomeTheme.radius.pill,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: "900",
  },
});
