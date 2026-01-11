import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import type { ProviderRole } from "@/src/features/providers/types";
import type { InventoryItem } from "../types";
import { adjustStock, fetchInventory, fetchProviderCatalog } from "../api";

type InventoryRow = InventoryItem & {
  brand?: string | null;
  category?: string | null;
};

export default function ProviderInventoryScreen({ role }: { role: ProviderRole }) {
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<InventoryRow[]>([]);

  async function load() {
    setLoading(true);
    try {
      const [inv, offers] = await Promise.all([
        fetchInventory(role).catch(() => []),
        fetchProviderCatalog(role).catch(() => []),
      ]);

      // offers: /store/items returns sku_id + category + brand + title etc.
      const offerBySku = new Map<number, any>();
      offers.forEach((o: any) => {
        if (Number.isFinite(o?.sku_id)) offerBySku.set(Number(o.sku_id), o);
      });

      const joined: InventoryRow[] = inv.map((x) => {
        const o = offerBySku.get(Number(x.sku_id));
        return {
          ...x,
          title: o?.title ?? x.title,
          variant: x.variant ?? o?.variant ?? null,
          category: o?.category ?? null,
          brand: o?.brand ?? null,
        };
      });

      setRows(joined);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((r) => {
      const t = `${r.title ?? ""} ${r.variant ?? ""} ${r.brand ?? ""}`.toLowerCase();
      return t.includes(qq);
    });
  }, [rows, q]);

  async function bump(sku_id: number, delta: number) {
    const key = `${sku_id}:${delta}`;
    setBusyKey(key);
    try {
      await adjustStock(role, { sku_id, delta });
      await load();
    } finally {
      setBusyKey(null);
    }
  }

  function openEdit(item: InventoryRow) {
    // Use prompt-like inline edit: simplest is "set to" via two quick actions
    // If you want modal edit like before, tell me and I’ll add it.
    bump(item.sku_id, +10);
  }

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Inventory</Text>
      <Text style={styles.sub}>Role: {role}</Text>

      <View style={styles.filterRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search items…"
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.searchInput}
        />
        <Pressable style={styles.refreshBtn} onPress={load}>
          <Text style={styles.refreshBtnText}>↻</Text>
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
          keyExtractor={(x) => String(x.sku_id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.qty}>{item.stock_qty ?? 0}</Text>
              </View>

              <Text style={styles.cardSub} numberOfLines={2}>
                {(item.brand ? `${item.brand} • ` : "")}
                {(item.category ? `${item.category} • ` : "")}
                {item.variant ?? ""}
              </Text>

              <Text style={[styles.cardSub, { marginTop: 6 }]} numberOfLines={1}>
                Reorder: {item.reorder_level ?? 0} • Active: {item.is_active ? "Yes" : "No"}
              </Text>

              <View style={{ height: 10 }} />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  style={[styles.smallBtn, { flex: 1 }]}
                  onPress={() => bump(item.sku_id, -1)}
                  disabled={busyKey === `${item.sku_id}:-1`}
                >
                  <Text style={styles.smallBtnText}>
                    {busyKey === `${item.sku_id}:-1` ? "…" : "-1"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.smallBtn, { flex: 1 }]}
                  onPress={() => bump(item.sku_id, +1)}
                  disabled={busyKey === `${item.sku_id}:1`}
                >
                  <Text style={styles.smallBtnText}>
                    {busyKey === `${item.sku_id}:1` ? "…" : "+1"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.smallBtn, { flex: 1 }]}
                  onPress={() => bump(item.sku_id, +10)}
                  disabled={busyKey === `${item.sku_id}:10`}
                >
                  <Text style={styles.smallBtnText}>
                    {busyKey === `${item.sku_id}:10` ? "…" : "+10"}
                  </Text>
                </Pressable>
              </View>

              <Pressable style={styles.editBtn} onPress={() => openEdit(item)}>
                <Text style={styles.editBtnText}>Quick +10</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No inventory items.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
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
  refreshBtn: {
    width: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  refreshBtnText: { fontWeight: "900", fontSize: 16 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontWeight: "900", fontSize: 16, flex: 1, paddingRight: 8 },
  qty: { fontWeight: "900", fontSize: 18 },
  cardSub: { marginTop: 6, opacity: 0.7, fontWeight: "700" },

  smallBtn: { padding: 10, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  smallBtnText: { textAlign: "center", fontWeight: "900" },

  editBtn: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  editBtnText: { textAlign: "center", fontWeight: "900" },
});
