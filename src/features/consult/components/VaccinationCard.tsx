// src/features/consult/components/VaccinationCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Card } from "@/src/ui";

export function VaccinationCard({ items }: { items: any[] }) {
  if (!items?.length)
    return <Text style={{ margin: 12, opacity: 0.6 }}>No vaccination records.</Text>;

  return (
    <View style={{ gap: 12 }}>
      {items.map((v) => (
        <Card key={v.id}>
          <Text style={{ fontWeight: "600" }}>{v.vaccine_name}</Text>
          <Text>Status: {v.status}</Text>
          <Text>Last given: {v.last_given || "-"}</Text>
          <Text>Next due: {v.next_due || "-"}</Text>
        </Card>
      ))}
    </View>
  );
}
