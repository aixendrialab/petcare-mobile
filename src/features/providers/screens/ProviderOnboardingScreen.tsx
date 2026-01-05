import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, Switch } from "react-native";
import { useRouter } from "expo-router";
import type { ProviderProfile, ProviderRole } from "../types";
import { fetchMyProvider, upsertMyProvider } from "../api";

function roleHome(role: ProviderRole) {
  switch (role) {
    case "pharmacy":
      return "/pharmacist/home";
    case "vendor":
      return "/vendor/home";
    case "hostel":
      return "/hostel/home";
    case "nutritionist":
      return "/nutritionist/home";
    case "vet":
      return "/vet/home";
    default:
      return "/roles";
  }
}

export default function ProviderOnboardingScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // pharmacy-only
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseValidTill, setLicenseValidTill] = useState(""); // YYYY-MM-DD

  // delivery capability (for vendor/pharmacy)
  const [offersDelivery, setOffersDelivery] = useState(true);

  const requiresLicense = useMemo(() => role === "pharmacy", [role]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await fetchMyProvider(role);
        if (p) {
          setDisplayName(p.display_name ?? "");
          setPhone(p.phone ?? "");
          setEmail(p.email ?? "");
          setAddress1(p.address_line1 ?? "");
          setAddress2(p.address_line2 ?? "");
          setCity(p.city ?? "");
          setState(p.state ?? "");
          setPincode(p.pincode ?? "");
          setLicenseNo(p.license_no ?? "");
          setLicenseValidTill(p.license_valid_till ?? "");
          // offersDelivery can be stored later; for now keep local default
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role]);

  const isValid =
    !!displayName.trim() &&
    !!phone.trim() &&
    !!city.trim() &&
    !!state.trim() &&
    !!pincode.trim() &&
    (!requiresLicense || (!!licenseNo.trim() && !!licenseValidTill.trim()));

  async function save() {
    if (!isValid) return;
    setBusy(true);
    try {
      const payload: Partial<ProviderProfile> = {
        role,
        display_name: displayName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address_line1: address1.trim() || undefined,
        address_line2: address2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        license_no: requiresLicense ? licenseNo.trim() : undefined,
        license_valid_till: requiresLicense ? licenseValidTill.trim() : undefined,
        status: "ACTIVE",
      };

      await upsertMyProvider(role, payload);

      router.replace(roleHome(role) as any);
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
      <Text style={styles.h1}>Onboarding</Text>
      <Text style={styles.sub}>Role: {role}</Text>

      <View style={{ height: 14 }} />

      <Text style={styles.label}>Store / Individual Name *</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} style={styles.input} placeholder="e.g., Happy Paws Pharmacy" placeholderTextColor="rgba(255,255,255,0.5)" />

      <Text style={styles.label}>Phone *</Text>
      <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" placeholder="10-digit mobile" placeholderTextColor="rgba(255,255,255,0.5)" />

      <Text style={styles.label}>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" placeholder="optional" placeholderTextColor="rgba(255,255,255,0.5)" />

      <View style={{ height: 6 }} />

      <Text style={styles.label}>Address Line 1</Text>
      <TextInput value={address1} onChangeText={setAddress1} style={styles.input} placeholder="Street / locality" placeholderTextColor="rgba(255,255,255,0.5)" />

      <Text style={styles.label}>Address Line 2</Text>
      <TextInput value={address2} onChangeText={setAddress2} style={styles.input} placeholder="optional" placeholderTextColor="rgba(255,255,255,0.5)" />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>City *</Text>
          <TextInput value={city} onChangeText={setCity} style={styles.input} placeholder="City" placeholderTextColor="rgba(255,255,255,0.5)" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>State *</Text>
          <TextInput value={state} onChangeText={setState} style={styles.input} placeholder="State" placeholderTextColor="rgba(255,255,255,0.5)" />
        </View>
      </View>

      <Text style={styles.label}>Pincode *</Text>
      <TextInput value={pincode} onChangeText={setPincode} style={styles.input} keyboardType="numeric" placeholder="PIN" placeholderTextColor="rgba(255,255,255,0.5)" />

      {requiresLicense ? (
        <>
          <View style={{ height: 8 }} />
          <Text style={styles.sectionTitle}>License (Mandatory for Pharmacy)</Text>

          <Text style={styles.label}>License No *</Text>
          <TextInput value={licenseNo} onChangeText={setLicenseNo} style={styles.input} placeholder="License number" placeholderTextColor="rgba(255,255,255,0.5)" />

          <Text style={styles.label}>Valid Till (YYYY-MM-DD) *</Text>
          <TextInput value={licenseValidTill} onChangeText={setLicenseValidTill} style={styles.input} placeholder="2028-12-31" placeholderTextColor="rgba(255,255,255,0.5)" />
        </>
      ) : null}

      {(role === "vendor" || role === "pharmacy") ? (
        <>
          <View style={{ height: 8 }} />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Offers delivery</Text>
            <Switch value={offersDelivery} onValueChange={setOffersDelivery} />
          </View>
          <Text style={{ opacity: 0.6, marginTop: 6, fontSize: 12 }}>
            We’ll persist this in DB later; for now it’s UI-only.
          </Text>
        </>
      ) : null}

      <View style={{ flex: 1 }} />

      <Pressable style={[styles.primaryBtn, !isValid && { opacity: 0.5 }]} onPress={save} disabled={!isValid || busy}>
        <Text style={styles.primaryBtnText}>{busy ? "Saving…" : "Save & Continue"}</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
        <Text style={styles.secondaryBtnText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 20, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.7 },
  sectionTitle: { fontWeight: "900", marginTop: 6, marginBottom: 4 },

  label: { marginTop: 10, marginBottom: 6, opacity: 0.8, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  row: { flexDirection: "row", gap: 10 },

  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  switchLabel: { fontWeight: "800", opacity: 0.9 },

  primaryBtn: { marginTop: 16, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)" },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  secondaryBtnText: { textAlign: "center", fontWeight: "800", opacity: 0.9 },
});
