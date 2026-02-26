import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { SecondaryContextModel } from "../types";
import { HomeTheme } from "../theme";
import { ContextCarousel } from "./ContextCarousel";

export function SecondaryContextStrip({ model }: { model: SecondaryContextModel }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{model.title}</Text>
      <View style={{ marginTop: 12 }}>
        <ContextCarousel model={model} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 6,
    paddingBottom: HomeTheme.spacing.lg,
  },
  title: {
    paddingHorizontal: HomeTheme.spacing.lg,
    fontSize: 18,
    fontWeight: "900",
    color: HomeTheme.text,
  },
});
