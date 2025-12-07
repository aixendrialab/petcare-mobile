import React, { useState, useEffect } from "react";
import { ScrollView, Pressable, Text, View, Platform } from "react-native";
import { Screen, Card } from "@/src/ui";
import { router, useLocalSearchParams } from "expo-router";
import type { Slot } from "../types";
import { fetchClinicSlots } from "../api";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  mode?: "new" | "reschedule";
  appt_id?: string;
  pet_id?: string;
  pet_name?: string;
  vet_id?: string;
  vet_name: string;
  start_ts?: string;
  end_ts?: string;
  location_id?: string;
  location_name?: string;
};

export default function SlotsScreen(p: Props) {
  const params = useLocalSearchParams();

  // --------- combine props + URL params safely ----------
  const mode = (p.mode ?? params.mode ?? "new") as "new" | "reschedule";

  const appt_id = p.appt_id ?? (params.appt_id as string | undefined);
  const pet_id = p.pet_id ?? (params.pet_id as string | undefined);
  const pet_name = p.pet_name ?? (params.pet_name as string | undefined);

  const location_id =
    p.location_id ?? (params.location_id as string | undefined);
  const location_name =
    p.location_name ?? (params.location_name as string | undefined);

  const vet_id = p.vet_id ?? (params.vet_id as string | undefined);
  const vet_name = p.vet_name ?? (params.vet_name as string | undefined);

  const line1 = (params.line1 as string | undefined) ?? "";
  const city = (params.city as string | undefined) ?? "";

  // --------- state ----------
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isoDate = selectedDate.toISOString().slice(0, 10);

  // --------- load slots ----------
  useEffect(() => {
    console.log("📌 useEffect triggered with:", { location_id, isoDate });

    if (!location_id) {
      console.log("❌ location_id missing → not loading slots");
      return;
    }

    async function load() {
      const list = await fetchClinicSlots(Number(location_id), isoDate).catch(
        () => []
      );
      setSlots(list);
    }

    load();
  }, [location_id, isoDate]);

  // --------- navigation helpers (IMPORTANT: take Slot as arg) ----------
  function goToConfirmReschedule(slot: Slot) {
    return router.push({
      pathname: "/parent/book/confirm-reschedule",
      params: {
        appt_id: String(appt_id ?? ""),
        pet_id: String(pet_id ?? ""),
        pet_name: pet_name ?? "",
        location_id: String(location_id ?? ""),
        location_name: location_name ?? "",
        vet_id: String(vet_id ?? ""),
        vet_name: vet_name ?? "",
        date: isoDate,
        start: slot.start,
        end: slot.end,
      },
    });
  }

  function goToSelectPet(slot: Slot) {
    return router.push({
      pathname: "/parent/book/pet",
      params: {
        location_id: String(location_id ?? ""),
        location_name: location_name ?? "",
        vet_id: String(vet_id ?? ""),
        vet_name: vet_name ?? "",
        line1,
        city,
        date: isoDate,
        start: slot.start,
        end: slot.end,
      },
    });
  }

  // --------- slot status badge ----------
  const renderStatus = (s: Slot) => {
    switch (s.status) {
      case "available":
        return (
          <Text style={{ color: "green", fontWeight: "600" }}>Available</Text>
        );
      case "full":
        return <Text style={{ color: "red", fontWeight: "600" }}>Full</Text>;
      case "blocked":
        return <Text style={{ color: "gray", fontWeight: "600" }}>Blocked</Text>;
      default:
        return null;
    }
  };

  return (
    <Screen title="Pick a Slot">
      {/* DATE PICKER */}
      <Card style={{ padding: 14, margin: 12 }}>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>Select Date</Text>

        {Platform.OS === "web" ? (
          <input
            type="date"
            value={isoDate}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            style={{
              padding: 10,
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            onChange={(e, d) => d && setSelectedDate(d)}
          />
        )}
      </Card>

      {/* CLINIC HEADER */}
      <Card style={{ padding: 14, margin: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          {location_name}
        </Text>
        <Text style={{ color: "#555", marginTop: 4 }}>{line1}</Text>
        <Text style={{ color: "#555" }}>{city}</Text>

        <Text style={{ marginTop: 8, fontWeight: "600" }}>
          Dr. {vet_name}
        </Text>
      </Card>

      {/* SLOTS */}
      <ScrollView style={{ padding: 16 }}>
        {slots.length === 0 && (
          <Text style={{ padding: 20, opacity: 0.6 }}>
            No slots available for this date.
          </Text>
        )}

        {slots.map((s) => (
          <Pressable
            key={`${s.start}-${s.end}`}
            disabled={s.status !== "available"}
            onPress={() => {
              if (mode === "reschedule") {
                goToConfirmReschedule(s);
              } else {
                goToSelectPet(s);
              }
            }}
          >
            <Card
              style={{
                padding: 14,
                marginBottom: 14,
                opacity: s.status === "available" ? 1 : 0.5,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "700", marginBottom: 6 }}
              >
                {s.start} – {s.end}
              </Text>

              <View style={{ marginTop: 8 }}>{renderStatus(s)}</View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}
