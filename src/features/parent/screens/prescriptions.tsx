import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";

import type { Rx } from "@/src/features/parent/types";
import { fetchParentPrescriptions } from "@/src/features/parent/api";

export default function ParentPrescriptionsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Rx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchParentPrescriptions(50);
        setItems(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 16 }}>← Back</Text>
      </Pressable>

      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>Prescriptions</Text>

      {loading ? (
        <Text>Loading…</Text>
      ) : items.length === 0 ? (
        <Text style={{ opacity: 0.7 }}>No prescriptions yet.</Text>
      ) : (
        items.map((rx) => (
          <Pressable
            key={rx.id}
            onPress={() =>
              router.push({
                pathname: "/parent/consult/[consultId]",
                params: { consultId: String(rx.consult_id) },
              } as any)
            }
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "700" }}>{rx.drug}</Text>
            <Text style={{ opacity: 0.8 }}>
              {rx.pet_name} • {rx.vet_name ?? "Vet"} • {rx.clinic_name ?? ""}
            </Text>
            <Text style={{ opacity: 0.8 }}>
              {rx.dose ? `Dose: ${rx.dose}  ` : ""}
              {rx.frequency ? `Freq: ${rx.frequency}  ` : ""}
              {rx.days ? `Days: ${rx.days}` : ""}
            </Text>
            <Text style={{ opacity: 0.7 }}>
              {rx.status} • {new Date(rx.created_at).toLocaleString()}
            </Text>
            {!!rx.notes && <Text style={{ opacity: 0.7 }}>Notes: {rx.notes}</Text>}
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
