// src/features/vaccines/screens/ParentPetVaccinesPlanScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "react-native-paper";
import { acceptPetPlan, fetchPetVaccinePlan } from "../api";
import type { PetPlanResponse, VaccinePlanItem } from "../types";

function ItemRow({ it, onAdd, onBook }: { it: VaccinePlanItem; onAdd: () => void; onBook?: () => void }) {
  return (
    <Card style={{ padding: 12 }}>
      <Text style={{ fontWeight: "800" }}>{it.vaccine_name} {it.dose_no ? `• Dose ${it.dose_no}` : "• Booster"}</Text>
      <Text style={{ opacity: 0.7, marginTop: 2 }}>Due: {it.due_on} • Status: {it.status}</Text>
      {it.overridden && <Text style={{ opacity: 0.6, marginTop: 2 }}>Override: {it.override_reason ?? "—"}</Text>}

      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        <Pressable
          onPress={onAdd}
          style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
        >
          <Text style={{ fontWeight: "700" }}>Add record</Text>
        </Pressable>

        {!!onBook && (
          <Pressable
            onPress={onBook}
            style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
          >
            <Text style={{ fontWeight: "700" }}>Book vet</Text>
          </Pressable>
        )}
      </View>
    </Card>
  );
}

export default function ParentPetVaccinesPlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = Number(params.petId);

  const [data, setData] = useState<PetPlanResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      const r = await fetchPetVaccinePlan(petId);
      setData(r);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    }
  }

  useEffect(() => {
    if (!petId) return;
    load();
  }, [petId]);

  if (!petId) return <Text style={{ padding: 16 }}>Missing petId</Text>;

  const planStatus = data?.plan?.status ?? "—";
  const petName = data?.pet?.name ?? "Pet";

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>{petName} • Vaccinations</Text>
      <Text style={{ opacity: 0.7, marginTop: 4 }}>Plan: {planStatus}</Text>

      {!!err && <Text style={{ marginTop: 12, color: "crimson" }}>{err}</Text>}

      {/* Header actions */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        <Pressable
          onPress={() => router.push({ pathname: "/parent/vaccines/add-record", params: { petId: String(petId) } } as any)}
          style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
        >
          <Text style={{ fontWeight: "700" }}>Add record</Text>
        </Pressable>

        <Pressable
          onPress={load}
          style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
        >
          <Text style={{ fontWeight: "700" }}>Refresh</Text>
        </Pressable>
      </View>

      {/* Plan accept nudge */}
      {data?.plan?.status === "SUGGESTED" && (
        <Card style={{ padding: 12, marginTop: 12 }}>
          <Text style={{ fontWeight: "800" }}>Suggested plan</Text>
          <Text style={{ opacity: 0.7, marginTop: 4 }}>
            You can proceed with this schedule and ask the vet to confirm during your next visit.
          </Text>
          <Pressable
            onPress={async () => {
              await acceptPetPlan(petId);
              await load();
            }}
            style={{ marginTop: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
          >
            <Text style={{ fontWeight: "700" }}>Accept plan</Text>
          </Pressable>
        </Card>
      )}

      {/* Due now */}
      <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "800" }}>Due / Overdue</Text>
      <View style={{ marginTop: 10, gap: 10 }}>
        {(data?.due_now ?? []).length === 0 ? (
          <Card style={{ padding: 12 }}>
            <Text style={{ opacity: 0.7 }}>Nothing due right now.</Text>
          </Card>
        ) : (
          data!.due_now.map((it) => (
            <ItemRow
              key={it.id}
              it={it}
              onAdd={() => router.push({ pathname: "/parent/vaccines/add-record", params: { petId: String(petId) } } as any)}
              onBook={() => router.push("/parent/book" as any)} // later you can prefill intent
            />
          ))
        )}
      </View>

      {/* Upcoming */}
      <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "800" }}>Upcoming</Text>
      <View style={{ marginTop: 10, gap: 10 }}>
        {(data?.upcoming ?? []).length === 0 ? (
          <Card style={{ padding: 12 }}>
            <Text style={{ opacity: 0.7 }}>No upcoming items.</Text>
          </Card>
        ) : (
          data!.upcoming.slice(0, 12).map((it) => (
            <ItemRow
              key={it.id}
              it={it}
              onAdd={() => router.push({ pathname: "/parent/vaccines/add-record", params: { petId: String(petId) } } as any)}
            />
          ))
        )}
      </View>

      {/* Records */}
      <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "800" }}>Records</Text>
      <View style={{ marginTop: 10, gap: 10 }}>
        {(data?.records ?? []).length === 0 ? (
          <Card style={{ padding: 12 }}>
            <Text style={{ opacity: 0.7 }}>No records yet.</Text>
          </Card>
        ) : (
          data!.records.slice(0, 10).map((r) => (
            <Card key={r.id} style={{ padding: 12 }}>
              <Text style={{ fontWeight: "800" }}>{r.vaccine_name}</Text>
              <Text style={{ opacity: 0.7 }}>Given: {r.last_given ?? "—"}</Text>
              {!!r.notes && <Text style={{ opacity: 0.6, marginTop: 2 }}>{r.notes}</Text>}
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}
