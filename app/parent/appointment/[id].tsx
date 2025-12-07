import React, { useEffect, useState } from "react";
import { Screen } from "@/src/ui";
import { useLocalSearchParams, router } from "expo-router";
import { fetchParentUpcomingAppointments } from "@/src/features/parent/api";
import { AppointmentCard } from "@/src/features/parent/components/AppointmentCard";
import { Text } from "react-native-paper";
import { Appt } from "@/src/features/parent/booking/types";

export default function ParentAppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [appt, setAppt] = useState<Appt | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!id) return;
    setLoading(true);
    const all = await fetchParentUpcomingAppointments(50);
    const found = all.find((a) => a.id === Number(id)) || null;
    setAppt(found);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <Screen title="Appointment" onBack={() => router.back()}>
      {loading && <Text>Loading…</Text>}

      {!loading && !appt && (
        <Text>Appointment not found or not upcoming.</Text>
      )}

      {appt && (
        <AppointmentCard appt={appt} reload={load} showActions />
      )}
    </Screen>
  );
}
