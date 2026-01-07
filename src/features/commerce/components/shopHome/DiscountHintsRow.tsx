import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import type { DiscountHint } from "../../types";

export function DiscountHintsRow({ hints }: { hints?: DiscountHint[] }) {
  if (!hints?.length) return null;

  return (
    <View style={{ marginTop: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hints.slice(0, 8).map((h, idx) => (
          <View key={`${h.title}-${idx}`} style={styles.card}>
            <Text style={styles.title}>{h.title}</Text>
            <Text style={styles.msg} numberOfLines={2}>
              {h.message}
            </Text>
            {!!h.progress && (
              <Text style={styles.small} numberOfLines={1}>
                ₹ {Math.round(h.progress.current.amount)} / ₹ {Math.round(h.progress.target.amount)}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  title: { fontWeight: "900" },
  msg: { marginTop: 6, opacity: 0.75 },
  small: { marginTop: 8, opacity: 0.65, fontWeight: "800" },
});
