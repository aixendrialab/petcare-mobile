import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ActionTileModel, IconRegistry } from "../types";
import { HomeTheme, toneColors } from "../theme";
import { ActionBadge } from "./ActionBadge";

export function ActionTile({ tile, icons, width }: { tile: ActionTileModel; icons: IconRegistry; width: number }) {
  const c = toneColors(tile.tone);
  return (
    <Pressable onPress={tile.onPress} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1, width }]}>
      <View style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}> 
        <View style={styles.iconWrap}>{icons[tile.iconName]}</View>
        <Text style={[styles.title, { color: c.fg }]} numberOfLines={1}>
          {tile.title}
        </Text>
        {tile.badgeText ? <ActionBadge text={tile.badgeText} tone={tile.badgeTone ?? tile.tone} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: HomeTheme.radius.tile,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 92,
  },
  iconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
});
