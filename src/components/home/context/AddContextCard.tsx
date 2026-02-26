import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HomeTheme } from "../theme";

export function AddContextCard({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.wrap}>
        <View style={styles.circle}>
          <Text style={styles.plus}>＋</Text>
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 86,
    alignItems: "center",
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: HomeTheme.radius.pill,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: 24,
    fontWeight: "900",
    color: "#64748B",
  },
  label: {
    marginTop: 8,
    fontWeight: "900",
    color: HomeTheme.textMuted,
  },
});
