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

type Product = any;

export default function ProviderProductEditorScreen({ role }: { role: ProviderRole }) {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string; store_id?: string }>();
    const base = useMemo(() => roleBase(role), [role]);

    const productId = Number(params.id);
    const { store } = useStoreContext();

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [p, setP] = useState<Product | null>(null);

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
        if (!productId) return;
        setLoading(true);
        try {
            const data = await fetchCatalogProduct(role, productId);
            if (!data) {
                setP(null);
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
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    async function saveCore() {
        if (!title.trim()) return;
        setBusy(true);
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
        } finally {
            setBusy(false);
        }
    }

    async function addSku() {
        if (!productId) return;
        setBusy(true);
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
        } finally {
            setBusy(false);
        }
    }

    async function addMedia() {
        if (!mediaUri.trim()) return;
        setBusy(true);
        try {
            await addCatalogMedia(role, productId, { media_type: "IMAGE", uri: mediaUri.trim(), label: mediaLabel.trim() || null, sort_order: 0 });
            setMediaUri("");
            setMediaLabel("");
            await load();
        } finally {
            setBusy(false);
        }
    }

    async function removeMedia(id: number) {
        setBusy(true);
        try {
            await deleteCatalogMedia(role, id);
            await load();
        } finally {
            setBusy(false);
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
        setBusy(true);
        try {
            const payload = (specs ?? []).map((s) => ({
                spec_group: s.spec_group ?? "General",
                key: s.key,
                value: s.value,
                sort_order: s.sort_order ?? 0,
            }));
            await replaceCatalogSpecs(role, productId, payload);
            await load();
        } finally {
            setBusy(false);
        }
    }

    async function saveTags() {
        setBusy(true);
        try {
            const tags = tagsText
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            await replaceCatalogTags(role, productId, tags);
            await load();
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

    if (!p) {
        return (
            <View style={styles.center}>
                <Text style={{ opacity: 0.7 }}>Not found</Text>
                <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
                    <Text style={styles.secondaryBtnText}>Back</Text>
                </Pressable>
            </View>
        );
    }

    const media = p.media ?? [];
    const skus = p.skus ?? [];

    return (
        <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.h1}>Edit Product</Text>
            <Text style={styles.sub}>Role: {role} • Product #{productId}</Text>

            {/* Core */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Core</Text>

                <Text style={styles.label}>Category</Text>
                <Pressable style={styles.pill} onPress={cycleCategory}>
                    <Text style={styles.pillText}>{category} (tap to change)</Text>
                </Pressable>

                <Text style={styles.label}>Title *</Text>
                <TextInput value={title} onChangeText={setTitle} style={styles.input} />

                <Text style={styles.label}>Brand text</Text>
                <TextInput value={brandText} onChangeText={setBrandText} style={styles.input} placeholder="optional" placeholderTextColor="rgba(255,255,255,0.5)" />

                <Text style={styles.label}>Short desc</Text>
                <TextInput value={shortDesc} onChangeText={setShortDesc} style={styles.input} placeholder="optional" placeholderTextColor="rgba(255,255,255,0.5)" />

                <Text style={styles.label}>Description</Text>
                <TextInput value={description} onChangeText={setDescription} style={[styles.input, { height: 120 }]} multiline />

                <Text style={styles.label}>Variant theme</Text>
                <TextInput value={variantTheme} onChangeText={setVariantTheme} style={styles.input} placeholder="Size/Flavor/Color" placeholderTextColor="rgba(255,255,255,0.5)" />

                {role === "pharmacist" ? (
                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Prescription required</Text>
                        <Switch value={prescriptionRequired} onValueChange={setPrescriptionRequired} />
                    </View>
                ) : null}

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Active</Text>
                    <Switch value={isActive} onValueChange={setIsActive} />
                </View>

                <Pressable style={[styles.primaryBtn, busy && { opacity: 0.6 }]} onPress={saveCore} disabled={busy}>
                    <Text style={styles.primaryBtnText}>{busy ? "Saving…" : "Save Core"}</Text>
                </Pressable>
            </View>

            {/* SKUs */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>SKUs</Text>

                {skus.length ? (
                    skus.map((s: any) => (
                        <View key={s.sku_id} style={styles.rowBetween}>
                            <Text style={{ fontWeight: "900" }}>
                                {s.variant_key ? `${s.variant_key}: ${s.variant_value}` : "Default"} {s.pack_label ? `• ${s.pack_label}` : ""}
                            </Text>
                            <Text style={{ opacity: 0.7 }}>SKU #{s.sku_id}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ opacity: 0.7 }}>No SKUs yet</Text>
                )}

                <View style={{ height: 10 }} />

                <Text style={styles.label}>Add SKU</Text>
                <TextInput value={skuVariantKey} onChangeText={setSkuVariantKey} style={styles.input} placeholder="Variant key (e.g., Size)" placeholderTextColor="rgba(255,255,255,0.5)" />
                <TextInput value={skuVariantVal} onChangeText={setSkuVariantVal} style={styles.input} placeholder="Variant value (e.g., 3kg)" placeholderTextColor="rgba(255,255,255,0.5)" />
                <TextInput value={skuPack} onChangeText={setSkuPack} style={styles.input} placeholder="Pack label (optional)" placeholderTextColor="rgba(255,255,255,0.5)" />

                <Pressable style={[styles.primaryBtn, busy && { opacity: 0.6 }]} onPress={addSku} disabled={busy}>
                    <Text style={styles.primaryBtnText}>{busy ? "Adding…" : "Add SKU"}</Text>
                </Pressable>
            </View>

            {/* Media */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Media</Text>

                {media.length ? (
                    media.map((m: any) => (
                        <View key={m.id} style={styles.rowBetween}>
                            <Text style={{ flex: 1, fontWeight: "800" }} numberOfLines={1}>{m.uri}</Text>
                            <Pressable onPress={() => removeMedia(m.id)} disabled={busy}>
                                <Text style={{ color: "tomato", fontWeight: "900" }}>Remove</Text>
                            </Pressable>
                        </View>
                    ))
                ) : (
                    <Text style={{ opacity: 0.7 }}>No images yet</Text>
                )}

                <View style={{ height: 10 }} />

                <Text style={styles.label}>Add Image URL</Text>
                <TextInput value={mediaUri} onChangeText={setMediaUri} style={styles.input} placeholder="https://..." placeholderTextColor="rgba(255,255,255,0.5)" />
                <TextInput value={mediaLabel} onChangeText={setMediaLabel} style={styles.input} placeholder="label (optional)" placeholderTextColor="rgba(255,255,255,0.5)" />

                <Pressable style={[styles.primaryBtn, busy && { opacity: 0.6 }]} onPress={addMedia} disabled={busy}>
                    <Text style={styles.primaryBtnText}>{busy ? "Adding…" : "Add Image"}</Text>
                </Pressable>
            </View>

            {/* Specs */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Specs</Text>

                {(specs ?? []).length ? (
                    specs.map((s: any, idx: number) => (
                        <View key={`${s.key}-${idx}`} style={styles.rowBetween}>
                            <Text style={{ fontWeight: "900" }}>{s.spec_group} • {s.key}</Text>
                            <Text style={{ opacity: 0.8 }}>{s.value}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ opacity: 0.7 }}>No specs yet</Text>
                )}

                <View style={{ height: 10 }} />

                <Text style={styles.label}>Add Spec</Text>
                <TextInput value={specGroup} onChangeText={setSpecGroup} style={styles.input} placeholder="Group (e.g., Top highlights)" placeholderTextColor="rgba(255,255,255,0.5)" />
                <TextInput value={specKey} onChangeText={setSpecKey} style={styles.input} placeholder="Key (e.g., Material)" placeholderTextColor="rgba(255,255,255,0.5)" />
                <TextInput value={specVal} onChangeText={setSpecVal} style={styles.input} placeholder="Value (e.g., Stainless steel)" placeholderTextColor="rgba(255,255,255,0.5)" />

                <Pressable style={[styles.secondaryBtn, busy && { opacity: 0.6 }]} onPress={addSpecRow} disabled={busy}>
                    <Text style={styles.secondaryBtnText}>Add Spec Row</Text>
                </Pressable>

                <Pressable style={[styles.primaryBtn, busy && { opacity: 0.6 }]} onPress={saveSpecs} disabled={busy}>
                    <Text style={styles.primaryBtnText}>{busy ? "Saving…" : "Save Specs"}</Text>
                </Pressable>
            </View>

            {/* Tags */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Tags</Text>
                <TextInput
                    value={tagsText}
                    onChangeText={setTagsText}
                    style={[styles.input, { height: 60 }]}
                    multiline
                    placeholder="comma separated e.g. puppy, food, deal"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                />
                <Pressable style={[styles.primaryBtn, busy && { opacity: 0.6 }]} onPress={saveTags} disabled={busy}>
                    <Text style={styles.primaryBtnText}>{busy ? "Saving…" : "Save Tags"}</Text>
                </Pressable>
            </View>

            <Pressable style={styles.secondaryBtn} onPress={() => router.push(`${base}/catalog` as any)}>
                <Text style={styles.secondaryBtnText}>Back to Catalog</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, padding: 16 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    h1: { fontSize: 20, fontWeight: "900" },
    sub: { marginTop: 4, opacity: 0.7 },

    card: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: 12,
        marginTop: 12,
    },
    sectionTitle: { fontWeight: "900", marginBottom: 8 },

    label: { marginTop: 10, marginBottom: 6, opacity: 0.8, fontWeight: "800" },
    input: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },

    pill: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    pillText: { fontWeight: "900", opacity: 0.9 },

    switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
    switchLabel: { fontWeight: "800", opacity: 0.9 },

    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 10 },

    primaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
    primaryBtnText: { textAlign: "center", fontWeight: "900" },

    secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
    secondaryBtnText: { textAlign: "center", fontWeight: "800", opacity: 0.9 },
});
