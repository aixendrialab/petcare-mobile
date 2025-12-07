import React, { useEffect, useState, FC } from "react";
import { View, Image, ScrollView } from "react-native";
import { Screen, Card } from "@/src/ui";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchParentConsultDetail } from "../api";
import { ParentConsultDetail } from "../types";

const ConsultDetailScreen: FC = () => {
  const { consultId } = useLocalSearchParams<{ consultId: string }>();
  const [detail, setDetail] = useState<ParentConsultDetail | null>(null);

  useEffect(() => {
    if (!consultId) return;

    (async () => {
      const data = await fetchParentConsultDetail(Number(consultId));
      setDetail(data);
    })();
  }, [consultId]);

  if (!detail) {
    return (
      <Screen title="Visit Summary">
        <Text>Loading...</Text>
      </Screen>
    );
  }

  const d = detail;

  return (
    <Screen title="Visit Summary">
      <ScrollView style={{ padding: 16 }}>
        
        {/* --------------------------- */}
        {/* Pet header card */}
        {/* --------------------------- */}
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {d.pet_avatar_url ? (
              <Image
                source={{ uri: d.pet_avatar_url }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  marginRight: 18,
                }}
              />
            ) : (
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: "#eee",
                  marginRight: 18,
                }}
              />
            )}

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: "800" }}>
                {d.pet_name}
              </Text>
              {d.clinic_name && (
                <Text style={{ opacity: 0.7 }}>{d.clinic_name}</Text>
              )}
              <Text style={{ opacity: 0.7 }}>
                Vet: {d.vet_name ?? "Veterinarian"}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 12, opacity: 0.6 }}>
                {new Date(d.date).toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Reason */}
        <Card title="Reason & Symptoms">
          {d.reason ? (
            <Text style={{ fontSize: 16 }}>{d.reason}</Text>
          ) : (
            <Text style={{ opacity: 0.5 }}>No symptoms recorded.</Text>
          )}
        </Card>

        {/* Vitals */}
        {d.vitals && (
          <Card title="Vitals">
            <VitalRow
              label="Weight"
              value={
                d.vitals.weight_kg != null
                  ? `${d.vitals.weight_kg} kg`
                  : null
              }
            />
            <VitalRow
              label="Temperature"
              value={
                d.vitals.temp_c != null
                  ? `${d.vitals.temp_c} °C`
                  : null
              }
            />
            <VitalRow
              label="Heart rate"
              value={
                d.vitals.heart_rate != null
                  ? `${d.vitals.heart_rate} bpm`
                  : null
              }
            />
            <VitalRow
              label="Resp rate"
              value={
                d.vitals.resp_rate != null
                  ? `${d.vitals.resp_rate} /min`
                  : null
              }
            />

            {d.vitals.notes && (
              <Text style={{ marginTop: 8, opacity: 0.7 }}>
                Notes: {d.vitals.notes}
              </Text>
            )}
          </Card>
        )}

        {/* Findings */}
        <Card title="Clinical Findings">
          <Text>{d.findings || "–"}</Text>
        </Card>

        {/* Diagnosis */}
        <Card title="Diagnosis">
          <Text style={{ fontSize: 16, color: "#c83a3a" }}>
            {d.diagnosis || "–"}
          </Text>
        </Card>

        {/* Prescription */}
        <Card title="Prescription">
          {d.medications.length === 0 ? (
            <Text>No medications prescribed.</Text>
          ) : (
            d.medications.map((m, idx) => (
              <View
                key={idx}
                style={{
                  paddingVertical: 10,
                  borderBottomWidth:
                    idx !== d.medications.length - 1 ? 1 : 0,
                  borderColor: "#eee",
                }}
              >
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  {m.name}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 6,
                  }}
                >
                  {m.dose && <Tag label={`Dose: ${m.dose}`} />}
                  {m.frequency && <Tag label={`Freq: ${m.frequency}`} />}
                  {m.days != null && <Tag label={`${m.days} days`} />}
                </View>

                {m.notes && (
                  <Text
                    style={{
                      marginTop: 6,
                      opacity: 0.7,
                      fontStyle: "italic",
                    }}
                  >
                    {m.notes}
                  </Text>
                )}
              </View>
            ))
          )}
        </Card>

        {/* Advice */}
        <Card title="Home Care & Advice">
          <Text>{d.advice || "–"}</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
};

export default ConsultDetailScreen;

/* ---------- helpers ---------- */

interface VitalRowProps {
  label: string;
  value?: string | null;
}

const VitalRow: FC<VitalRowProps> = ({ label, value }) => {
  if (!value) return null;
  return (
    <Text style={{ marginBottom: 4 }}>
      <Text style={{ fontWeight: "700" }}>{label}: </Text>
      {value}
    </Text>
  );
};

interface TagProps {
  label: string;
}

const Tag: FC<TagProps> = ({ label }) => (
  <View
    style={{
      backgroundColor: "#e8f0ff",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 6,
      marginBottom: 6,
    }}
  >
    <Text style={{ fontSize: 12, color: "#2457d6" }}>{label}</Text>
  </View>
);
