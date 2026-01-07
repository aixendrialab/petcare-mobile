import React from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";

export function ShopSearchBar({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.searchRow}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search toys, food, medicine…"
        placeholderTextColor="rgba(0,0,0,0.45)"
        style={styles.searchInput}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      <Pressable style={styles.searchBtn} onPress={onSubmit}>
        <Text style={styles.searchBtnText}>Search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  searchBtn: {
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  searchBtnText: { fontWeight: "900" },
});
