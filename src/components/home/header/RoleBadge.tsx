import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HomeTheme } from "../theme";

export function RoleBadge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: HomeTheme.radius.pill,
    borderWidth: 1,
    borderColor: HomeTheme.border,
    backgroundColor: "#EEF2FF",
  },
  text: {
    fontWeight: "800",
    color: "#1E293B",
  },
});
