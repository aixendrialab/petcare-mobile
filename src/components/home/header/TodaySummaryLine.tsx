import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { QuickTone } from "../types";
import { HomeTheme, toneColors } from "../theme";

export function TodaySummaryLine({
  text,
  tone,
  isLoading,
}: {
  text: string;
  tone?: QuickTone;
  isLoading?: boolean;
}) {
  const c = toneColors(tone);
  return (
    <View style={[styles.wrap, { backgroundColor: c.bg, borderColor: c.border }]}>
      {isLoading ? <ActivityIndicator /> : null}
      <Text style={[styles.text, { color: c.fg }]} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    flex: 1,
    fontWeight: "800",
    color: HomeTheme.text,
  },
});
