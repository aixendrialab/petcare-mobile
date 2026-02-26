import React from "react";
import { StyleSheet, Text } from "react-native";
import { HomeTheme } from "../theme";

export function GreetingTitle({ text }: { text: string }) {
  return (
    <Text style={styles.title} numberOfLines={1}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: HomeTheme.text,
    letterSpacing: -0.3,
  },
});
