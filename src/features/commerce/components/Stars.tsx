import React from "react";
import { Text, StyleSheet } from "react-native";

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
  const v = Number.isFinite(value) ? value : 0;
  const full = Math.floor(v);
  const half = v - full >= 0.5;

  const s =
    "★".repeat(full) +
    (half ? "½" : "") +
    "☆".repeat(Math.max(0, 5 - full - (half ? 1 : 0)));

  return <Text style={[styles.stars, { fontSize: size }]}>{s}</Text>;
}

const styles = StyleSheet.create({
  stars: { opacity: 0.9 },
});
