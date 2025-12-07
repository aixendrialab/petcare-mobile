// mobile/app/vet/schedule.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { Screen, Card, Btn } from "@/src/ui";
import { api } from "@/src/api";
import { router } from "expo-router";

type VetLocation = { id: number; name: string };

type VetApptMini = {
  id: number;
  pet_id: number;
  pet_name: string;
  parent_name: string;
  slot_id: string;
  calendar_state: string;
  visit_state?: string;
  mode: "in_person" | "video";
};

type VetSlot = {
  start: string;
  end: string;
  status: "available" | "full" | "blocked" | "mixed" | "ad_hoc";
  capacity: number;
  booked: number;
  appointments: VetApptMini[];
};

export default function VetScheduleScreen() {
  const [locations, setLocations] = useState<VetLocation[]>([]);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [date, setDate] = useState(() => new Date());
  const [slots, setSlots] = useState<VetSlot[]>([]);

  const isoDate = date.toISOString().slice(0, 10);

  // Load vet locations
  useEffect(() => {
    async function loadLocations() {
      try {
        const r = await api.get<VetLocation[]>("/vet/locations");
        const list = r.data || [];
        setLocations(list);
        if (!locationId && list.length) {
          setLocationId(list[0].id);
        }
      } catch {
        setLocations([]);
      }
    }
    loadLocations();
  }, []);

  // Load schedule for date + location
  useEffect(() => {
    async function loadSlots() {
      if (!locationId) return;
      try {
        const r = await api.get<VetSlot[]>("/vet/schedule/day", {
          params: { location_id: locationId, date: isoDate },
        });
        setSlots(r.data || []);
      } catch {
        setSlots([]);
      }
    }
    loadSlots();
  }, [locationId, isoDate]);

  const reload = async () => {
    if (!locationId) return;
    const r = await api.get<VetSlot[]>("/vet/schedule/day", {
      params: { location_id: locationId, date: isoDate },
    });
    setSlots(r.data || []);
  };

  const onCancel = async (apptId: number) => {
    try {
      await api.post(`/appointments/${apptId}/cancel-by-vet`, {});
      await reload();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Unable to cancel appointment");
    }
  };

  const statusColor = (s: VetSlot["status"]) => {
    switch (s) {
      case "available":
        return "#1a936f";
      case "full":
        return "#6c5ce7";
      case "blocked":
        return "#b2bec3";
      case "ad_hoc":
        return "#fdcb6e";
      default:
        return "#0984e3";
    }
  };

  return (
    <Screen
      title="Schedule"
      subtitle="Open & booked slots"
      onBack={() => router.back()}
    >
      {/* Controls: date + clinic */}
      <Card style={{ padding: 12, marginHorizontal: 12, marginBottom: 12 }}>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>
          Select date & clinic
        </Text>

        {/* Date picker (same pattern as parent slots) */}
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={isoDate}
            onChange={(e) => {
              const d = new Date(e.target.value);
              if (!Number.isNaN(d.getTime())) setDate(d);
            }}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
              marginBottom: 8,
            }}
          />
        ) : (
          <Text style={{ marginBottom: 8 }}>{isoDate}</Text>
          // you can plug in @react-native-community/datetimepicker here later
        )}

        {/* Clinic pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {locations.map((loc) => (
            <Pressable
              key={loc.id}
              onPress={() => setLocationId(loc.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1,
                borderColor:
                  locationId === loc.id ? "#4c8bf5" : "rgba(0,0,0,0.1)",
                backgroundColor:
                  locationId === loc.id ? "rgba(76,139,245,0.08)" : "white",
                marginRight: 8,
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: locationId === loc.id ? "#1b4fba" : "#444",
                }}
              >
                {loc.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Card>

      {/* Schedule list */}
      <ScrollView style={{ paddingHorizontal: 12 }}>
        {slots.map((slot) => (
          <Card
            key={`${slot.start}-${slot.end}`}
            style={{
              padding: 14,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor: statusColor(slot.status),
              backgroundColor: "#fafaff",
            }}
          >
            {/* Header row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                {slot.start} – {slot.end}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 999,
                    backgroundColor: statusColor(slot.status),
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
                    {slot.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: "#555" }}>
                  {slot.booked}/{slot.capacity} booked
                </Text>
              </View>
            </View>

            {/* Body: appointments */}
            {slot.appointments.length === 0 ? (
              <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                No bookings yet – walk-ins only.
              </Text>
            ) : (
              slot.appointments.map((a) => {
                // -----------------------------
                // Determine consult button label
                // -----------------------------
                let consultLabel = "Start consult";

                if (a.calendar_state === "COMPLETED") {
                  consultLabel = "Completed";
                } else if (
                  a.calendar_state === "ARRIVED" ||
                  a.calendar_state === "IN_CONSULT"
                ) {
                  consultLabel = "Resume consult";
                }

                return (
                  <View
                    key={a.id}
                    style={{
                      marginTop: 8,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "#e4e7ff",
                    }}
                  >
                    <Text style={{ fontWeight: "700", marginBottom: 2 }}>
                      🐶 {a.pet_name} • 👤 {a.parent_name}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      {a.mode === "video" ? "🎦 Video consult" : "🩺 In-clinic"}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      State: {a.calendar_state}
                      {a.visit_state ? ` • Visit: ${a.visit_state}` : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#444",
                        marginTop: 4,
                      }}
                    >
                      Booking ID: {a.slot_id}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 8,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {/* -----------------------------
               CONSULT BUTTON LOGIC
             ----------------------------- */}

                      {a.calendar_state === "COMPLETED" ? (
                        // COMPLETED — show indicator, no button
                        <Text
                          style={{
                            color: "green",
                            fontWeight: "700",
                            fontSize: 14,
                          }}
                        >
                          ✓ Completed
                        </Text>
                      ) : (
                        // START or RESUME consult
                        <Btn
                          title={consultLabel}
                          onPress={() =>
                            router.push({
                              pathname: "/vet/consult",
                              params: {
                                appointment_id: a.id,
                                pet_id: a.pet_id,
                              },
                            })
                          }
                        />
                      )}

                      <View style={{ width: 8 }} />

                      {/* Cancel button allowed only if not completed */}
                      {a.calendar_state !== "COMPLETED" && (
                        <Btn
                          title="Cancel"
                          variant="secondary"
                          onPress={() => onCancel(a.id)}
                        />
                      )}
                    </View>
                  </View>
                );
              })
            )}

          </Card>
        ))}

        {slots.length === 0 && (
          <Text style={{ padding: 16, color: "#666" }}>
            No slots configured for this date. Configure Slot Settings to open
            your schedule.
          </Text>
        )}
      </ScrollView>
    </Screen>
  );
}
