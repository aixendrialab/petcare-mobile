// src/features/vaccines/screens/VetConfirmPlanScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "react-native-paper";
import { fetchPetVaccinePlan, vetConfirmPlan } from "../api";
import type { PetPlanResponse, PlanOverrideIn } from "../types";

export default function VetConfirmPlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = Number(params.petId);
  const appointmentId = params.appointmentId ? Number(params.appointmentId) : undefined;

  const [data, setData] = useState<PetPlanResponse | null>(null);
  const [notes, setNotes] = useState("");
  const [overrides, setOverrides] = useState<Record<number, PlanOverrideIn>>({});
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!petId) return;
    fetchPetVaccinePlan(petId)
      .then(setData)
      .catch((e) => setErr(e?.message || "Failed to load"));
  }, [petId]);

  const due = data?.due_now ?? [];

  function setOverride(itemId: number, patch: Partial<PlanOverrideIn>) {
    setOverrides((prev) => {
      const base = prev[itemId] ?? { plan_item_id: itemId };
      return { ...prev, [itemId]: { ...base, ...patch } };
    });
  }

  const overrideList = useMemo(() => Object.values(overrides), [overrides]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>Confirm vaccination plan</Text>
      {!!err && <Text style={{ marginTop: 12, color: "crimson" }}>{err}</Text>}

      <Card style={{ padding: 12, marginTop: 12 }}>
        <Text style={{ fontWeight: "900" }}>{data?.pet?.name ?? "Pet"}</Text>
        <Text style={{ opacity: 0.7 }}>
          Current plan: {data?.plan?.status ?? "—"} • Pet ID: {petId}
        </Text>

        <Text style={{ marginTop: 10, opacity: 0.7 }}>Notes to parent</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, marginTop: 6, minHeight: 80 }}
          placeholder="Explain changes / advice…"
        />
      </Card>

      <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "900" }}>Due now</Text>
      <View style={{ marginTop: 10, gap: 10 }}>
        {due.length === 0 ? (
          <Card style={{ padding: 12 }}>
            <Text style={{ opacity: 0.7 }}>Nothing due right now.</Text>
          </Card>
        ) : (
          due.map((it) => (
            <Card key={it.id} style={{ padding: 12 }}>
              <Text style={{ fontWeight: "900" }}>{it.vaccine_name}</Text>
              <Text style={{ opacity: 0.7 }}>Due: {it.due_on}</Text>

              <Text style={{ marginTop: 10, opacity: 0.7 }}>Override due date (YYYY-MM-DD)</Text>
              <TextInput
                value={overrides[it.id]?.due_on ?? ""}
                onChangeText={(v) => setOverride(it.id, { due_on: v || undefined, reason: overrides[it.id]?.reason })}
                style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 10, marginTop: 6 }}
                placeholder="e.g. 2026-01-20"
              />

              <Text style={{ marginTop: 10, opacity: 0.7 }}>Reason</Text>
              <TextInput
                value={overrides[it.id]?.reason ?? ""}
                onChangeText={(v) => setOverride(it.id, { reason: v || undefined })}
                style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 10, marginTop: 6 }}
                placeholder="e.g. Pet unwell, postpone"
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <Pressable
                  onPress={() => setOverride(it.id, { status: "SKIPPED", reason: overrides[it.id]?.reason ?? "Skipped by vet" })}
                  style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
                >
                  <Text style={{ fontWeight: "800" }}>Skip</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    // clear override for this item
                    setOverrides((p) => {
                      const copy = { ...p };
                      delete copy[it.id];
                      return copy;
                    });
                  }}
                  style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
                >
                  <Text style={{ fontWeight: "800" }}>Clear</Text>
                </Pressable>
              </View>
            </Card>
          ))
        )}
      </View>

      <Pressable
        disabled={saving || !petId}
        onPress={async () => {
          try {
            setSaving(true);
            setErr(null);

            await vetConfirmPlan(petId, {
              appointment_id: appointmentId,
              notes: notes || undefined,
              overrides: overrideList,
            });

            // go back to appointment screen if present
            if (appointmentId) router.replace(`/vet/vaccines/appointment/${appointmentId}` as any);
            else router.back();
          } catch (e: any) {
            setErr(e?.message || "Failed to confirm plan");
          } finally {
            setSaving(false);
          }
        }}
        style={{ marginTop: 16, padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
      >
        <Text style={{ fontWeight: "900" }}>{saving ? "Saving…" : "Confirm plan"}</Text>
      </Pressable>
    </ScrollView>
  );
}
