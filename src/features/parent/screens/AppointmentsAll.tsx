import React, { useEffect, useState } from "react";
import { Screen } from "@/src/ui";
import {
    fetchParentUpcomingAppointments
} from "@/src/features/parent/api";
import { Text } from "react-native";
import { router } from "expo-router";
import { AppointmentCard } from "../components/AppointmentCard";
import { Appt } from "../booking/types";

export default function ParentAppointmentsAll() {
    const [items, setItems] = useState<Appt[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const data = await fetchParentUpcomingAppointments(50);
            setItems(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    return (
        <Screen title="All Appointments" onBack={() => router.back()}>
            {loading && <Text>Loading…</Text>}

            {!loading && items.length === 0 && (
                <Text>No upcoming appointments</Text>
            )}

            {items.map(a => (
                <AppointmentCard
                    key={a.id}
                    appt={a}
                    reload={load}
                    showActions
                />
            ))}
        </Screen>
    );
}
