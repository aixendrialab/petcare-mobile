import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HomeTheme } from "../theme";

export function EmptyAttention({ text }: { text: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 6,
  },
  text: {
    color: HomeTheme.textMuted,
    fontWeight: "700",
  },
});
