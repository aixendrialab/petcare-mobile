import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchMyStores, fetchMyCatalogProducts, fetchStoreOffers } from "@/src/features/providers/api";
import { useStoreContext } from "@/src/features/providers/storeContext";

type TabKey = "products" | "offers";

export default function VendorCatalogScreen() {
  const router = useRouter();
  const { store, setStore } = useStoreContext();

  const [tab, setTab] = useState<TabKey>("products");
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    fetchMyStores("vendor").then(setStores).catch(() => setStores([]));
  }, []);

  useEffect(() => {
    if (tab === "products") {
      fetchMyCatalogProducts().then(setProducts).catch(() => setProducts([]));
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== "offers") return;
    if (!store?.store_id) return;
    fetchStoreOffers("vendor", store.store_id).then(setOffers).catch(() => setOffers([]));
  }, [tab, store?.store_id]);

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Catalog</Text>
      <Text style={styles.sub}>Manage products and list them in stores</Text>

      <StoreChips stores={stores} selected={store?.store_id ?? null} onPick={(s) => setStore(s)} />

      <View style={styles.tabs}>
        <Tab label="My Products" active={tab === "products"} onPress={() => setTab("products")} />
        <Tab label="Store Listings" active={tab === "offers"} onPress={() => setTab("offers")} />
      </View>

      {tab === "products" ? (
        <>
          <Pressable style={styles.primaryBtn} onPress={() => router.push("/vendor/catalog/product/new" as any)}>
            <Text style={styles.primaryBtnText}>+ New Product</Text>
          </Pressable>

          <FlatList
            data={products}
            keyExtractor={(x) => String(x.product_id)}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => router.push({ pathname: "/vendor/catalog/product/[id]" as any, params: { id: String(item.product_id) } })}
              >
                <Text style={{ fontWeight: "900" }}>{item.title}</Text>
                <Text style={{ opacity: 0.7, marginTop: 4 }}>{item.category} • {item.brand ?? "—"}</Text>
              </Pressable>
            )}
          />
        </>
      ) : (
        <>
          {!store ? (
            <View style={styles.empty}>
              <Text style={{ opacity: 0.8 }}>Select a store to view its listings.</Text>
            </View>
          ) : (
            <>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => router.push({ pathname: "/vendor/catalog/add-to-store" as any, params: { store_id: String(store.store_id) } })}
              >
                <Text style={styles.primaryBtnText}>+ Add product to {store.display_name}</Text>
              </Pressable>

              <FlatList
                data={offers}
                keyExtractor={(x) => String(x.offer_id)}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.card}
                    onPress={() => router.push({ pathname: "/vendor/catalog/offer/[id]" as any, params: { id: String(item.offer_id) } })}
                  >
                    <Text style={{ fontWeight: "900" }}>{item.title}</Text>
                    <Text style={{ opacity: 0.7, marginTop: 4 }}>
                      SKU {item.sku_id} • ₹ {item.price} • Stock {item.stock_qty}
                    </Text>
                  </Pressable>
                )}
              />
            </>
          )}
        </>
      )}
    </View>
  );
}

function StoreChips({ stores, selected, onPick }: any) {
  return (
    <View style={styles.chips}>
      {stores.map((s: any) => {
        const active = selected === s.id;
        return (
          <Pressable
            key={s.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onPick({ store_id: s.id, display_name: s.display_name })}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.display_name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Tab({ label, active, onPress }: any) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7 },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  chipActive: { backgroundColor: "rgba(255,255,255,0.12)" },
  chipText: { fontWeight: "800", opacity: 0.8 },
  chipTextActive: { opacity: 1 },

  tabs: { flexDirection: "row", gap: 10, marginTop: 12, marginBottom: 10 },
  tab: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  tabActive: { backgroundColor: "rgba(255,255,255,0.10)" },
  tabText: { textAlign: "center", fontWeight: "900", opacity: 0.75 },
  tabTextActive: { opacity: 1 },

  primaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },

  card: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  empty: { marginTop: 20, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
});
