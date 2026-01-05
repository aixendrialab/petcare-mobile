import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/src/ui";
import type { ProviderRole } from "../types";
import { fetchMyProvider } from "../api";

function roleBase(role: ProviderRole) {
  switch (role) {
    case "pharmacy":
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
      <Text style={styles.value}>{value && String(value).trim().length ? String(value) : "—"}</Text>
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
  }, [role]);

  if (loading) {
    return (
      <Screen title="Profile" subtitle={`${role}`}>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Profile" subtitle={`${role} • Business details`}>
      {!p ? (
        <View style={styles.emptyBox}>
          <Text style={{ fontWeight: "900" }}>Profile not set</Text>
          <Text style={{ opacity: 0.75, marginTop: 6 }}>Complete onboarding to enable store features.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.push(`${base}/onboarding` as any)}>
            <Text style={styles.primaryBtnText}>Start Onboarding</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Row label="Name" value={p.display_name} />
            <Row label="Phone" value={p.phone} />
            <Row label="Email" value={p.email} />
            <Row label="Status" value={p.status} />
          </View>

          <View style={styles.card}>
            <Row label="Address 1" value={p.address_line1} />
            <Row label="Address 2" value={p.address_line2} />
            <Row label="City" value={p.city} />
            <Row label="State" value={p.state} />
            <Row label="Pincode" value={p.pincode} />
          </View>

          {role === "pharmacy" ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>License</Text>
              <Row label="License No" value={p.license_no} />
              <Row label="Valid Till" value={p.license_valid_till} />
            </View>
          ) : null}

          <Pressable style={styles.primaryBtn} onPress={() => router.push(`${base}/onboarding` as any)}>
            <Text style={styles.primaryBtnText}>Edit Profile</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={load}>
            <Text style={styles.secondaryBtnText}>Refresh</Text>
          </Pressable>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: "900", marginBottom: 8 },

  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { opacity: 0.7, fontWeight: "700" },
  value: { fontWeight: "900", maxWidth: "60%", textAlign: "right" },

  emptyBox: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
  },

  primaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },

  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800", opacity: 0.9 },
});
