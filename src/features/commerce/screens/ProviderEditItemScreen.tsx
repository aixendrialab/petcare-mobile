import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Switch } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ProviderRole } from "@/src/features/providers/types";
import { fetchProviderCatalog, upsertCatalogItem } from "../api";

type OfferRow = {
  offer_id: number;
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
  eta_text?: string | null;
  shipping_fee?: number | null;
};

export default function ProviderEditCatalogItemScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const mode = String(params.mode ?? "edit") as "create" | "edit";
  const offer_id = params.offer_id ? Number(params.offer_id) : null;

  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);

  const [offer, setOffer] = useState<OfferRow | null>(null);

  const [price, setPrice] = useState("0");
  const [mrp, setMrp] = useState("");
  const [stockQty, setStockQty] = useState("0");
  const [reorderLevel, setReorderLevel] = useState("0");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (mode !== "edit" || !offer_id) return;

    async function load() {
      setLoading(true);
      try {
        const all = (await fetchProviderCatalog(role)) as OfferRow[];
        const found = all.find((x) => Number(x.offer_id) === offer_id) ?? null;
        setOffer(found);

        if (found) {
          setPrice(String(found.price ?? 0));
          setMrp(found.mrp != null ? String(found.mrp) : "");
          setStockQty(String(found.stock_qty ?? 0));
          setReorderLevel(String(found.reorder_level ?? 0));
          setActive(!!found.is_active);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mode, offer_id, role]);

  const title = useMemo(() => {
    if (mode === "create") return "Add Offer";
    return offer?.title ? `Edit: ${offer.title}` : "Edit Offer";
  }, [mode, offer?.title]);

  async function save() {
    if (mode === "edit" && !offer_id) return;

    const p = Number(price);
    const m = mrp.trim() === "" ? null : Number(mrp);
    const sq = Number(stockQty);
    const rl = Number(reorderLevel);

    if (!Number.isFinite(p) || p < 0) return;
    if (m != null && (!Number.isFinite(m) || m < 0)) return;
    if (!Number.isFinite(sq) || sq < 0) return;
    if (!Number.isFinite(rl) || rl < 0) return;

    setBusy(true);
    try {
      if (mode === "create") {
        // v2: creating an offer requires sku_id; UI flow not built yet.
        // Keep as no-op or show message. For now we block.
        alert("Create offer flow needs SKU selection. Please edit existing offers for now.");
        return;
      }

      await upsertCatalogItem(role, {
        offer_id,
        price: p,
        mrp: m,
        stock_qty: sq,
        reorder_level: rl,
        is_active: active,
      });

      const back = role === "pharmacist" ? "/pharmacist/catalog" : "/vendor/catalog";
      router.replace(back as any);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.sub}>Role: {role}</Text>

      {offer ? (
        <Text style={{ marginTop: 10, opacity: 0.75 }}>
          {offer.brand ? `${offer.brand} • ` : ""}
          {offer.category} • SKU {offer.sku_id}
        </Text>
      ) : null}

      <View style={{ height: 14 }} />

      <Text style={styles.label}>Price (₹)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <Text style={styles.label}>MRP (₹) (optional)</Text>
      <TextInput
        value={mrp}
        onChangeText={setMrp}
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g., 1299"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <Text style={styles.label}>Stock qty</Text>
      <TextInput
        value={stockQty}
        onChangeText={setStockQty}
        style={styles.input}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <Text style={styles.label}>Reorder level</Text>
      <TextInput
        value={reorderLevel}
        onChangeText={setReorderLevel}
        style={styles.input}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Active</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      <View style={{ flex: 1 }} />

      <Pressable style={styles.primaryBtn} onPress={save} disabled={busy}>
        <Text style={styles.primaryBtnText}>{busy ? "Saving…" : "Save"}</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
        <Text style={styles.secondaryBtnText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 18, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7 },

  label: { marginTop: 10, marginBottom: 6, opacity: 0.8, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  switchLabel: { fontWeight: "800", opacity: 0.9 },

  primaryBtn: { marginTop: 16, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800", opacity: 0.9 },
});
