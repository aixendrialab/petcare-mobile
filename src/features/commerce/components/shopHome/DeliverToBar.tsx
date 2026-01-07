import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export function DeliverToBar({
  label = "Delivering to",
  value,
  onPress,
}: {
  label?: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={{ flex: 1 }}>
        <Text style={styles.small}>{label}</Text>
        <Text style={styles.big} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Text style={styles.change}>Change</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  small: { opacity: 0.65, fontWeight: "800", fontSize: 12 },
  big: { marginTop: 2, fontWeight: "900", fontSize: 14 },
  change: { fontWeight: "900", opacity: 0.75 },
});
