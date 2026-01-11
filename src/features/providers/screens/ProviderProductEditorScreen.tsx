import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView, Switch } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ProviderRole } from "@/src/features/providers/types";
import { useStoreContext } from "@/src/features/providers/storeContext";

import {
  fetchCatalogProduct,
  updateCatalogProduct,
  createCatalogSku,
  addCatalogMedia,
  deleteCatalogMedia,
  replaceCatalogSpecs,
  replaceCatalogTags,
} from "@/src/features/providers/api";

type CatalogCategory = "FOOD" | "ACCESSORY" | "MEDICINE" | "SERVICE";
type Product = any;

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

function firstParam(v?: string | string[]) {
  return Array.isArray(v) ? v[0] : v;
}

function parseProductId(raw?: string | string[]) {
  const s = firstParam(raw);
  if (!s) return NaN;
  const head = String(s).split(":")[0]; // tolerate "5006:store_id=1001"
  const n = parseInt(head, 10);
  return Number.isFinite(n) ? n : NaN;
}

function errToText(e: any) {
  const status = e?.response?.status;
  const data = e?.response?.data;
  const msg = e?.message || String(e);
  if (status) return `HTTP ${status} - ${msg}\n${typeof data === "string" ? data : JSON.stringify(data)}`;
  return msg;
}

function Chip({ text, onPress }: { text: string; onPress?: () => void }) {
  return (
    <Pressable style={[styles.chip, onPress ? styles.chipPressable : null]} onPress={onPress}>
      <Text style={styles.chipText}>{text}</Text>
    </Pressable>
  );
}

function Row({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <View style={styles.rowBetween}>
      <View style={{ flex: 1 }}>{left}</View>
      {!!right && <View style={{ marginLeft: 12 }}>{right}</View>}
    </View>
  );
}

export default function ProviderProductEditorScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[]; store_id?: string | string[] }>();
  const base = useMemo(() => roleBase(role), [role]);

  const productId = useMemo(() => parseProductId(params.id), [params.id]);

  const { store } = useStoreContext();
  const storeIdFromUrl = useMemo(() => {
    const s = firstParam(params.store_id);
    if (!s) return undefined;
    const n = parseInt(String(s), 10);
    return Number.isFinite(n) ? n : undefined;
  }, [params.store_id]);

  const effectiveStoreId = storeIdFromUrl ?? store?.store_id;

  const [loading, setLoading] = useState(true);

  // separate busy flags so one action doesn't lock the entire screen unnecessarily
  const [busyCore, setBusyCore] = useState(false);
  const [busySku, setBusySku] = useState(false);
  const [busyMedia, setBusyMedia] = useState(false);
  const [busySpecs, setBusySpecs] = useState(false);
  const [busyTags, setBusyTags] = useState(false);

  const busyAny = busyCore || busySku || busyMedia || busySpecs || busyTags;

  const [p, setP] = useState<Product | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  // core fields
  const [category, setCategory] = useState<CatalogCategory>("FOOD");
  const [title, setTitle] = useState("");
  const [brandText, setBrandText] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [variantTheme, setVariantTheme] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // sku quick add
  const [skuVariantKey, setSkuVariantKey] = useState("");
  const [skuVariantVal, setSkuVariantVal] = useState("");
  const [skuPack, setSkuPack] = useState("");

  // media quick add
  const [mediaUri, setMediaUri] = useState("");
  const [mediaLabel, setMediaLabel] = useState("");

  // specs editor (simple)
  const [specGroup, setSpecGroup] = useState("General");
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [specs, setSpecs] = useState<any[]>([]);

  // tags editor
  const [tagsText, setTagsText] = useState("");

  function cycleCategory() {
    const arr: CatalogCategory[] = ["FOOD", "ACCESSORY", "MEDICINE", "SERVICE"];
    const idx = arr.indexOf(category);
    setCategory(arr[(idx + 1) % arr.length]);
  }

  async function load() {
    setErrorText("");

    if (!Number.isFinite(productId) || productId <= 0) {
      setP(null);
      setLoading(false);
      setErrorText(`Invalid product id: ${String(firstParam(params.id))}`);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchCatalogProduct(role, productId);
      if (!data) {
        setP(null);
        setErrorText(`Product API returned empty for id=${productId}`);
        return;
      }

      setP(data);

      setCategory(data.category);
      setTitle(data.title ?? "");
      setBrandText(data.brand_text ?? "");
      setShortDesc(data.short_desc ?? "");
      setDescription(data.description ?? "");
      setVariantTheme(data.variant_theme ?? "");
      setPrescriptionRequired(!!data.prescription_required);
      setIsActive(!!data.is_active);

      setSpecs(data.specs ?? []);
      setTagsText((data.tags ?? []).join(", "));
    } catch (e: any) {
      setP(null);
      setErrorText(errToText(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function saveCore() {
    if (!title.trim() || !Number.isFinite(productId)) return;
    setBusyCore(true);
    setErrorText("");
    try {
      await updateCatalogProduct(role, productId, {
        category,
        title: title.trim(),
        brand_text: brandText.trim() || null,
        short_desc: shortDesc.trim() || null,
        description: description.trim() || null,
        variant_theme: variantTheme.trim() || null,
        prescription_required: prescriptionRequired,
        is_active: isActive,
      });
      await load();
    } catch (e: any) {
      setErrorText(errToText(e));
    } finally {
      setBusyCore(false);
    }
  }

  async function addSku() {
    if (!Number.isFinite(productId)) return;
    setBusySku(true);
    setErrorText("");
    try {
      await createCatalogSku(role, productId, {
        variant_key: skuVariantKey.trim() || null,
        variant_value: skuVariantVal.trim() || null,
        pack_label: skuPack.trim() || null,
        sort_order: 0,
        is_active: true,
      });
      setSkuVariantKey("");
      setSkuVariantVal("");
      setSkuPack("");
      await load();
    } catch (e: any) {
      setErrorText(errToText(e));
    } finally {
      setBusySku(false);
    }
  }

  async function addMedia() {
    if (!mediaUri.trim() || !Number.isFinite(productId)) return;
    setBusyMedia(true);
    setErrorText("");
    try {
      await addCatalogMedia(role, productId, {
        media_type: "IMAGE",
        uri: mediaUri.trim(),
        label: mediaLabel.trim() || null,
        sort_order: 0,
      });
      setMediaUri("");
      setMediaLabel("");
      await load();
    } catch (e: any) {
      setErrorText(errToText(e));
    } finally {
      setBusyMedia(false);
    }
  }

  async function removeMedia(id: number) {
    setBusyMedia(true);
    setErrorText("");
    try {
      await deleteCatalogMedia(role, id);
      await load();
    } catch (e: any) {
      setErrorText(errToText(e));
    } finally {
      setBusyMedia(false);
    }
  }

  async function addSpecRow() {
    if (!specKey.trim() || !specVal.trim()) return;
    setSpecs((prev) => [
      ...prev,
      { id: Date.now(), spec_group: specGroup.trim() || "General", key: specKey.trim(), value: specVal.trim(), sort_order: 0 },
    ]);
    setSpecKey("");
    setSpecVal("");
  }

  async function saveSpecs() {
    if (!Number.isFinite(productId)) return;
    setBusySpecs(true);
    setErrorText("");
    try {
      const payload = (specs ?? []).map((s) => ({
        spec_group: s.spec_group ?? "General",
        key: s.key,
        value: s.value,
        sort_order: s.sort_order ?? 0,
      }));
      await replaceCatalogSpecs(role, productId, payload);
      await load();
    } catch (e: any) {
      setErrorText(errToText(e));
    } finally {
      setBusySpecs(false);
    }
  }

  async function saveTags() {
    if (!Number.isFinite(productId)) return;
    setBusyTags(true);
    setErrorText("");
    try {
      const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
      await replaceCatalogTags(role, productId, tags);
      await load();
    } catch (e: any) {
      setErrorText(errToText(e));
    } finally {
      setBusyTags(false);
    }
  }

  const media = p?.media ?? [];
  const skus = p?.skus ?? [];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10, opacity: 0.7 }}>Loading…</Text>
      </View>
    );
  }

  if (!p) {
    return (
      <View style={styles.center}>
        <Text style={styles.nfTitle}>Not found</Text>
        {!!errorText && <Text style={styles.nfError} numberOfLines={10}>{errorText}</Text>}
        <Pressable style={styles.btnSecondary} onPress={() => router.back()}>
          <Text style={styles.btnSecondaryText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 28 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push(`${base}/catalog` as any)} style={styles.backPill}>
          <Text style={styles.backPillText}>‹ Back</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Edit product</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            <Chip text={`Role: ${role}`} />
            <Chip text={`#${productId}`} />
            {effectiveStoreId ? <Chip text={`Store ${effectiveStoreId}`} /> : null}
            <Chip text={isActive ? "ACTIVE" : "INACTIVE"} />
          </View>
        </View>
      </View>

      {/* Error banner */}
      {!!errorText && (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Something went wrong</Text>
          <Text style={styles.bannerText} numberOfLines={6}>{errorText}</Text>
        </View>
      )}

      {/* Core */}
      <View style={styles.card}>
        <Row
          left={
            <View>
              <Text style={styles.cardTitle}>Core</Text>
              <Text style={styles.cardSub}>Master product details</Text>
            </View>
          }
          right={<Text style={styles.miniMuted}>{busyCore ? "Saving…" : ""}</Text>}
        />

        <View style={styles.divider} />

        <Text style={styles.label}>Category</Text>
        <Pressable style={styles.select} onPress={cycleCategory} disabled={busyAny}>
          <Text style={styles.selectText}>{category}</Text>
          <Text style={styles.selectHint}>Tap to change</Text>
        </Pressable>

        <Text style={styles.label}>Title *</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="e.g., Royal Canin Adult 2kg" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />

        <Text style={styles.label}>Brand text</Text>
        <TextInput value={brandText} onChangeText={setBrandText} style={styles.input} placeholder="optional" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />

        <Text style={styles.label}>Short desc</Text>
        <TextInput value={shortDesc} onChangeText={setShortDesc} style={styles.input} placeholder="optional" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />

        <Text style={styles.label}>Description</Text>
        <TextInput value={description} onChangeText={setDescription} style={[styles.input, { height: 110 }]} multiline placeholder="optional" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />

        <Text style={styles.label}>Variant theme</Text>
        <TextInput value={variantTheme} onChangeText={setVariantTheme} style={styles.input} placeholder="Size / Flavor / Color" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />

        {role === "pharmacist" ? (
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Prescription required</Text>
              <Text style={styles.switchHint}>Show Rx badge on consumer app</Text>
            </View>
            <Switch value={prescriptionRequired} onValueChange={setPrescriptionRequired} disabled={busyAny} />
          </View>
        ) : null}

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Active</Text>
            <Text style={styles.switchHint}>Hide or show in catalog</Text>
          </View>
          <Switch value={isActive} onValueChange={setIsActive} disabled={busyAny} />
        </View>

        <Pressable style={[styles.btnPrimary, busyCore && { opacity: 0.6 }]} onPress={saveCore} disabled={busyCore || !title.trim()}>
          <Text style={styles.btnPrimaryText}>{busyCore ? "Saving…" : "Save core"}</Text>
        </Pressable>
      </View>

      {/* SKUs */}
      <View style={styles.card}>
        <Row
          left={
            <View>
              <Text style={styles.cardTitle}>SKUs</Text>
              <Text style={styles.cardSub}>Variants & packs</Text>
            </View>
          }
          right={<Text style={styles.miniMuted}>{busySku ? "Working…" : ""}</Text>}
        />

        <View style={styles.divider} />

        {skus.length ? (
          skus.map((s: any) => (
            <View key={s.sku_id} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle} numberOfLines={1}>
                  {s.variant_key ? `${s.variant_key}: ${s.variant_value}` : "Default"}{" "}
                  {s.pack_label ? ` • ${s.pack_label}` : ""}
                </Text>
                <Text style={styles.listSub}>SKU #{s.sku_id}</Text>
              </View>
              <Chip text={s.is_active ? "ACTIVE" : "INACTIVE"} />
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No SKUs yet</Text>
        )}

        <View style={{ height: 10 }} />

        <Text style={styles.sectionMini}>Add SKU</Text>
        <View style={styles.grid2}>
          <TextInput value={skuVariantKey} onChangeText={setSkuVariantKey} style={[styles.input, styles.gridItem]} placeholder="Variant key (e.g., Size)" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />
          <TextInput value={skuVariantVal} onChangeText={setSkuVariantVal} style={[styles.input, styles.gridItem]} placeholder="Variant value (e.g., 3kg)" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />
        </View>
        <TextInput value={skuPack} onChangeText={setSkuPack} style={styles.input} placeholder="Pack label (optional)" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />

        <Pressable style={[styles.btnPrimary, busySku && { opacity: 0.6 }]} onPress={addSku} disabled={busySku}>
          <Text style={styles.btnPrimaryText}>{busySku ? "Adding…" : "Add SKU"}</Text>
        </Pressable>
      </View>

      {/* Media */}
      <View style={styles.card}>
        <Row
          left={
            <View>
              <Text style={styles.cardTitle}>Media</Text>
              <Text style={styles.cardSub}>Images for PDP carousel</Text>
            </View>
          }
          right={<Text style={styles.miniMuted}>{busyMedia ? "Working…" : ""}</Text>}
        />

        <View style={styles.divider} />

        {media.length ? (
          media.map((m: any) => (
            <View key={m.id} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle} numberOfLines={1}>{m.label ? m.label : "Image"}</Text>
                <Text style={styles.listSub} numberOfLines={1}>{m.uri}</Text>
              </View>
              <Pressable onPress={() => removeMedia(m.id)} disabled={busyMedia} style={styles.btnDangerTiny}>
                <Text style={styles.btnDangerTinyText}>Remove</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No images yet</Text>
        )}

        <View style={{ height: 10 }} />

        <Text style={styles.sectionMini}>Add image</Text>
        <TextInput value={mediaUri} onChangeText={setMediaUri} style={styles.input} placeholder="https://image-url" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />
        <TextInput value={mediaLabel} onChangeText={setMediaLabel} style={styles.input} placeholder="label (optional)" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />

        <Pressable style={[styles.btnPrimary, busyMedia && { opacity: 0.6 }]} onPress={addMedia} disabled={busyMedia || !mediaUri.trim()}>
          <Text style={styles.btnPrimaryText}>{busyMedia ? "Adding…" : "Add image"}</Text>
        </Pressable>
      </View>

      {/* Specs */}
      <View style={styles.card}>
        <Row
          left={
            <View>
              <Text style={styles.cardTitle}>Specs</Text>
              <Text style={styles.cardSub}>Highlights and details</Text>
            </View>
          }
          right={<Text style={styles.miniMuted}>{busySpecs ? "Saving…" : ""}</Text>}
        />

        <View style={styles.divider} />

        {(specs ?? []).length ? (
          specs.map((s: any, idx: number) => (
            <View key={`${s.key}-${idx}`} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle} numberOfLines={1}>{s.spec_group} • {s.key}</Text>
                <Text style={styles.listSub} numberOfLines={2}>{s.value}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No specs yet</Text>
        )}

        <View style={{ height: 10 }} />

        <Text style={styles.sectionMini}>Add spec row</Text>
        <TextInput value={specGroup} onChangeText={setSpecGroup} style={styles.input} placeholder="Group (e.g., Top highlights)" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />

        <View style={styles.grid2}>
          <TextInput value={specKey} onChangeText={setSpecKey} style={[styles.input, styles.gridItem]} placeholder="Key (e.g., Material)" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />
          <TextInput value={specVal} onChangeText={setSpecVal} style={[styles.input, styles.gridItem]} placeholder="Value (e.g., Stainless steel)" placeholderTextColor={stylesTokens.ph} editable={!busyAny} />
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
          <Pressable style={[styles.btnSecondary, { flex: 1 }]} onPress={addSpecRow} disabled={busyAny || !specKey.trim() || !specVal.trim()}>
            <Text style={styles.btnSecondaryText}>Add row</Text>
          </Pressable>

          <Pressable style={[styles.btnPrimary, { flex: 1 }, busySpecs && { opacity: 0.6 }]} onPress={saveSpecs} disabled={busySpecs}>
            <Text style={styles.btnPrimaryText}>{busySpecs ? "Saving…" : "Save specs"}</Text>
          </Pressable>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.card}>
        <Row
          left={
            <View>
              <Text style={styles.cardTitle}>Tags</Text>
              <Text style={styles.cardSub}>Search & discovery</Text>
            </View>
          }
          right={<Text style={styles.miniMuted}>{busyTags ? "Saving…" : ""}</Text>}
        />

        <View style={styles.divider} />

        <TextInput
          value={tagsText}
          onChangeText={setTagsText}
          style={[styles.input, { height: 70 }]}
          multiline
          placeholder="comma separated e.g. puppy, food, deal"
          placeholderTextColor={stylesTokens.ph}
          editable={!busyAny}
        />

        <Pressable style={[styles.btnPrimary, busyTags && { opacity: 0.6 }]} onPress={saveTags} disabled={busyTags}>
          <Text style={styles.btnPrimaryText}>{busyTags ? "Saving…" : "Save tags"}</Text>
        </Pressable>
      </View>

      <View style={{ height: 18 }} />

      <Pressable style={styles.btnSecondary} onPress={() => router.push(`${base}/catalog` as any)}>
        <Text style={styles.btnSecondaryText}>Back to catalog</Text>
      </Pressable>
    </ScrollView>
  );
}

/** Light, elegant tokens (neutral). */
const stylesTokens = {
  bg: "#F6F7FB",
  card: "#FFFFFF",
  text: "#111827",
  muted: "rgba(17,24,39,0.60)",
  border: "rgba(17,24,39,0.10)",
  border2: "rgba(17,24,39,0.14)",
  ph: "rgba(17,24,39,0.35)",
  shadow: "rgba(0,0,0,0.06)",
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: stylesTokens.bg },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: stylesTokens.bg },

  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },

  backPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: stylesTokens.border,
    backgroundColor: stylesTokens.card,
  },
  backPillText: { fontWeight: "900", color: stylesTokens.text, opacity: 0.9 },

  h1: { fontSize: 20, fontWeight: "900", color: stylesTokens.text },

  chip: {
    borderWidth: 1,
    borderColor: stylesTokens.border,
    backgroundColor: stylesTokens.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipPressable: { opacity: 0.95 },
  chipText: { fontWeight: "900", fontSize: 12, color: stylesTokens.text, opacity: 0.85 },

  banner: {
    borderWidth: 1,
    borderColor: "rgba(255,99,71,0.35)",
    backgroundColor: "rgba(255,99,71,0.08)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  bannerTitle: { fontWeight: "900", color: stylesTokens.text },
  bannerText: { marginTop: 6, color: stylesTokens.text, opacity: 0.8 },

  card: {
    borderWidth: 1,
    borderColor: stylesTokens.border,
    borderRadius: 18,
    padding: 14,
    backgroundColor: stylesTokens.card,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },

  cardTitle: { fontWeight: "900", color: stylesTokens.text, fontSize: 15 },
  cardSub: { marginTop: 4, color: stylesTokens.muted, fontWeight: "700" },

  divider: { height: 1, backgroundColor: stylesTokens.border, marginVertical: 12 },

  label: { marginTop: 10, marginBottom: 6, color: stylesTokens.text, opacity: 0.75, fontWeight: "800" },
  input: {
    borderWidth: 1,
    borderColor: stylesTokens.border2,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(17,24,39,0.02)",
    color: stylesTokens.text,
  },

  select: {
    borderWidth: 1,
    borderColor: stylesTokens.border2,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(17,24,39,0.02)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { fontWeight: "900", color: stylesTokens.text },
  selectHint: { color: stylesTokens.muted, fontWeight: "800", fontSize: 12 },

  switchRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: stylesTokens.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: { fontWeight: "900", color: stylesTokens.text },
  switchHint: { marginTop: 4, fontWeight: "700", color: stylesTokens.muted, maxWidth: 260 },

  btnPrimary: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.92)",
    alignItems: "center",
  },
  btnPrimaryText: { fontWeight: "900", color: "#fff" },

  btnSecondary: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: stylesTokens.border2,
    backgroundColor: stylesTokens.card,
    alignItems: "center",
  },
  btnSecondaryText: { fontWeight: "900", color: stylesTokens.text, opacity: 0.9 },

  btnDangerTiny: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,99,71,0.35)",
    backgroundColor: "rgba(255,99,71,0.08)",
  },
  btnDangerTinyText: { fontWeight: "900", color: "tomato" },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  listRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: stylesTokens.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listTitle: { fontWeight: "900", color: stylesTokens.text },
  listSub: { marginTop: 4, color: stylesTokens.muted, fontWeight: "700" },

  emptyText: { color: stylesTokens.muted, fontWeight: "700" },

  sectionMini: { marginTop: 8, marginBottom: 8, fontWeight: "900", color: stylesTokens.text, opacity: 0.85 },

  grid2: { flexDirection: "row", gap: 10 },
  gridItem: { flex: 1 },

  miniMuted: { color: stylesTokens.muted, fontWeight: "800" },

  nfTitle: { fontWeight: "900", fontSize: 18, color: stylesTokens.text },
  nfError: { marginTop: 10, color: stylesTokens.text, opacity: 0.8, maxWidth: 720, textAlign: "center" },
});
