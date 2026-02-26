import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SeeAllModel } from "../types";
import { HomeTheme } from "../theme";

export function ActionsHeader({
  title,
  seeAll,
}: {
  title: string;
  seeAll?: SeeAllModel;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {seeAll ? (
        <Pressable onPress={seeAll.onPress} hitSlop={10}>
          <Text style={styles.seeAll}>{seeAll.label ?? "See all"} ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: HomeTheme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: HomeTheme.text,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },
});
