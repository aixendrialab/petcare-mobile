import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { EmptyModel } from "../types";
import { HomeTheme } from "../theme";

export function Empty({ model }: { model: EmptyModel }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{model.text}</Text>
      {model.action ? (
        <Pressable onPress={model.action.onPress} style={styles.btn}>
          <Text style={styles.btnText}>{model.action.label ?? "Tap to continue"}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 8,
    gap: 10,
  },
  text: {
    color: HomeTheme.textMuted,
    fontWeight: "600",
  },
  btn: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: HomeTheme.radius.pill,
    borderWidth: 1,
    borderColor: HomeTheme.border,
    backgroundColor: "#F8FAFC",
  },
  btnText: {
    fontWeight: "800",
    color: "#2563EB",
  },
});
