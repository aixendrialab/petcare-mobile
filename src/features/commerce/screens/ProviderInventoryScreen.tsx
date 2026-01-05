// ProviderInventoryScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import type { ProviderRole } from "@/src/features/providers/types";
import type { CatalogItem, InventoryItem } from "../types";
import { adjustStock, fetchInventory, fetchProviderCatalog } from "../api";

type InventoryRow = InventoryItem & {
  name?: string;
  category?: string;
  kind?: string;
  rx_required?: boolean;
};

export default function ProviderInventoryScreen({ role }: { role: ProviderRole }) {
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);

  // pharmacy: optional batch fields used when adjusting
  const [batchNo, setBatchNo] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // YYYY-MM-DD

  // edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryRow | null>(null);
  const [editDelta, setEditDelta] = useState("0");
  const [editSetTo, setEditSetTo] = useState(""); // absolute set (optional)

  const isPharmacy = role === ("pharmacist" as ProviderRole);

  async function load() {
    setLoading(true);
    try {
      const [inv, cat] = await Promise.all([fetchInventory(role), fetchProviderCatalog(role)]);
      setCatalog(cat);

      // inv might be empty initially — map by catalog_item_id
      const invByItemId = new Map<number, InventoryItem>();
      inv.forEach((x) => invByItemId.set(x.catalog_item_id, x));

      // ✅ build rows from catalog so items show even when no inventory exists yet
      const joined: InventoryRow[] = cat.map((c) => {
        const invRow = invByItemId.get(c.id);

        // We keep InventoryItem shape for rendering; fill defaults
        const base: Partial<InventoryItem> = {
          id: invRow?.id ?? undefined,
          store_id: invRow?.store_id ?? undefined,
          catalog_item_id: c.id,
          stock_qty: invRow?.stock_qty ?? 0,
          reorder_level: invRow?.reorder_level ?? 0,
          batch_no: invRow?.batch_no ?? undefined,
          expiry_date: invRow?.expiry_date ?? undefined,
        };

        return {
          ...(base as InventoryItem),
          name: (c as any).name ?? (c as any).title, // support either naming
          category: c.category,
          kind: (c as any).kind,
          rx_required: (c as any).rx_required ?? (c as any).prescription_required,
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
    return rows.filter((r) => (r.name || "").toLowerCase().includes(qq));
  }, [rows, q]);

  async function bump(catalog_item_id: number, delta: number) {
    const key = `${catalog_item_id}:${delta}`;
    setBusyKey(key);
    try {
      await adjustStock(
        role,
        {
          catalog_item_id,
          delta,
          reason: delta > 0 ? "RESTOCK" : "SALE",
          batch_no: isPharmacy ? batchNo || undefined : undefined,
          expiry_date: isPharmacy ? expiryDate || undefined : undefined,
        } as any
      );
      await load();
    } finally {
      setBusyKey(null);
    }
  }

  function openEdit(item: InventoryRow) {
    setEditItem(item);
    setEditDelta("0");
    setEditSetTo("");
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editItem) return;

    const current = Number(editItem.stock_qty ?? 0);

    let delta = 0;
    if (editSetTo.trim() !== "") {
      const target = Number(editSetTo);
      if (!Number.isFinite(target)) return;
      delta = target - current;
    } else {
      const d = Number(editDelta || 0);
      if (!Number.isFinite(d)) return;
      delta = d;
    }

    if (delta === 0) {
      setEditOpen(false);
      return;
    }

    await bump(editItem.catalog_item_id, delta);
    setEditOpen(false);
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

      {isPharmacy ? (
        <View style={styles.pharmacyBox}>
          <Text style={{ fontWeight: "900" }}>Batch details (optional for adjust)</Text>
          <View style={{ height: 10 }} />
          <TextInput
            value={batchNo}
            onChangeText={setBatchNo}
            style={styles.input}
            placeholder="Batch no (optional)"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
          <TextInput
            value={expiryDate}
            onChangeText={setExpiryDate}
            style={[styles.input, { marginTop: 8 }]}
            placeholder="Expiry date YYYY-MM-DD (optional)"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
          <Text style={{ marginTop: 6, opacity: 0.6, fontSize: 12 }}>
            Later we’ll enforce batch+expiry for medicines; for mock phase, it’s optional.
          </Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(x) => String(x.catalog_item_id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item.name ?? `Item #${item.catalog_item_id}`}</Text>
                <Text style={styles.qty}>{item.stock_qty ?? 0}</Text>
              </View>

              <Text style={styles.cardSub}>
                {item.kind ?? "—"} • {item.category ?? "—"}
                {!!item.rx_required ? " • RX" : ""}
              </Text>

              <View style={{ height: 10 }} />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  style={[styles.smallBtn, { flex: 1 }]}
                  onPress={() => bump(item.catalog_item_id, -1)}
                  disabled={busyKey === `${item.catalog_item_id}:-1`}
                >
                  <Text style={styles.smallBtnText}>
                    {busyKey === `${item.catalog_item_id}:-1` ? "…" : "-1"}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.smallBtn, { flex: 1 }]}
                  onPress={() => bump(item.catalog_item_id, +1)}
                  disabled={busyKey === `${item.catalog_item_id}:1`}
                >
                  <Text style={styles.smallBtnText}>
                    {busyKey === `${item.catalog_item_id}:1` ? "…" : "+1"}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.smallBtn, { flex: 1 }]}
                  onPress={() => bump(item.catalog_item_id, +10)}
                  disabled={busyKey === `${item.catalog_item_id}:10`}
                >
                  <Text style={styles.smallBtnText}>
                    {busyKey === `${item.catalog_item_id}:10` ? "…" : "+10"}
                  </Text>
                </Pressable>
              </View>

              <Pressable style={styles.editBtn} onPress={() => openEdit(item)}>
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={{ opacity: 0.7, marginTop: 10 }}>No items in catalog.</Text>}
        />
      )}

      {/* Simple modal */}
      {editOpen && editItem ? (
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editItem.name ?? `Item #${editItem.catalog_item_id}`}</Text>
            <Text style={{ opacity: 0.7, marginTop: 4 }}>Current stock: {editItem.stock_qty ?? 0}</Text>

            <View style={{ height: 12 }} />

            <Text style={{ fontWeight: "900" }}>Set stock to (optional)</Text>
            <TextInput
              value={editSetTo}
              onChangeText={setEditSetTo}
              keyboardType="numeric"
              style={[styles.input, { marginTop: 6 }]}
              placeholder="e.g., 25"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            <View style={{ height: 12 }} />

            <Text style={{ fontWeight: "900" }}>OR adjust by delta</Text>
            <TextInput
              value={editDelta}
              onChangeText={setEditDelta}
              keyboardType="numeric"
              style={[styles.input, { marginTop: 6 }]}
              placeholder="e.g., +10 or -3"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            {isPharmacy ? (
              <>
                <View style={{ height: 12 }} />
                <Text style={{ fontWeight: "900" }}>Batch / Expiry (optional)</Text>
                <TextInput
                  value={batchNo}
                  onChangeText={setBatchNo}
                  style={[styles.input, { marginTop: 6 }]}
                  placeholder="Batch no"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
                <TextInput
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Expiry YYYY-MM-DD"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              </>
            ) : null}

            <View style={{ height: 14 }} />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable style={[styles.smallBtn, { flex: 1 }]} onPress={() => setEditOpen(false)}>
                <Text style={styles.smallBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.smallBtn, { flex: 1 }]} onPress={saveEdit}>
                <Text style={styles.smallBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
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

  pharmacyBox: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

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

  modalWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#111",
  },
  modalTitle: { fontSize: 16, fontWeight: "900" },
});
