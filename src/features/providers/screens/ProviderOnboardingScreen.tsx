import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, Switch, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import type { ProviderProfile, ProviderRole } from "../types";
import { fetchMyProvider, createProviderStore } from "../api";
import { useStoreContext } from "../storeContext";

function roleHome(role: ProviderRole) {
  switch (role) {
    case "pharmacist":
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

function Section({ title, hint, children }: { title: string; hint?: string; children: any }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      <View style={{ height: 10 }} />
      {children}
    </View>
  );
}

export default function ProviderOnboardingScreen({ role }: { role: ProviderRole }) {
  const router = useRouter();
  const { setStore } = useStoreContext();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [logoUri, setLogoUri] = useState("");

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // pharmacist-only
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseValidTill, setLicenseValidTill] = useState(""); // YYYY-MM-DD

  // delivery capability (vendor/pharmacy) UI-only for now
  const [offersDelivery, setOffersDelivery] = useState(true);

  const requiresLicense = useMemo(() => role === "pharmacist", [role]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await fetchMyProvider(role);
        if (p) {
          setDisplayName(p.display_name ?? "");
          setPhone(p.phone ?? "");
          setEmail(p.email ?? "");

          setLogoUri(p.logo_uri ?? "");

          setAddress1(p.address_line1 ?? "");
          setAddress2(p.address_line2 ?? "");
          setCity(p.city ?? "");
          setState(p.state ?? "");
          setPincode(p.pincode ?? "");

          setLicenseNo(p.license_no ?? "");
          setLicenseValidTill(p.license_valid_till ?? "");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        logo_uri: logoUri.trim() || undefined,

        address_line1: address1.trim() || undefined,
        address_line2: address2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),

        license_no: requiresLicense ? licenseNo.trim() : undefined,
        license_valid_till: requiresLicense ? licenseValidTill.trim() : undefined,

        status: "ACTIVE",
      };

      const res = await createProviderStore(role, payload); // {store_id}
      const store_id = res.store_id;

      await setStore({ store_id, display_name: payload.display_name! });

      // take them to catalog after store create (generic for vendor/pharmacist/hostel)
      if (role === "vendor" || role === "pharmacist" || role === "hostel") {
        router.replace({ pathname: "/vendor/catalog", params: { store_id: String(store_id), mode: "add_to_store" } } as any);
        return;
      }

      router.replace(roleHome(role) as any);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10, opacity: 0.7, fontWeight: "700" }}>Loading…</Text>
      </View>
    );
  }

  const logoPreview = logoUri.trim();

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.h1}>Store onboarding</Text>
      <Text style={styles.sub}>Role: {role}</Text>

      <Section title="Basic info" hint="This is shown to pet parents in the Shop.">
        <Text style={styles.label}>Store / Individual name *</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
          placeholder="e.g., Vizag Pets"
          placeholderTextColor="rgba(0,0,0,0.35)"
        />

        <Text style={styles.label}>Phone *</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="10-digit mobile"
          placeholderTextColor="rgba(0,0,0,0.35)"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          placeholder="optional"
          placeholderTextColor="rgba(0,0,0,0.35)"
        />

        <Text style={styles.label}>Store logo URL</Text>
        <TextInput
          value={logoUri}
          onChangeText={setLogoUri}
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="rgba(0,0,0,0.35)"
        />
        <Text style={styles.help}>
          Tip: use any public image URL for now. Later we’ll support uploads.
        </Text>

        {logoPreview ? (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "900", opacity: 0.85 }}>Preview</Text>
            <Image
              source={{ uri: logoPreview }}
              style={{ width: 64, height: 64, borderRadius: 16, marginTop: 8, backgroundColor: "rgba(0,0,0,0.06)" }}
            />
          </View>
        ) : null}
      </Section>

      <Section title="Address" hint="Used for delivery, billing, and store page.">
        <Text style={styles.label}>Address line 1</Text>
        <TextInput
          value={address1}
          onChangeText={setAddress1}
          style={styles.input}
          placeholder="Street / locality"
          placeholderTextColor="rgba(0,0,0,0.35)"
        />

        <Text style={styles.label}>Address line 2</Text>
        <TextInput
          value={address2}
          onChangeText={setAddress2}
          style={styles.input}
          placeholder="optional"
          placeholderTextColor="rgba(0,0,0,0.35)"
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              style={styles.input}
              placeholder="City"
              placeholderTextColor="rgba(0,0,0,0.35)"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              value={state}
              onChangeText={setState}
              style={styles.input}
              placeholder="State"
              placeholderTextColor="rgba(0,0,0,0.35)"
            />
          </View>
        </View>

        <Text style={styles.label}>Pincode *</Text>
        <TextInput
          value={pincode}
          onChangeText={setPincode}
          style={styles.input}
          keyboardType="numeric"
          placeholder="PIN"
          placeholderTextColor="rgba(0,0,0,0.35)"
        />
      </Section>

      {requiresLicense ? (
        <Section title="License" hint="Mandatory for pharmacies.">
          <Text style={styles.label}>License No *</Text>
          <TextInput
            value={licenseNo}
            onChangeText={setLicenseNo}
            style={styles.input}
            placeholder="License number"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />

          <Text style={styles.label}>Valid till (YYYY-MM-DD) *</Text>
          <TextInput
            value={licenseValidTill}
            onChangeText={setLicenseValidTill}
            style={styles.input}
            placeholder="2028-12-31"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />
        </Section>
      ) : null}

      {(role === "vendor" || role === "pharmacist") ? (
        <Section title="Delivery" hint="We’ll store this later. For now it’s UI-only.">
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Offers delivery</Text>
            <Switch value={offersDelivery} onValueChange={setOffersDelivery} />
          </View>
        </Section>
      ) : null}

      <View style={{ height: 4 }} />

      <Pressable style={[styles.primaryBtn, !isValid && { opacity: 0.5 }]} onPress={save} disabled={!isValid || busy}>
        <Text style={styles.primaryBtnText}>{busy ? "Saving…" : "Save & Continue"}</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
        <Text style={styles.secondaryBtnText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  h1: { fontSize: 22, fontWeight: "900" },
  sub: { marginTop: 4, opacity: 0.75, fontWeight: "700" },

  section: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  sectionTitle: { fontWeight: "900", fontSize: 14, opacity: 0.9 },
  sectionHint: { marginTop: 4, opacity: 0.65, fontWeight: "700", fontSize: 12 },

  label: { marginTop: 12, marginBottom: 6, opacity: 0.8, fontWeight: "800" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.98)",
  },
  help: { opacity: 0.65, marginTop: 6, fontSize: 12, fontWeight: "700" },

  row: { flexDirection: "row", gap: 10 },

  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  switchLabel: { fontWeight: "900", opacity: 0.9 },

  primaryBtn: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  primaryBtnText: { textAlign: "center", fontWeight: "900" },

  secondaryBtn: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  secondaryBtnText: { textAlign: "center", fontWeight: "900", opacity: 0.9 },
});
