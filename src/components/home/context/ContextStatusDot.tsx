import React from "react";
import { StyleSheet, View } from "react-native";
import type { ContextStatus } from "../types";

export function ContextStatusDot({ status }: { status?: ContextStatus }) {
  const color =
    status === "overdue" ? "#EF4444" : status === "dueSoon" ? "#F59E0B" : "#22C55E";
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
  },
});
