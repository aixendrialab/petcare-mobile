// src/features/consult/components/CurrentVisitCard.tsx
import React from "react";
import { View, TextInput, Text } from "react-native";
import { Card } from "@/src/ui";

export function CurrentVisitCard({
  symptoms,
  diagnosis,
  notes,
  setSymptoms,
  setDiagnosis,
  setNotes,
}: any) {
  return (
    <Card style={{ marginTop: 16 }}>
      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Current Visit Notes</Text>

      <TextInput
        value={symptoms}
        onChangeText={setSymptoms}
        placeholder="Symptoms"
        style={{ marginVertical: 8 }}
      />

      <TextInput
        value={diagnosis}
        onChangeText={setDiagnosis}
        placeholder="Diagnosis"
        style={{ marginVertical: 8 }}
      />

      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        multiline
        style={{ marginVertical: 8 }}
      />
    </Card>
  );
}
