// src/features/consult/components/PrescriptionCard.tsx
import React from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { Card } from "@/src/ui";

export function PrescriptionCard({ meds, setMeds }: any) {
  function update(index: number, field: string, value: string) {
    const copy = [...meds];
    copy[index][field] = value;
    setMeds(copy);
  }

  function addRow() {
    setMeds([...meds, { name: "", dose: "", freq: "", days: "" }]);
  }

  return (
    <Card style={{ marginTop: 16 }}>
      <Text style={{ fontWeight: "600", marginBottom: 10 }}>
        Prescription
      </Text>

      {meds.map((m: any, idx: number) => (
        <View key={idx} style={{ marginBottom: 12, gap: 6 }}>
          <TextInput
            placeholder="Medicine name"
            value={m.name}
            onChangeText={(t) => update(idx, "name", t)}
          />
          <TextInput
            placeholder="Dose"
            value={m.dose}
            onChangeText={(t) => update(idx, "dose", t)}
          />
          <TextInput
            placeholder="Frequency"
            value={m.freq}
            onChangeText={(t) => update(idx, "freq", t)}
          />
          <TextInput
            placeholder="Days"
            value={m.days}
            onChangeText={(t) => update(idx, "days", t)}
          />
        </View>
      ))}

      <Pressable onPress={addRow}>
        <Text style={{ color: "#0066cc", marginTop: 6 }}>+ Add medicine</Text>
      </Pressable>
    </Card>
  );
}
