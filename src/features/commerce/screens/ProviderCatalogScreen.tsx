import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import type { ProviderRole } from "@/src/features/providers/types";
import type { CatalogItem, CatalogCategory } from "../types";
import { fetchProviderCatalog } from "../api";

const CATEGORY_CHOICES: CatalogCategory[] = ["MEDICINE", "FOOD", "ACCESSORY", "BOARDING", "DIET_PLAN"];
const KIND_CHOICES = ["PRODUCT", "SERVICE"] as const;

export default function ProviderCatalogScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [q, setQ] = useState("");
  const [filterCat, setFilterCat] = useState<CatalogCategory | "">("");

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProviderCatalog(role);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [role]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return items
      .filter((x) => (filterCat ? x.category === filterCat : true))
      .filter((x) => (qq ? (x.name || "").toLowerCase().includes(qq) : true));
  }, [items, q, filterCat]);

  function openCreate() {
    const base = role === "pharmacy" ? "/pharmacist/catalog/edit" : "/vendor/catalog/edit";
    router.push({ pathname: base as any, params: { mode: "create" } });
  }

  function openEdit(id: number) {
    const base = role === "pharmacy" ? "/pharmacist/catalog/edit" : "/vendor/catalog/edit";
    router.push({ pathname: base as any, params: { mode: "edit", id: String(id) } });
  }

  return (
    <View style={styles.page}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Catalog</Text>
          <Text style={styles.sub}>Role: {role}</Text>
        </View>
        <Pressable style={styles.primaryBtn} onPress={openCreate}>
          <Text style={styles.primaryBtnText}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search…"
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.searchInput}
        />
        <Pressable
          style={styles.pill}
          onPress={() => {
            // quick cycle through categories
            const idx = CATEGORY_CHOICES.indexOf(filterCat as any);
            const next = idx === -1 ? CATEGORY_CHOICES[0] : CATEGORY_CHOICES[(idx + 1) % CATEGORY_CHOICES.length];
            setFilterCat(next);
          }}
          onLongPress={() => setFilterCat("")}
        >
          <Text style={styles.pillText}>{filterCat || "All"}</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(x) => String(x.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => openEdit(item.id)}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.price}>₹ {item.price}</Text>
              </View>

              <Text style={styles.cardSub} numberOfLines={2}>
                {item.description || "—"}
              </Text>

              <View style={[styles.rowBetween, { marginTop: 10 }]}>
                <Text style={styles.badge}>
                  {item.kind} • {item.category} • {item.active ? "ACTIVE" : "INACTIVE"}
                </Text>
                {!!item.rx_required && <Text style={styles.rx}>RX</Text>}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No catalog items.</Text>}
        />
      )}

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable style={styles.secondaryBtn} onPress={load}>
          <Text style={styles.secondaryBtnText}>Refresh</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => {
            // Quick helper to switch between product/service view later
            // (keeping as placeholder for now)
          }}
        >
          <Text style={styles.secondaryBtnText}>Filter (later)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  h1: { fontSize: 20, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7 },

  filterRow: { flexDirection: "row", gap: 10, marginTop: 12, marginBottom: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pill: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  pillText: { fontWeight: "800", opacity: 0.9 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, marginBottom: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontWeight: "900", fontSize: 16, flex: 1, paddingRight: 8 },
  cardSub: { marginTop: 6, opacity: 0.7 },
  badge: { opacity: 0.7, fontWeight: "700" },
  price: { fontWeight: "900" },
  rx: { color: "orange", fontWeight: "900" },

  primaryBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { fontWeight: "900" },

  secondaryBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800", opacity: 0.9 },
});
