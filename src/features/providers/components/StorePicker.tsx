import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export function StorePicker({
  stores,
  selectedStoreId,
  onPick,
  showAll = true,
}: {
  stores: { id: number; display_name: string }[];
  selectedStoreId: number | null;
  onPick: (s: { store_id: number; display_name: string } | null) => void;
  showAll?: boolean;
}) {
  return (
    <View style={styles.row}>
      {showAll ? (
        <Pressable
          style={[styles.chip, selectedStoreId === null && styles.chipActive]}
          onPress={() => onPick(null)}
        >
          <Text style={[styles.chipText, selectedStoreId === null && styles.chipTextActive]}>All Stores</Text>
        </Pressable>
      ) : null}

      {stores.map((s) => {
        const active = selectedStoreId === s.id;
        return (
          <Pressable
            key={s.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onPick({ store_id: s.id, display_name: s.display_name })}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
              {s.display_name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  chipActive: { backgroundColor: "rgba(255,255,255,0.12)" },
  chipText: { fontWeight: "800", opacity: 0.8, maxWidth: 160 },
  chipTextActive: { opacity: 1 },
});
