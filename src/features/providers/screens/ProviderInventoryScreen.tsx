// src/features/providers/screens/ProviderInventoryScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import type { ProviderRole } from "@/src/features/providers/types";
import { useRouter } from "expo-router";

import { useStoreContext } from "@/src/features/providers/storeContext";
import { StoreCard } from "@/src/features/providers/components/StoreCard";

import { fetchMyStores } from "@/src/features/providers/api";
import { fetchStoreInventory, adjustStoreStock, fetchStoreOffers } from "@/src/features/providers/api";

type StoreRow = {
  id: number;
  display_name: string;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  logo_uri?: string | null;
};

type InventoryRow = {
  offer_id: number | null; // 👈 allow null for “not listed”
  store_id: number;
  product_id: number;
  sku_id: number;

  title: string;
  variant?: string | null;

  stock_qty: number;
  reorder_level: number;

  price: number;
  mrp?: number | null;
  currency: string;

  is_active: boolean;

  // enrich from store/items
  category?: string | null;
  brand?: string | null;
};

function roleBase(role: ProviderRole) {
  switch (role) {
    case "vendor":
      return "/vendor";
    case "pharmacist":
      return "/pharmacist";
    case "hostel":
      return "/hostel";
    case "nutritionist":
      return "/nutritionist";
    default:
      return "/roles";
  }
}

export default function ProviderInventoryScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const base = roleBase(role);

  const { store, setStore } = useStoreContext();

  const [loadingStores, setLoadingStores] = useState(true);
  const [stores, setStores] = useState<StoreRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const [q, setQ] = useState("");

  // ✅ filters
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false); // NEW
  const [onlyListed, setOnlyListed] = useState(false);   // OPTIONAL but useful

  const [rows, setRows] = useState<InventoryRow[]>([]);

  // modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryRow | null>(null);
  const [editSetTo, setEditSetTo] = useState(""); // absolute set
  const [editDelta, setEditDelta] = useState(""); // delta (+/-)

  const selectedStore = useMemo(
    () => stores.find((s) => s.id === store?.store_id) || null,
    [stores, store?.store_id]
  );

  const showStorePicker = stores.length > 1;

  // Load stores
  useEffect(() => {
    (async () => {
      setLoadingStores(true);
      try {
        const s = await fetchMyStores(role);
        setStores(s as any);

        if (!store && s?.length) {
          await setStore({ store_id: s[0].id, display_name: s[0].display_name });
        }
      } catch {
        setStores([]);
      } finally {
        setLoadingStores(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  async function load() {
    if (!store?.store_id) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const storeId = store.store_id;

      const [inv, offers] = await Promise.all([
        fetchStoreInventory(role, storeId).catch(() => []),
        fetchStoreOffers(role, storeId).catch(() => []),
      ]);

      // offers has category/brand/title/variant (sometimes) for this store’s SKUs
      const offerBySku = new Map<number, any>();
      (offers ?? []).forEach((o: any) => {
        const sid = Number(o?.sku_id);
        if (Number.isFinite(sid)) offerBySku.set(sid, o);
      });

      const joined: InventoryRow[] = (inv ?? []).map((x: any) => {
        const o = offerBySku.get(Number(x.sku_id));
        return {
          ...x,
          title: o?.title ?? x.title,
          variant: x.variant ?? o?.variant ?? null,
          category: o?.category ?? null,
          brand: o?.brand ?? null,
          // keep offer_id possibly null
          offer_id: x.offer_id ?? null,
        } as InventoryRow;
      });

      setRows(joined);
    } finally {
      setLoading(false);
    }
  }

  // reload whenever store changes
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.store_id]);

  const storeSubtitle = useMemo(() => {
    if (!selectedStore) return "Pick a store to manage stock.";
    const loc = [selectedStore.city, selectedStore.state, selectedStore.pincode].filter(Boolean).join(" • ");
    return loc || `Store ID: ${selectedStore.id}`;
  }, [selectedStore]);

  // ✅ updated filter logic
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    return rows
      .filter((r) => {
        if (!onlyListed) return true;
        // treat “listed” as having an offer row (offer_id exists) OR being active
        const hasOffer = r.offer_id !== null && r.offer_id !== undefined;
        return hasOffer || r.is_active === true;
      })
      .filter((r) => {
        if (!onlyInStock) return true;
        return Number(r.stock_qty ?? 0) > 0;
      })
      .filter((r) => {
        if (!onlyLowStock) return true;
        const rl = Number(r.reorder_level ?? 0);
        const qty = Number(r.stock_qty ?? 0);
        return rl > 0 && qty <= rl;
      })
      .filter((r) => {
        if (!qq) return true;
        const hay = `${r.title ?? ""} ${r.variant ?? ""} ${r.brand ?? ""} ${r.category ?? ""}`.toLowerCase();
        return hay.includes(qq);
      });
  }, [rows, q, onlyLowStock, onlyInStock, onlyListed]);

  async function bump(sku_id: number, delta: number) {
    if (!store?.store_id) return;

    const key = `${sku_id}:${delta}`;
    setBusyKey(key);
    try {
      await adjustStoreStock(role, { sku_id, delta }, store.store_id);
      await load();
    } finally {
      setBusyKey(null);
    }
  }

  function openEdit(item: InventoryRow) {
    setEditItem(item);
    setEditSetTo("");
    setEditDelta("");
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editItem || !store?.store_id) return;

    const current = Number(editItem.stock_qty ?? 0);

    let delta = 0;
    if (editSetTo.trim() !== "") {
      const target = Number(editSetTo);
      if (!Number.isFinite(target)) return;
      delta = target - current;
    } else if (editDelta.trim() !== "") {
      const d = Number(editDelta);
      if (!Number.isFinite(d)) return;
      delta = d;
    }

    if (delta === 0) {
      setEditOpen(false);
      return;
    }

    await bump(editItem.sku_id, delta);
    setEditOpen(false);
  }

  function goCatalog() {
    router.push(`${base}/catalog` as any);
  }

  // helpful summary line
  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (onlyListed) parts.push("Listed");
    if (onlyInStock) parts.push("In stock");
    if (onlyLowStock) parts.push("Low stock");
    return parts.length ? `Filters: ${parts.join(" • ")}` : "Filters: None";
  }, [onlyListed, onlyInStock, onlyLowStock]);

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Inventory</Text>
      <Text style={styles.sub}>Stock is per store (current model)</Text>

      {/* Store context */}
      <View style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Store context</Text>
        <Text style={styles.sectionHint}>Select the store you’re updating right now.</Text>

        {loadingStores ? (
          <Text style={{ opacity: 0.7, marginTop: 8 }}>Loading stores…</Text>
        ) : stores.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={{ fontWeight: "900" }}>No store yet</Text>
            <Text style={{ opacity: 0.7, marginTop: 6 }}>
              Create your first store from Home → “+ Add Store”.
            </Text>
          </View>
        ) : (
          <>
            <StoreCard
              title={store?.display_name || "Select a store"}
              subtitle={storeSubtitle}
              imageUri={(selectedStore as any)?.logo_uri ?? null}
              rightBadge={"Inventory"}
              selected={!!store?.store_id}
              onPress={() => {}}
            />

            {showStorePicker ? (
              <View style={styles.chipsRow}>
                {stores.map((s) => {
                  const active = store?.store_id === s.id;
                  const sub = [s.city, s.state, s.pincode].filter(Boolean).join(" • ");
                  return (
                    <Pressable
                      key={s.id}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setStore({ store_id: s.id, display_name: s.display_name })}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                        {s.display_name}
                      </Text>
                      {!!sub && (
                        <Text style={[styles.chipSub, active && styles.chipSubActive]} numberOfLines={1}>
                          {sub}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search inventory…"
          placeholderTextColor="rgba(0,0,0,0.35)"
          style={styles.searchInput}
        />
        <Pressable style={styles.refreshBtn} onPress={load}>
          <Text style={styles.refreshBtnText}>↻</Text>
        </Pressable>
      </View>

      {/* ✅ Low stock */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={{ fontWeight: "900" }}>Low stock only</Text>
          <Text style={{ marginTop: 4, opacity: 0.65, fontWeight: "700", fontSize: 12 }}>
            Shows items where stock ≤ reorder level
          </Text>
        </View>
        <Switch value={onlyLowStock} onValueChange={setOnlyLowStock} />
      </View>

      {/* ✅ NEW: In stock */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={{ fontWeight: "900" }}>In stock only</Text>
          <Text style={{ marginTop: 4, opacity: 0.65, fontWeight: "700", fontSize: 12 }}>
            Shows items where stock &gt; 0
          </Text>
        </View>
        <Switch value={onlyInStock} onValueChange={setOnlyInStock} />
      </View>

      {/* ✅ OPTIONAL: Listed */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={{ fontWeight: "900" }}>Listed only</Text>
          <Text style={{ marginTop: 4, opacity: 0.65, fontWeight: "700", fontSize: 12 }}>
            Shows items that exist in store listings (offer created)
          </Text>
        </View>
        <Switch value={onlyListed} onValueChange={setOnlyListed} />
      </View>

      {/* summary */}
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontWeight: "800", opacity: 0.75 }}>
          {filterSummary} • Showing {filtered.length} of {rows.length}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(x) => String(x.sku_id)}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 12 }}
          renderItem={({ item }) => {
            const low =
              Number(item.reorder_level ?? 0) > 0 &&
              Number(item.stock_qty ?? 0) <= Number(item.reorder_level ?? 0);

            return (
              <View style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={[styles.qty, low && { color: "tomato" }]}>{item.stock_qty ?? 0}</Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
                  {!!item.category && <Text style={styles.catPill}>{item.category}</Text>}
                  {!!item.brand && <Text style={styles.muted}>{item.brand}</Text>}
                  {!!item.variant && <Text style={styles.muted}>• {item.variant}</Text>}
                </View>

                <Text style={[styles.muted, { marginTop: 8 }]}>
                  SKU #{item.sku_id} • Reorder: {item.reorder_level ?? 0} • Active:{" "}
                  {item.is_active ? "Yes" : "No"}
                </Text>

                <View style={{ height: 10 }} />

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    style={[styles.smallBtn, { flex: 1 }]}
                    onPress={() => bump(item.sku_id, -1)}
                    disabled={busyKey === `${item.sku_id}:-1`}
                  >
                    <Text style={styles.smallBtnText}>{busyKey === `${item.sku_id}:-1` ? "…" : "-1"}</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.smallBtn, { flex: 1 }]}
                    onPress={() => bump(item.sku_id, +1)}
                    disabled={busyKey === `${item.sku_id}:1`}
                  >
                    <Text style={styles.smallBtnText}>{busyKey === `${item.sku_id}:1` ? "…" : "+1"}</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.smallBtn, { flex: 1 }]}
                    onPress={() => bump(item.sku_id, +10)}
                    disabled={busyKey === `${item.sku_id}:10`}
                  >
                    <Text style={styles.smallBtnText}>{busyKey === `${item.sku_id}:10` ? "…" : "+10"}</Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <Pressable style={[styles.primaryBtn, { flex: 1 }]} onPress={() => openEdit(item)}>
                    <Text style={styles.primaryBtnText}>Edit</Text>
                  </Pressable>
                  <Pressable style={[styles.secondaryBtn, { flex: 1 }]} onPress={goCatalog}>
                    <Text style={styles.secondaryBtnText}>Catalog</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{ marginTop: 14 }}>
              <Text style={{ opacity: 0.8, fontWeight: "800" }}>
                {store?.store_id ? "No inventory items match your filters." : "Select a store to view inventory."}
              </Text>
              {store?.store_id ? (
                <Text style={{ marginTop: 6, opacity: 0.7 }}>
                  Try turning off filters like “In stock only” or “Listed only”.
                </Text>
              ) : null}
            </View>
          }
        />
      )}

      {/* Modal */}
      {editOpen && editItem ? (
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} numberOfLines={2}>
              {editItem.title}
            </Text>
            <Text style={{ opacity: 0.7, marginTop: 6 }}>Current stock: {editItem.stock_qty ?? 0}</Text>

            <View style={{ height: 14 }} />

            <Text style={{ fontWeight: "900" }}>Set stock to</Text>
            <TextInput
              value={editSetTo}
              onChangeText={setEditSetTo}
              keyboardType="numeric"
              style={[styles.input, { marginTop: 8 }]}
              placeholder="e.g. 25"
              placeholderTextColor="rgba(0,0,0,0.35)"
            />

            <View style={{ height: 12 }} />

            <Text style={{ fontWeight: "900" }}>OR adjust by delta</Text>
            <TextInput
              value={editDelta}
              onChangeText={setEditDelta}
              keyboardType="numeric"
              style={[styles.input, { marginTop: 8 }]}
              placeholder="e.g. +10 or -3"
              placeholderTextColor="rgba(0,0,0,0.35)"
            />

            <View style={{ height: 14 }} />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable style={[styles.secondaryBtn, { flex: 1 }]} onPress={() => setEditOpen(false)}>
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.primaryBtn, { flex: 1 }]} onPress={saveEdit}>
                <Text style={styles.primaryBtnText}>Save</Text>
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

  h1: { fontSize: 22, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.75, fontWeight: "700" },

  sectionTitle: { fontWeight: "900", opacity: 0.9, fontSize: 13 },
  sectionHint: { marginTop: 4, opacity: 0.65, fontWeight: "700", fontSize: 12 },

  emptyBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
  },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  chip: {
    minWidth: 160,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  chipActive: { borderColor: "rgba(59,130,246,0.35)", backgroundColor: "rgba(59,130,246,0.06)" },
  chipText: { fontWeight: "900", opacity: 0.88 },
  chipTextActive: { opacity: 1 },
  chipSub: { marginTop: 4, fontSize: 11, opacity: 0.65, fontWeight: "700" },
  chipSubActive: { opacity: 0.75 },

  filterRow: { flexDirection: "row", gap: 10, marginTop: 12, marginBottom: 8 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  refreshBtn: {
    width: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  refreshBtnText: { fontWeight: "900", fontSize: 16 },

  toggleRow: {
    marginTop: 6,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 16 },

  card: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  cardTitle: { fontWeight: "900", fontSize: 16, flex: 1, paddingRight: 8 },
  qty: { fontWeight: "900", fontSize: 18 },

  muted: { marginTop: 0, opacity: 0.78, fontWeight: "700" },

  catPill: {
    fontWeight: "900",
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignSelf: "flex-start",
  },

  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },

  secondaryBtn: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  secondaryBtnText: { textAlign: "center", fontWeight: "900", opacity: 0.9 },

  smallBtn: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  smallBtnText: { textAlign: "center", fontWeight: "900" },

  modalWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.98)",
  },
  modalTitle: { fontSize: 16, fontWeight: "900" },

  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.98)",
  },
});
