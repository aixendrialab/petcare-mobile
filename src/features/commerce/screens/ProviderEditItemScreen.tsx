import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Switch } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ProviderRole } from "@/src/features/providers/types";
import type { CatalogItem, CatalogCategory, CatalogKind } from "../types";
import { fetchProviderCatalog, upsertCatalogItem } from "../api";

const CATEGORY_CHOICES: CatalogCategory[] = ["MEDICINE", "FOOD", "ACCESSORY", "BOARDING", "DIET_PLAN"];
const KIND_CHOICES: CatalogKind[] = ["PRODUCT", "SERVICE"];

export default function ProviderEditCatalogItemScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = String(params.mode ?? "create") as "create" | "edit";
  const id = params.id ? Number(params.id) : null;

  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [kind, setKind] = useState<CatalogKind>("PRODUCT");
  const [category, setCategory] = useState<CatalogCategory>("ACCESSORY");
  const [active, setActive] = useState(true);
  const [rxRequired, setRxRequired] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !id) return;

    async function load() {
      setLoading(true);
      try {
        const all = await fetchProviderCatalog(role);
        const item = all.find((x) => x.id === id);
        if (item) {
          setName(item.name ?? "");
          setDescription(item.description ?? "");
          setPrice(String(item.price ?? 0));
          setKind(item.kind);
          setCategory(item.category);
          setActive(!!item.active);
          setRxRequired(!!item.rx_required);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mode, id, role]);

  const canRx = useMemo(() => kind === "PRODUCT" && category === "MEDICINE", [kind, category]);

  useEffect(() => {
    if (!canRx) setRxRequired(false);
  }, [canRx]);

  function cycleKind() {
    const idx = KIND_CHOICES.indexOf(kind);
    setKind(KIND_CHOICES[(idx + 1) % KIND_CHOICES.length]);
  }

  function cycleCategory() {
    const idx = CATEGORY_CHOICES.indexOf(category);
    setCategory(CATEGORY_CHOICES[(idx + 1) % CATEGORY_CHOICES.length]);
  }

  async function save() {
    const p = Number(price);
    if (!name.trim()) return;

    setBusy(true);
    try {
      const payload: Partial<CatalogItem> = {
        id: id ?? undefined,
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number.isFinite(p) ? p : 0,
        kind,
        category,
        active,
        rx_required: canRx ? rxRequired : false,
      };

      await upsertCatalogItem(role, payload);

      // back to catalog
      const back = role === "pharmacy" ? "/pharmacist/catalog" : "/vendor/catalog";
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
      <Text style={styles.h1}>{mode === "edit" ? "Edit Item" : "Add Item"}</Text>
      <Text style={styles.sub}>Role: {role}</Text>

      <View style={{ height: 14 }} />

      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Item name" placeholderTextColor="rgba(255,255,255,0.5)" />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 90 }]}
        multiline
        placeholder="Short description"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <Text style={styles.label}>Price (₹)</Text>
      <TextInput value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" placeholder="0" placeholderTextColor="rgba(255,255,255,0.5)" />

      <View style={styles.rowBetween}>
        <Pressable style={styles.pill} onPress={cycleKind}>
          <Text style={styles.pillText}>Kind: {kind}</Text>
        </Pressable>
        <Pressable style={styles.pill} onPress={cycleCategory}>
          <Text style={styles.pillText}>Category: {category}</Text>
        </Pressable>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Active</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      {canRx ? (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Prescription required</Text>
          <Switch value={rxRequired} onValueChange={setRxRequired} />
        </View>
      ) : null}

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
  h1: { fontSize: 20, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7 },

  label: { marginTop: 10, marginBottom: 6, opacity: 0.8, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 12 },
  pill: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pillText: { textAlign: "center", fontWeight: "800" },

  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  switchLabel: { fontWeight: "800", opacity: 0.9 },

  primaryBtn: { marginTop: 16, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800", opacity: 0.9 },
});
