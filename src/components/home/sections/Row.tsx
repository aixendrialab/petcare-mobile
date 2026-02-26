import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { IconName, IconRegistry, SectionRowModel } from "../types";
import { HomeTheme } from "../theme";

export function Row({ row, icons }: { row: SectionRowModel; icons: IconRegistry }) {
  const content = (
    <View style={styles.row}>
      {row.leftIconName ? (
        <View style={styles.leftIcon}>{icons[row.leftIconName as IconName]}</View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.primary} numberOfLines={1}>
          {row.primary}
        </Text>
        {row.secondary ? (
          <Text style={styles.secondary} numberOfLines={1}>
            {row.secondary}
          </Text>
        ) : null}
        {row.tertiary ? (
          <Text style={styles.tertiary} numberOfLines={1}>
            {row.tertiary}
          </Text>
        ) : null}
      </View>
      {row.onPress ? <Text style={styles.chev}>›</Text> : null}
    </View>
  );

  if (row.onPress) {
    return (
      <Pressable onPress={row.onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  leftIcon: {
    width: 28,
    height: 28,
    borderRadius: HomeTheme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  primary: {
    fontSize: 14,
    fontWeight: "800",
    color: HomeTheme.text,
  },
  secondary: {
    fontSize: 13,
    fontWeight: "600",
    color: HomeTheme.textMuted,
    marginTop: 2,
  },
  tertiary: {
    fontSize: 12,
    fontWeight: "600",
    color: HomeTheme.textMuted,
    marginTop: 2,
  },
  chev: {
    fontSize: 18,
    color: HomeTheme.textMuted,
    paddingHorizontal: 4,
  },
});
