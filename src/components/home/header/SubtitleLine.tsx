import React from "react";
import { StyleSheet, Text } from "react-native";
import { HomeTheme } from "../theme";

export function SubtitleLine({ text }: { text: string }) {
  return (
    <Text style={styles.subtitle} numberOfLines={1}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: HomeTheme.textMuted,
    marginTop: 4,
  },
});
