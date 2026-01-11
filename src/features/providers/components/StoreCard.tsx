import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export function StoreCard({
  title,
  subtitle,
  imageUri,
  rightBadge,
  selected,
  onPress,
}: {
  title: string;
  subtitle?: string | null;
  imageUri?: string | null;
  rightBadge?: string | null;
  selected?: boolean;
  onPress?: () => void;
}) {
  const img = imageUri || "https://picsum.photos/seed/petcare-store/160/160";

  return (
    <Pressable style={[styles.card, selected && styles.cardSelected]} onPress={onPress}>
      <Image source={{ uri: img }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.rowBetween}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {rightBadge ? <Text style={styles.badge}>{rightBadge}</Text> : null}
        </View>
        {!!subtitle ? <Text style={styles.sub} numberOfLines={2}>{subtitle}</Text> : null}
        {selected ? <Text style={styles.selected}>Selected</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
  },
  cardSelected: {
    borderColor: "rgba(59,130,246,0.45)",
    backgroundColor: "rgba(59,130,246,0.06)",
  },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.06)" },
  title: { fontWeight: "900", fontSize: 14 },
  sub: { marginTop: 2, opacity: 0.7, fontWeight: "700", fontSize: 12 },
  selected: { marginTop: 6, fontSize: 11, fontWeight: "900", opacity: 0.8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  badge: {
    fontSize: 11,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
});
