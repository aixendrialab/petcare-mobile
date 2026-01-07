import React from "react";
import { Text, StyleSheet, ViewStyle } from "react-native";

export function Badge({
  text,
  variant = "neutral",
  style,
}: {
  text: string;
  variant?: "neutral" | "deal" | "rx";
  style?: ViewStyle;
}) {
  return (
    <Text
      style={[
        styles.base,
        variant === "deal" && styles.deal,
        variant === "rx" && styles.rx,
        style,
      ]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    fontWeight: "900",
    opacity: 0.95,
  },
  deal: { backgroundColor: "rgba(255,80,80,0.18)", borderColor: "rgba(255,80,80,0.25)" },
  rx: { backgroundColor: "rgba(255,165,0,0.16)", borderColor: "rgba(255,165,0,0.25)", color: "orange" },
});
