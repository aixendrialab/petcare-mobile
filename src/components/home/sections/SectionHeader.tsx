import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { IconName, IconRegistry, QuickTone, SeeAllModel } from "../types";
import { HomeTheme } from "../theme";
import { SectionIconBadge } from "./SectionIconBadge";
import { SectionLabelChip } from "./SectionLabelChip";

export function SectionHeader({
  title,
  accent,
  icons,
  seeAll,
}: {
  title: string;
  accent?: { iconName: IconName; tone?: QuickTone; label?: string };
  icons: IconRegistry;
  seeAll?: SeeAllModel;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {accent?.iconName ? (
          <SectionIconBadge iconName={accent.iconName} tone={accent.tone} icons={icons} />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {accent?.label ? (
            <View style={{ marginTop: 6 }}>
              <SectionLabelChip text={accent.label} tone={accent.tone} />
            </View>
          ) : null}
        </View>
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: HomeTheme.text,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
});
