import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AttentionItemModel, IconRegistry } from "../types";
import { HomeTheme } from "../theme";
import { AttentionCTA } from "./AttentionCTA";

export function AttentionItem({ item, icons }: { item: AttentionItemModel; icons: IconRegistry }) {
  const content = (
    <View style={styles.row}>
      <View style={styles.iconWrap}>{icons[item.iconName]}</View>
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
      {item.cta ? <AttentionCTA text={item.cta.text} onPress={item.cta.onPress} /> : null}
    </View>
  );

  if (item.onPress) {
    return (
      <Pressable onPress={item.onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
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
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 99,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: HomeTheme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "900",
    color: HomeTheme.text,
  },
  sub: {
    marginTop: 2,
    fontWeight: "700",
    color: HomeTheme.textMuted,
    fontSize: 12,
  },
});
