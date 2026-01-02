// src/features/vaccines/screens/VetVaccinationRequestsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";
import { fetchVetVaccinationRequests } from "../api";
import type { VetVaccinationRequestItem } from "../types";

export default function VetVaccinationRequestsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<VetVaccinationRequestItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchVetVaccinationRequests()
      .then((r) => setItems(r.items || []))
      .catch((e) => setErr(e?.message || "Failed to load"));
  }, []);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Vaccination requests</Text>
      <Text style={{ opacity: 0.7, marginTop: 4 }}>Appointments with vaccination intent</Text>

      {!!err && <Text style={{ marginTop: 12, color: "crimson" }}>{err}</Text>}

      <View style={{ marginTop: 14, gap: 10 }}>
        {items.length === 0 ? (
          <Card style={{ padding: 14 }}>
            <Text style={{ opacity: 0.7 }}>No vaccination requests today.</Text>
          </Card>
        ) : (
          items.map((it) => (
            <Pressable
              key={it.appointment_id}
              onPress={() => router.push(`/vet/vaccines/appointment/${it.appointment_id}` as any)}
            >
              <Card style={{ padding: 12 }}>
                <Text style={{ fontWeight: "900" }}>
                  {it.pet_name} • {it.owner_name}
                </Text>
                <Text style={{ opacity: 0.7, marginTop: 2 }}>
                  {new Date(it.start_ts).toLocaleString()} • {it.location_name ?? "—"}
                </Text>
                <Text style={{ opacity: 0.7, marginTop: 2 }}>
                  Action: {it.requested_action} • Plan: {it.plan_status ?? "—"}
                </Text>
                {!!it.requested_vaccine_code && (
                  <Text style={{ opacity: 0.7, marginTop: 2 }}>
                    Requested: {it.requested_vaccine_code}
                  </Text>
                )}
              </Card>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}
