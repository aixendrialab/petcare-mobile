import React from "react";
import { StyleSheet, View } from "react-native";
import { HomeTheme } from "../theme";

export function SectionCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: HomeTheme.cardBg,
    borderRadius: HomeTheme.radius.card,
    borderWidth: 1,
    borderColor: HomeTheme.border,
    padding: HomeTheme.spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});
