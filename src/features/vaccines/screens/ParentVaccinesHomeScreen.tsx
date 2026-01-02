// src/features/vaccines/screens/ParentVaccinesHomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";
import { fetchVaccinesSummary } from "../api";
import type { PetVaccineSummary } from "../types";

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: "#eee", borderRadius: 999 }}>
      <Text style={{ fontSize: 12, opacity: 0.7 }}>{label}</Text>
      <Text style={{ fontWeight: "800" }}>{value}</Text>
    </View>
  );
}

export default function ParentVaccinesHomeScreen() {
  const router = useRouter();
  const [pets, setPets] = useState<PetVaccineSummary[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchVaccinesSummary()
      .then((r) => setPets(r.pets || []))
      .catch((e) => setErr(e?.message || "Failed to load"));
  }, []);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Vaccinations</Text>
      <Text style={{ opacity: 0.7, marginTop: 4 }}>Plans, due vaccines, and records</Text>

      {!!err && <Text style={{ marginTop: 12, color: "crimson" }}>{err}</Text>}

      <View style={{ marginTop: 14, gap: 12 }}>
        {pets.length === 0 ? (
          <Card style={{ padding: 14 }}>
            <Text style={{ opacity: 0.7 }}>No pets found. Add pets from Profile → Pets.</Text>
          </Card>
        ) : (
          pets.map((p) => (
            <Pressable
              key={p.pet_id}
              onPress={() => router.push({ pathname: "/parent/vaccines/pet", params: { petId: String(p.pet_id) } } as any)}
            >
              <Card style={{ padding: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: "800" }}>{p.pet_name}</Text>
                <Text style={{ opacity: 0.7, marginTop: 2 }}>
                  Plan: {p.plan_status ?? "—"}
                </Text>

                <View style={{ flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <StatPill label="Overdue" value={p.overdue} />
                  <StatPill label="Due" value={p.due} />
                  <StatPill label="Upcoming" value={p.upcoming} />
                  <StatPill label="Completed" value={p.completed} />
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: "/parent/vaccines/add-record", params: { petId: String(p.pet_id) } } as any)
                    }
                    style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
                  >
                    <Text style={{ fontWeight: "700" }}>Add record</Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push({ pathname: "/parent/vaccines/pet", params: { petId: String(p.pet_id) } } as any)
                    }
                    style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
                  >
                    <Text style={{ fontWeight: "700" }}>View plan</Text>
                  </Pressable>
                </View>
              </Card>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}
