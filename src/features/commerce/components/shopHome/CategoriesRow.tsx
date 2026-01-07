import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { CatalogCategory } from "../../types";
import {
  PillsIcon,
  BowlIcon,
  CollarIcon,
  HomeIcon,
  PlanIcon,
} from "../icons/ShopIcons";

function CategoryTile({
  title,
  subtitle,
  onPress,
  bg,
  Icon,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  bg: string;
  Icon: React.ReactNode;
}) {
  return (
    <Pressable style={[styles.tile, { backgroundColor: bg }]} onPress={onPress}>
      <View style={styles.iconBubble}>{Icon}</View>
      <Text style={styles.tileTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.tileSub} numberOfLines={1}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

export function CategoriesRow({
  onPick,
}: {
  onPick: (c: CatalogCategory) => void;
}) {
  return (
    <View style={{ marginTop: 14 }}>
      <View style={styles.headRow}>
        <Text style={styles.h2}>Categories</Text>
        <Text style={styles.hint}>Tap to browse</Text>
      </View>

      <View style={styles.grid}>
        <CategoryTile
          title="Medicine"
          subtitle="Rx & OTC"
          bg="rgba(66, 135, 245, 0.22)"
          onPress={() => onPick("MEDICINE")}
          Icon={<PillsIcon size={18} />}
        />

        <CategoryTile
          title="Food"
          subtitle="Dry & wet"
          bg="rgba(245, 166, 35, 0.22)"
          onPress={() => onPick("FOOD")}
          Icon={<BowlIcon size={18} />}
        />

        <CategoryTile
          title="Accessory"
          subtitle="Collars, toys"
          bg="rgba(255, 99, 132, 0.20)"
          onPress={() => onPick("ACCESSORY")}
          Icon={<CollarIcon size={18} />}
        />

        <CategoryTile
          title="Boarding"
          subtitle="Stay & care"
          bg="rgba(76, 217, 100, 0.18)"
          onPress={() => onPick("BOARDING")}
          Icon={<HomeIcon size={18} />}
        />

        <CategoryTile
          title="Diet plan"
          subtitle="Custom"
          bg="rgba(155, 89, 182, 0.18)"
          onPress={() => onPick("DIET_PLAN")}
          Icon={<PlanIcon size={18} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  h2: { fontSize: 16, fontWeight: "900" },
  hint: { opacity: 0.7, fontWeight: "800", fontSize: 12 },

  grid: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  tile: {
    width: "48.5%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },

  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  tileTitle: { fontWeight: "900", fontSize: 14, opacity: 0.95 },
  tileSub: { marginTop: 4, opacity: 0.75, fontWeight: "800", fontSize: 12 },
});
