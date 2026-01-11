import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/src/ui";
import type { ProviderRole } from "../types";
import { fetchMyProvider } from "../api";
import { StoreCard } from "@/src/features/providers/components/StoreCard";

function roleBase(role: ProviderRole) {
  switch (role) {
    case "pharmacist":
      return "/pharmacist";
    case "vendor":
      return "/vendor";
    case "hostel":
      return "/hostel";
    case "nutritionist":
      return "/nutritionist";
    case "vet":
      return "/vet";
    default:
      return "/roles";
  }
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value && String(value).trim().length ? String(value) : "—"}
      </Text>
    </View>
  );
}

export default function ProviderProfileScreen({ role }: { role: ProviderRole }) {
  const [loading, setLoading] = useState(true);
  const [p, setP] = useState<any>(null);

  const base = roleBase(role);

  async function load() {
    setLoading(true);
    try {
      const provider = await fetchMyProvider(role);
      setP(provider ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const locationText = useMemo(() => {
    if (!p) return null;
    const loc = [p.city, p.state, p.pincode].filter(Boolean).join(" • ");
    return loc || "—";
  }, [p]);

  if (loading) {
    return (
      <Screen title="Profile" subtitle={`${role}`}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10, opacity: 0.7, fontWeight: "700" }}>Loading…</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Profile" subtitle={`${role} • Store details`}>
      {!p ? (
        <View style={styles.emptyBox}>
          <Text style={{ fontWeight: "900", fontSize: 16 }}>Profile not set</Text>
          <Text style={{ opacity: 0.75, marginTop: 6, fontWeight: "700" }}>
            Complete onboarding to enable store features.
          </Text>

          <Pressable style={styles.primaryBtn} onPress={() => router.push(`${base}/onboarding` as any)}>
            <Text style={styles.primaryBtnText}>Create Store</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <StoreCard
            title={p.display_name}
            subtitle={locationText}
            imageUri={p.logo_uri ?? null}
            rightBadge={p.status ?? "ACTIVE"}
            selected
            onPress={() => router.push(`${base}/onboarding` as any)}
          />

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Row label="Phone" value={p.phone} />
            <Row label="Email" value={p.email} />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Row label="Line 1" value={p.address_line1} />
            <Row label="Line 2" value={p.address_line2} />
            <Row label="City" value={p.city} />
            <Row label="State" value={p.state} />
            <Row label="Pincode" value={p.pincode} />
          </View>

          {role === "pharmacist" ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>License</Text>
              <Row label="License No" value={p.license_no} />
              <Row label="Valid Till" value={p.license_valid_till} />
            </View>
          ) : null}

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <Pressable style={[styles.primaryBtn, { flex: 1 }]} onPress={() => router.push(`${base}/onboarding` as any)}>
              <Text style={styles.primaryBtnText}>Edit Store</Text>
            </Pressable>
            <Pressable style={[styles.secondaryBtn, { flex: 1 }]} onPress={load}>
              <Text style={styles.secondaryBtnText}>Refresh</Text>
            </Pressable>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  emptyBox: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.95)",
  },

  card: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  sectionTitle: { fontWeight: "900", marginBottom: 10, opacity: 0.9 },

  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, gap: 12 },
  label: { opacity: 0.6, fontWeight: "800", flex: 1 },
  value: { fontWeight: "900", flex: 1, textAlign: "right" },

  primaryBtn: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },

  secondaryBtn: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  secondaryBtnText: { textAlign: "center", fontWeight: "900", opacity: 0.9 },
});
