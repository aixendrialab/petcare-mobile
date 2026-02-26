import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { AttentionModel, IconRegistry } from "../types";
import { HomeTheme } from "../theme";
import { SectionCard } from "../sections/SectionCard";
import { AttentionList } from "./AttentionList";

export function AttentionPanel({ model, icons }: { model: AttentionModel; icons: IconRegistry }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{model.title}</Text>
      <SectionCard>
        <AttentionList model={model} icons={icons} />
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: HomeTheme.spacing.lg,
    marginTop: HomeTheme.spacing.lg,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: HomeTheme.textMuted,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
});
