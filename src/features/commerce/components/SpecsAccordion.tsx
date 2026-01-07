import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { SpecKV } from "../types";

export function SpecsAccordion({ specs }: { specs: SpecKV[] }) {
  const [open, setOpen] = useState(true);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setOpen((s) => !s)} style={styles.header}>
        <Text style={styles.title}>Product specifications</Text>
        <Text style={styles.muted}>{open ? "Hide" : "Show"}</Text>
      </Pressable>

      {open ? (
        <View style={{ marginTop: 10 }}>
          {(specs ?? []).map((s, idx) => (
            <View key={`${s.k}-${idx}`} style={styles.row}>
              <Text style={styles.k}>{s.k}</Text>
              <Text style={styles.v}>{s.v}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontWeight: "900", fontSize: 14 },
  muted: { opacity: 0.7 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
  k: { width: "40%", opacity: 0.7, fontWeight: "900" },
  v: { width: "60%", fontWeight: "800" },
});
