import React from "react";
import { Card, Btn } from "@/src/ui";
import { View, Text } from "react-native";
import {
    parentCancelAppointment
} from "../api";
import { router } from "expo-router";
import { Appt } from "../booking/types";

interface Props {
    appt: Appt;
    reload?: () => void;     // optional reload handler
    showActions?: boolean;   // allow hiding buttons for read-only mode
}

function reschedule(appt: Appt) {
    return () => {
        router.push({
            pathname: "/parent/book/slots",
            params: {
                mode: "reschedule",
                appt_id: String(appt.id),
                pet_id: String(appt.pet_id),
                pet_name: appt.pet_name,
                location_id: String(appt.location_id),
                location_name: appt.location_name,
                vet_id: String(appt.vet_id),
                vet_name: appt.vet_name,
                start_ts: appt.start_ts,
                end_ts: appt.end_ts
            }
        });
    }
}

export function AppointmentCard({ appt, reload, showActions = true }: Props) {
    async function cancel() {
        await parentCancelAppointment(appt.id);
        reload?.();
    }

    return (
        <Card title={`${appt.pet_name} with ${appt.vet_name}`}>
            <Text>🏥 {appt.location_name}</Text>
            <Text>⏰ {new Date(appt.start_ts).toLocaleString()}</Text>
            <Text>🎫 Booking ID: {appt.slot_id}</Text>

            {showActions && (
                <View style={{ flexDirection: "row", marginTop: 12 }}>
                    <Btn title="Cancel" variant="secondary" onPress={cancel} />
                    <View style={{ width: 12 }} />
                    <Btn
                        title="Reschedule"
                        onPress={reschedule(appt)}
                    />
                </View>
            )}
        </Card>
    );
}
