import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView, Switch } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ProviderRole } from "@/src/features/providers/types";
import { createCatalogProduct } from "@/src/features/providers/api";
import { useStoreContext } from "@/src/features/providers/storeContext";

type CatalogCategory = "FOOD" | "ACCESSORY" | "MEDICINE" | "SERVICE";

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

function defaultCategory(role: ProviderRole): CatalogCategory {
  if (role === "pharmacist") return "MEDICINE";
  if (role === "hostel") return "SERVICE";
  if (role === "nutritionist") return "SERVICE";
  return "FOOD";
}

export default function ProviderProductNewScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const params = useLocalSearchParams<{ store_id?: string }>();
  const base = useMemo(() => roleBase(role), [role]);

  const { store } = useStoreContext();
  const storeIdFromParams = params.store_id ? Number(params.store_id) : undefined;

  const [busy, setBusy] = useState(false);

  const [category, setCategory] = useState<CatalogCategory>(() => defaultCategory(role));
  const [title, setTitle] = useState("");
  const [brandText, setBrandText] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [variantTheme, setVariantTheme] = useState("");

  const [prescriptionRequired, setPrescriptionRequired] = useState(role === "pharmacist");

  const canSave = title.trim().length >= 3;

  function cycleCategory() {
    const arr: CatalogCategory[] = ["FOOD", "ACCESSORY", "MEDICINE", "SERVICE"];
    const idx = arr.indexOf(category);
    setCategory(arr[(idx + 1) % arr.length]);
  }

  async function save() {
    if (!canSave) return;
    setBusy(true);
    try {
      const payload = {
        category,
        title: title.trim(),
        brand_text: brandText.trim() || null,
        short_desc: shortDesc.trim() || null,
        description: description.trim() || null,
        prescription_required: !!prescriptionRequired,
        variant_theme: variantTheme.trim() || null,
        is_active: true,
      };

      const res = await createCatalogProduct(role, payload);
      const product_id = Number(res?.product_id);
      if (!product_id) throw new Error("Missing product_id from server");

      router.replace({
        pathname: `${base}/catalog/product/[id]` as any,
        params: {
          id: String(product_id),
          store_id: storeIdFromParams ? String(storeIdFromParams) : (store?.store_id ? String(store.store_id) : undefined),
        },
      } as any);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.h1}>New Product</Text>
      <Text style={styles.sub}>Role: {role}</Text>

      <Text style={styles.label}>Category</Text>
      <Pressable style={styles.pill} onPress={cycleCategory}>
        <Text style={styles.pillText}>{category} (tap to change)</Text>
      </Pressable>

      <Text style={styles.label}>Title *</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="e.g., Pedigree Adult Dog Food 3kg"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <Text style={styles.label}>Brand (optional)</Text>
      <TextInput
        value={brandText}
        onChangeText={setBrandText}
        style={styles.input}
        placeholder="e.g., Pedigree"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <Text style={styles.label}>Short description (optional)</Text>
      <TextInput
        value={shortDesc}
        onChangeText={setShortDesc}
        style={styles.input}
        placeholder="One-line summary"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 120 }]}
        multiline
        placeholder="Detailed description…"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      <Text style={styles.label}>Variant theme (optional)</Text>
      <TextInput
        value={variantTheme}
        onChangeText={setVariantTheme}
        style={styles.input}
        placeholder="e.g., Size / Flavor / Color"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />

      {role === "pharmacist" ? (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Prescription required</Text>
          <Switch value={prescriptionRequired} onValueChange={setPrescriptionRequired} />
        </View>
      ) : null}

      <View style={styles.infoBox}>
        <Text style={{ fontWeight: "900" }}>Next</Text>
        <Text style={{ opacity: 0.75, marginTop: 6 }}>
          After saving, you can add SKUs (variants), images, specs and tags.
        </Text>
      </View>

      <Pressable
        style={[styles.primaryBtn, (!canSave || busy) && { opacity: 0.6 }]}
        onPress={save}
        disabled={!canSave || busy}
      >
        {busy ? <ActivityIndicator /> : <Text style={styles.primaryBtnText}>Save & Continue</Text>}
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
        <Text style={styles.secondaryBtnText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7 },

  label: { marginTop: 12, marginBottom: 6, opacity: 0.85, fontWeight: "800" },
  input: {
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
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  pillText: { fontWeight: "900", opacity: 0.9 },

  switchRow: { marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  switchLabel: { fontWeight: "800", opacity: 0.9 },

  infoBox: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
  },

  primaryBtn: { marginTop: 14, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center" },
  primaryBtnText: { fontWeight: "900" },

  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800", opacity: 0.9 },
});
