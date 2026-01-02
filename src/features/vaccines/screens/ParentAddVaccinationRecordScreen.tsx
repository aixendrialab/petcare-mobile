// src/features/vaccines/screens/ParentAddVaccinationRecordScreen.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "react-native-paper";
import { createVaccinationRecord } from "../api";

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function ParentAddVaccinationRecordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params.petId ? Number(params.petId) : undefined;

  const [pet_id, setPetId] = useState<string>(petId ? String(petId) : "");
  const [vaccine_code, setCode] = useState("");
  const [vaccine_name, setName] = useState("");
  const [last_given, setLastGiven] = useState(todayISO());
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Add vaccination record</Text>
      <Text style={{ opacity: 0.7, marginTop: 4 }}>You can add a past vaccine from card / memory</Text>

      {!!err && <Text style={{ marginTop: 12, color: "crimson" }}>{err}</Text>}

      <Card style={{ padding: 14, marginTop: 14 }}>
        <Text style={{ fontWeight: "800" }}>Details</Text>

        <Text style={{ marginTop: 10, opacity: 0.7 }}>Pet ID</Text>
        <TextInput
          value={pet_id}
          onChangeText={setPetId}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, marginTop: 6 }}
          placeholder="e.g. 10"
        />

        <Text style={{ marginTop: 10, opacity: 0.7 }}>Vaccine code (optional)</Text>
        <TextInput
          value={vaccine_code}
          onChangeText={setCode}
          style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, marginTop: 6 }}
          placeholder="RABIES"
        />

        <Text style={{ marginTop: 10, opacity: 0.7 }}>Vaccine name</Text>
        <TextInput
          value={vaccine_name}
          onChangeText={setName}
          style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, marginTop: 6 }}
          placeholder="Rabies"
        />

        <Text style={{ marginTop: 10, opacity: 0.7 }}>Given on</Text>
        <TextInput
          value={last_given}
          onChangeText={setLastGiven}
          style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, marginTop: 6 }}
          placeholder="YYYY-MM-DD"
        />

        <Text style={{ marginTop: 10, opacity: 0.7 }}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, marginTop: 6, minHeight: 90 }}
          placeholder="Anything to remember…"
        />

        <Pressable
          disabled={saving}
          onPress={async () => {
            try {
              setSaving(true);
              setErr(null);

              const pid = Number(pet_id);
              if (!pid) throw new Error("pet_id required");
              if (!vaccine_code && !vaccine_name) throw new Error("Provide vaccine_code or vaccine_name");

              await createVaccinationRecord({
                pet_id: pid,
                vaccine_code: vaccine_code || undefined,
                vaccine_name: vaccine_name || undefined,
                last_given,
                notes: notes || undefined,
              });

              // back to pet plan if we have petId
              if (pid) {
                router.replace({ pathname: "/parent/vaccines/pet", params: { petId: String(pid) } } as any);
              } else {
                router.back();
              }
            } catch (e: any) {
              setErr(e?.message || "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          style={{ marginTop: 14, padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
        >
          <Text style={{ fontWeight: "800" }}>{saving ? "Saving…" : "Save record"}</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}
