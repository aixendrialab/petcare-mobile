import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { ProductSpec } from "../types";

export function SpecsAccordion({ specs }: { specs: ProductSpec[] }) {
  const [open, setOpen] = useState(true);

  const groups = useMemo(() => {
    const m = new Map<string, ProductSpec[]>();
    for (const s of specs ?? []) {
      const g = s.spec_group || "General";
      if (!m.has(g)) m.set(g, []);
      m.get(g)!.push(s);
    }
    return Array.from(m.entries());
  }, [specs]);

  if (!specs?.length) return null;

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setOpen((s) => !s)} style={styles.header}>
        <Text style={styles.title}>Product specifications</Text>
        <Text style={styles.muted}>{open ? "Hide" : "Show"}</Text>
      </Pressable>

      {open ? (
        <View style={{ marginTop: 10 }}>
          {groups.map(([group, items]) => (
            <View key={group} style={{ marginBottom: 10 }}>
              <Text style={styles.group}>{group}</Text>

              {items.map((s, idx) => (
                <View key={`${group}-${s.key}-${idx}`} style={styles.row}>
                  <Text style={styles.k}>{s.key}</Text>
                  <Text style={styles.v}>{s.value}</Text>
                </View>
              ))}
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
  group: { fontWeight: "900", opacity: 0.9, marginTop: 6, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
  k: { width: "40%", opacity: 0.7, fontWeight: "900" },
  v: { width: "60%", fontWeight: "800" },
});
