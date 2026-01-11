// src/features/providers/screens/ProviderCatalogScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import type { ProviderRole } from "@/src/features/providers/types";

import { useStoreContext } from "@/src/features/providers/storeContext";
import { StoreCard } from "@/src/features/providers/components/StoreCard";

import { fetchMyCatalogProducts, fetchMyStores } from "@/src/features/providers/api";
import { fetchStoreOffers } from "@/src/features/providers/api";

type TabKey = "products" | "offers";

type StoreRow = {
  id: number;
  display_name: string;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  logo_uri?: string | null;
};

type ProductRow = {
  product_id: number;
  category: string;
  title: string;
  brand?: string | null;
  primary_image?: string | null;
  is_active?: boolean;
};

type OfferRow = {
  offer_id: number;
  store_id: number;
  product_id: number;
  sku_id: number;
  category: string;
  title: string;
  brand?: string | null;
  price: number;
  mrp?: number | null;
  discount_pct?: number | null;
  stock_qty: number;
  reorder_level: number;
  currency: string;
  is_active: boolean;
};

const CATEGORY_CHOICES = ["MEDICINE", "FOOD", "ACCESSORY", "SERVICE"] as const;

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

function SegTabs({
  value,
  onChange,
}: {
  value: TabKey;
  onChange: (v: TabKey) => void;
}) {
  return (
    <View style={segStyles.wrap}>
      <Pressable style={[segStyles.tab, value === "products" && segStyles.active]} onPress={() => onChange("products")}>
        <Text style={[segStyles.txt, value === "products" && segStyles.txtActive]}>My products</Text>
        <Text style={[segStyles.hint, value === "products" && segStyles.hintActive]}>Master details</Text>
      </Pressable>

      <Pressable style={[segStyles.tab, value === "offers" && segStyles.active]} onPress={() => onChange("offers")}>
        <Text style={[segStyles.txt, value === "offers" && segStyles.txtActive]}>Store listings</Text>
        <Text style={[segStyles.hint, value === "offers" && segStyles.hintActive]}>Price • stock</Text>
      </Pressable>
    </View>
  );
}

const segStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginTop: 14,
    marginBottom: 10,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: "center" },
  active: { backgroundColor: "rgba(255,255,255,0.96)", borderWidth: 1, borderColor: "rgba(0,0,0,0.10)" },
  txt: { fontWeight: "900", opacity: 0.70 },
  txtActive: { opacity: 1 },
  hint: { marginTop: 2, fontSize: 11, fontWeight: "800", opacity: 0.45 },
  hintActive: { opacity: 0.65 },
});

export default function ProviderCatalogScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const base = roleBase(role);

  const { store, setStore } = useStoreContext();

  // ✅ default to PRODUCTS (your ask)
  const [tab, setTab] = useState<TabKey>("products");

  const [loadingStores, setLoadingStores] = useState(true);
  const [stores, setStores] = useState<StoreRow[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);

  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offers, setOffers] = useState<OfferRow[]>([]);

  const [q, setQ] = useState("");
  const [filterCat, setFilterCat] = useState<string>("");

  const selectedStore = useMemo(
    () => stores.find((s) => s.id === store?.store_id) || null,
    [stores, store?.store_id]
  );

  const storeSubtitle = useMemo(() => {
    if (!selectedStore) return "Pick a store to manage listings / inventory.";
    const loc = [selectedStore.city, selectedStore.state, selectedStore.pincode].filter(Boolean).join(" • ");
    return loc || `Store ID: ${selectedStore.id}`;
  }, [selectedStore]);

  // Stores (for store context)
  useEffect(() => {
    (async () => {
      setLoadingStores(true);
      try {
        const s = await fetchMyStores(role);
        setStores(s as any);

        // auto select first store if not selected
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

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const data = await fetchMyCatalogProducts(role, {
        q: q || undefined,
        category: filterCat || undefined,
      });
      setProducts((data ?? []) as any);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadOffers() {
    setLoadingOffers(true);
    try {
      if (!store?.store_id) {
        setOffers([]);
        return;
      }
      const data = await fetchStoreOffers(role, store.store_id);
      setOffers((data ?? []) as any);
    } catch {
      setOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  }

  // refresh when tab changes
  useEffect(() => {
    if (tab === "products") loadProducts();
    else loadOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, store?.store_id]);

  // debounced search on products tab
  useEffect(() => {
    if (tab !== "products") return;
    const t = setTimeout(() => loadProducts(), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, filterCat, tab]);

  const filteredOffers = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return offers
      .filter((x) => (filterCat ? String(x.category) === filterCat : true))
      .filter((x) => {
        if (!qq) return true;
        const hay = `${x.title ?? ""} ${x.brand ?? ""}`.toLowerCase();
        return hay.includes(qq);
      });
  }, [offers, q, filterCat]);

  const offersByProduct = useMemo(() => {
    const m = new Map<number, OfferRow[]>();
    for (const o of offers) {
      const pid = Number(o.product_id);
      if (!Number.isFinite(pid)) continue;
      if (!m.has(pid)) m.set(pid, []);
      m.get(pid)!.push(o);
    }
    return m;
  }, [offers]);

  function goNewProduct() {
    router.push(`${base}/catalog/product/new` as any);
  }

  function openProduct(product_id: number) {
    router.push({
      pathname: `${base}/catalog/product/[id]` as any,
      params: { id: String(product_id), store_id: store?.store_id ? String(store.store_id) : undefined },
    } as any);
  }

  function openInventory() {
    router.push(`${base}/inventory` as any);
  }

  const showStorePicker = stores.length > 1;

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Catalog</Text>
      <Text style={styles.sub}>Manage products and store-specific listings</Text>

      {/* Store context */}
      <View style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Store context</Text>
        <Text style={styles.sectionHint}>This affects listings and inventory.</Text>

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
              rightBadge={tab === "offers" ? "Listings" : "Products"}
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
                      {!!sub && <Text style={[styles.chipSub, active && styles.chipSubActive]} numberOfLines={1}>{sub}</Text>}
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </>
        )}
      </View>

      {/* Tabs */}
      <SegTabs value={tab} onChange={setTab} />

      {/* Search + category */}
      <View style={styles.filterRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={tab === "offers" ? "Search listings (title/brand)…" : "Search my products…"}
          placeholderTextColor="rgba(0,0,0,0.35)"
          style={styles.searchInput}
        />
        <Pressable
          style={styles.pill}
          onPress={() => {
            const idx = CATEGORY_CHOICES.indexOf(filterCat as any);
            const next = idx === -1 ? CATEGORY_CHOICES[0] : CATEGORY_CHOICES[(idx + 1) % CATEGORY_CHOICES.length];
            setFilterCat(next);
          }}
          onLongPress={() => setFilterCat("")}
        >
          <Text style={styles.pillText}>{filterCat || "All"}</Text>
        </Pressable>
      </View>

      {/* CTA row */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
        {tab === "products" ? (
          <Pressable style={[styles.primaryBtn, { flex: 1 }]} onPress={goNewProduct}>
            <Text style={styles.primaryBtnText}>+ New product</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.primaryBtn, { flex: 1 }]} onPress={openInventory}>
            <Text style={styles.primaryBtnText}>Open inventory</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.secondaryBtn, { flex: 1 }]}
          onPress={() => (tab === "offers" ? loadOffers() : loadProducts())}
        >
          <Text style={styles.secondaryBtnText}>Refresh</Text>
        </Pressable>
      </View>

      {/* Content */}
      {tab === "products" ? (
        loadingProducts ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading products…</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(x) => String(x.product_id)}
            contentContainerStyle={{ paddingBottom: 24, paddingTop: 12 }}
            renderItem={({ item }) => {
              const listedCount = offersByProduct.get(item.product_id)?.length ?? 0;
              const listedLabel = store?.store_id
                ? (listedCount > 0 ? `Listed in this store (${listedCount})` : "Not listed in this store")
                : "Pick a store to list";

              return (
                <View style={styles.card}>
                  <Pressable onPress={() => openProduct(item.product_id)}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                      <Text style={styles.catPill}>{item.category}</Text>
                    </View>

                    <Text style={styles.muted}>{item.brand ?? "—"}</Text>
                    <Text style={[styles.muted, { marginTop: 6 }]}>{listedLabel}</Text>
                  </Pressable>

                  <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                    <Pressable style={[styles.smallBtn, { flex: 1 }]} onPress={() => openProduct(item.product_id)}>
                      <Text style={styles.smallBtnText}>Edit details</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.smallBtn, { flex: 1, opacity: store?.store_id ? 1 : 0.5 }]}
                      disabled={!store?.store_id}
                      onPress={() =>
                        router.push({
                          pathname: `${base}/catalog/product/[id]` as any,
                          params: { id: String(item.product_id), store_id: String(store!.store_id) },
                        } as any)
                      }
                    >
                      <Text style={styles.smallBtnText}>List in store</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={{ opacity: 0.7, marginTop: 14 }}>
                No products yet. Tap “New product”.
              </Text>
            }
          />
        )
      ) : (
        loadingOffers ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading listings…</Text>
          </View>
        ) : (
          <FlatList
            data={filteredOffers}
            keyExtractor={(x) => String(x.offer_id)}
            contentContainerStyle={{ paddingBottom: 24, paddingTop: 12 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.price}>₹ {item.price}</Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <Text style={styles.catPill}>{item.category}</Text>
                  {!!item.brand && <Text style={styles.muted} numberOfLines={1}>{item.brand}</Text>}
                </View>

                <View style={[styles.rowBetween, { marginTop: 10 }]}>
                  <Text style={styles.badge}>SKU {item.sku_id} • {item.is_active ? "ACTIVE" : "INACTIVE"}</Text>
                  <Text style={styles.stock}>Stock: {item.stock_qty}</Text>
                </View>

                <Text style={[styles.muted, { marginTop: 8 }]}>Reorder: {item.reorder_level}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ opacity: 0.7, marginTop: 14 }}>
                {store?.store_id
                  ? "No listings for this store yet. Open a product → “Store listing” section → create listing."
                  : "Select a store to view listings."}
              </Text>
            }
          />
        )
      )}
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

  filterRow: { flexDirection: "row", gap: 10, marginTop: 6, marginBottom: 8 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  pill: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 999,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  pillText: { fontWeight: "900", opacity: 0.85 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 16 },

  card: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  cardTitle: { fontWeight: "900", fontSize: 16, flex: 1, paddingRight: 8 },

  muted: { marginTop: 6, opacity: 0.75, fontWeight: "700" },

  badge: { opacity: 0.75, fontWeight: "800" },
  price: { fontWeight: "900" },
  stock: { fontWeight: "900", opacity: 0.85 },

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
});
