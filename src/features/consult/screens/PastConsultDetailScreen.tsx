import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Screen, Card } from "@/src/ui";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/src/api";
import { MedicationDraft } from "../types";

interface PastConsultDetail {
  id: number;
  date: string;
  reason: string;
  findings?: string;
  diagnosis?: string;
  advice?: string;
  vitals?: {
    weight_kg?: number | null;
    temp_c?: number | null;
    heart_rate?: number | null;
    resp_rate?: number | null;
    notes?: string | null;
  };
  medications: MedicationDraft[];
}

async function fetchPastConsultDetail(id: number): Promise<PastConsultDetail> {
  const { data } = await api.get(`/consults/past/${id}`);
  return data;
}

export default function PastConsultDetailScreen() {
  const { consult_id } = useLocalSearchParams<{ consult_id?: string }>();
  const [detail, setDetail] = useState<PastConsultDetail | null>(null);

  useEffect(() => {
    if (!consult_id) return;

    (async () => {
      const d = await fetchPastConsultDetail(Number(consult_id));
      setDetail(d);
    })();
  }, [consult_id]);

  if (!detail) {
    return (
      <Screen title="Consult Details">
        <Text>Loading…</Text>
      </Screen>
    );
  }

  const { date, reason, diagnosis, findings, advice, vitals, medications } = detail;

  return (
    <Screen
      title="Consult Details"
      subtitle={new Date(date).toLocaleString()}
      onBack={() => history.back()}
    >
      {/* REASON */}
      <Card title="Reason for Visit">
        <Text style={{ fontSize: 14, lineHeight: 20 }}>
          {reason || "—"}
        </Text>
      </Card>

      {/* DIAGNOSIS */}
      <Card title="Diagnosis">
        <Text style={{ fontSize: 14, lineHeight: 20 }}>
          {diagnosis || "—"}
        </Text>
      </Card>

      {/* FINDINGS */}
      {findings ? (
        <Card title="Clinical Findings">
          <Text style={{ fontSize: 14, lineHeight: 20 }}>{findings}</Text>
        </Card>
      ) : null}

      {/* VITALS */}
      {vitals && (
        <Card title="Vitals">
          <View style={{ gap: 4 }}>
            <Text>Weight: {vitals.weight_kg ?? "—"} kg</Text>
            <Text>Temperature: {vitals.temp_c ?? "—"} °C</Text>
            <Text>Heart Rate: {vitals.heart_rate ?? "—"} bpm</Text>
            <Text>Resp. Rate: {vitals.resp_rate ?? "—"} rpm</Text>
            {vitals.notes && (
              <Text style={{ marginTop: 6 }}>
                Notes: {vitals.notes}
              </Text>
            )}
          </View>
        </Card>
      )}

      {/* MEDICATIONS */}
      <Card title="Medications">
        {(!medications || medications.length === 0) && (
          <Text>No medications prescribed.</Text>
        )}

        <View style={{ gap: 8, marginTop: 4 }}>
          {medications.map((m, i) => (
            <View
              key={i}
              style={{
                padding: 12,
                borderRadius: 10,
                backgroundColor: "#f8f5ff",
                borderWidth: 1,
                borderColor: "#e3d8ff",
              }}
            >
              <Text style={{ fontWeight: "700", marginBottom: 4 }}>
                {m.name}
              </Text>
              <Text>Dose: {m.dose || "—"}</Text>
              <Text>Frequency: {m.frequency || "—"}</Text>
              <Text>Days: {m.days || "—"}</Text>
              {m.notes && (
                <Text style={{ marginTop: 4 }}>Notes: {m.notes}</Text>
              )}
            </View>
          ))}
        </View>
      </Card>

      {/* ADVICE */}
      {advice && (
        <Card title="Advice / Follow-up">
          <Text style={{ fontSize: 14, lineHeight: 20 }}>{advice}</Text>
        </Card>
      )}
    </Screen>
  );
}
