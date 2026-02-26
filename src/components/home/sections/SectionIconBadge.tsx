import React from "react";
import { View, StyleSheet } from "react-native";
import type { IconName, IconRegistry, QuickTone } from "../types";
import { HomeTheme, toneColors } from "../theme";

export function SectionIconBadge({
  iconName,
  tone,
  icons,
}: {
  iconName: IconName;
  tone?: QuickTone;
  icons: IconRegistry;
}) {
  const c = toneColors(tone);
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={{ opacity: 0.95 }}>{icons[iconName]}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 32,
    height: 32,
    borderRadius: HomeTheme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
