import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { HomeTheme } from "../theme";

export function AttentionCTA({ text, onPress }: { text: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.75 : 1 }]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: HomeTheme.radius.pill,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: HomeTheme.border,
  },
  text: {
    fontWeight: "900",
    color: "#2563EB",
  },
});
