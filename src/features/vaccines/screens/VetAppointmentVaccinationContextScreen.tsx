// src/features/vaccines/screens/VetAppointmentVaccinationContextScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "react-native-paper";
import { fetchVetAppointmentVaccinationContext } from "../api";
import type { VetAppointmentVaccinationContext } from "../types";

export default function VetAppointmentVaccinationContextScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const appointmentId = Number(params.appointmentId);

  const [data, setData] = useState<VetAppointmentVaccinationContext | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!appointmentId) return;
    fetchVetAppointmentVaccinationContext(appointmentId)
      .then(setData)
      .catch((e) => setErr(e?.message || "Failed to load"));
  }, [appointmentId]);

  if (!appointmentId) return <Text style={{ padding: 16 }}>Missing appointmentId</Text>;

  const petId = data?.pet?.id;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Vaccination context</Text>
      {!!err && <Text style={{ marginTop: 12, color: "crimson" }}>{err}</Text>}

      {data && (
        <>
          <Card style={{ padding: 12, marginTop: 12 }}>
            <Text style={{ fontWeight: "900" }}>{data.pet.name}</Text>
            <Text style={{ opacity: 0.7 }}>
              Owner: {data.owner_name} • Plan: {data.plan_status ?? "—"}
            </Text>
            <Text style={{ opacity: 0.7 }}>
              Breed: {data.pet.breed ?? "—"} • DOB: {data.pet.dob ?? "—"}
            </Text>
          </Card>

          <Card style={{ padding: 12, marginTop: 12 }}>
            <Text style={{ fontWeight: "900" }}>Intent</Text>
            {data.intent ? (
              <>
                <Text style={{ opacity: 0.7, marginTop: 4 }}>
                  Action: {data.intent.requested_action}
                </Text>
                <Text style={{ opacity: 0.7 }}>
                  Vaccine: {data.intent.requested_vaccine_code ?? "—"}
                </Text>
                {!!data.intent.parent_notes && (
                  <Text style={{ opacity: 0.7, marginTop: 4 }}>{data.intent.parent_notes}</Text>
                )}
              </>
            ) : (
              <Text style={{ opacity: 0.7, marginTop: 4 }}>No explicit intent</Text>
            )}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/vet/vaccines/add-record",
                    params: { petId: String(petId), appointmentId: String(appointmentId) },
                  } as any)
                }
                style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
              >
                <Text style={{ fontWeight: "800" }}>Add record</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/vet/vaccines/confirm-plan",
                    params: { petId: String(petId), appointmentId: String(appointmentId) },
                  } as any)
                }
                style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#eee", borderRadius: 12 }}
              >
                <Text style={{ fontWeight: "800" }}>Confirm plan</Text>
              </Pressable>
            </View>
          </Card>

          <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "900" }}>Due now</Text>
          <View style={{ marginTop: 10, gap: 10 }}>
            {data.due_now.length === 0 ? (
              <Card style={{ padding: 12 }}>
                <Text style={{ opacity: 0.7 }}>Nothing due right now.</Text>
              </Card>
            ) : (
              data.due_now.map((it) => (
                <Card key={it.id} style={{ padding: 12 }}>
                  <Text style={{ fontWeight: "900" }}>{it.vaccine_name} {it.dose_no ? `• Dose ${it.dose_no}` : "• Booster"}</Text>
                  <Text style={{ opacity: 0.7 }}>Due: {it.due_on}</Text>
                </Card>
              ))
            )}
          </View>

          <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "900" }}>Recent records</Text>
          <View style={{ marginTop: 10, gap: 10 }}>
            {data.records.length === 0 ? (
              <Card style={{ padding: 12 }}>
                <Text style={{ opacity: 0.7 }}>No records found.</Text>
              </Card>
            ) : (
              data.records.slice(0, 10).map((r) => (
                <Card key={r.id} style={{ padding: 12 }}>
                  <Text style={{ fontWeight: "900" }}>{r.vaccine_name}</Text>
                  <Text style={{ opacity: 0.7 }}>Given: {r.last_given ?? "—"}</Text>
                </Card>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}
