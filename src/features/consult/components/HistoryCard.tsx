// src/features/consult/components/HistoryCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Card } from "@/src/ui";

export function HistoryCard({ items }: { items: any[] }) {
  if (!items?.length)
    return <Text style={{ margin: 12, opacity: 0.6 }}>No past consults.</Text>;

  return (
    <View style={{ gap: 12 }}>
      {items.map((h) => (
        <Card key={h.id}>
          <Text style={{ fontWeight: "600" }}>{new Date(h.date).toDateString()}</Text>
          <Text>Reason: {h.reason || "-"}</Text>
          <Text>Diagnosis: {h.diagnosis || "-"}</Text>
        </Card>
      ))}
    </View>
  );
}
