import React, { useEffect, useState } from "react";
import { Screen } from "@/src/ui";
import { useLocalSearchParams, router } from "expo-router";
import { Text } from "react-native-paper";
import { AppointmentCard } from "@/src/features/parent/components/AppointmentCard";
import { Appt } from "@/src/features/parent/booking/types";
import { fetchParentAppointmentById } from "@/src/features/parent/api";

export default function ParentAppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [appt, setAppt] = useState<Appt | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchParentAppointmentById(Number(id));
      setAppt(data);
    } catch (e) {
      setAppt(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const isUpcoming = appt?.calendar_state === "BOOKED";

  return (
    <Screen title="Appointment" onBack={() => router.back()}>
      {loading && <Text>Loading…</Text>}

      {!loading && !appt && <Text>Appointment not found.</Text>}

      {appt && (
        <AppointmentCard
          appt={appt}
          reload={load}
          // ✅ Past appointments become view-only (no cancel/reschedule)
          showActions={!!isUpcoming}
        />
      )}
    </Screen>
  );
}
