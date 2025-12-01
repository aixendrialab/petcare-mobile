import React, { useState, useEffect } from "react";
import { ScrollView, Pressable, Text, View, Platform } from "react-native";
import { Screen, Card } from "@/src/ui";
import { router, useLocalSearchParams } from "expo-router";
import type { Slot, Clinic } from "../types";
import { fetchClinicSlots } from "../api";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SlotsScreen() {
    const { location_id, clinic_name, vet_id, vet_name, line1, city } =
        useLocalSearchParams();

    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const isoDate = selectedDate.toISOString().slice(0, 10);

    useEffect(() => {
        async function load() {
            const list = await fetchClinicSlots(Number(location_id), isoDate).catch(() => []);
            setSlots(list);
        }
        if (location_id) load();
    }, [location_id, isoDate]);


    const renderStatus = (s: Slot) => {
        switch (s.status) {
            case "available":
                return <Text style={{ color: "green", fontWeight: "600" }}>Available</Text>;
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
            {/* --- NEW CLINIC HEADER --- */}
            <Card style={{ padding: 14, margin: 12 }}>
                <Text style={{ fontWeight: "600", marginBottom: 8 }}>Select Date</Text>

                {Platform.OS === "web" ? (
                    // Web browser: use native HTML date picker
                    <input
                        type="date"
                        value={isoDate}
                        onChange={(e) => {
                            const d = new Date(e.target.value);
                            setSelectedDate(d);
                        }}
                        style={{
                            padding: 10,
                            fontSize: 16,
                            borderRadius: 6,
                            border: "1px solid #ccc",
                        }}
                    />
                ) : (
                    // Mobile: real native date picker
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        onChange={(e, d) => d && setSelectedDate(d)}
                    />
                )}
            </Card>

            <Card style={{ padding: 14, margin: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    {clinic_name}
                </Text>
                <Text style={{ color: "#555", marginTop: 4 }}>
                    {line1}
                </Text>
                <Text style={{ color: "#555" }}>{city}</Text>

                <Text style={{ marginTop: 8, fontWeight: "600" }}>
                    Dr. {vet_name}
                </Text>
            </Card>
            <ScrollView style={{ padding: 16 }}>
                {slots.map((s) => (
                    <Pressable
                        key={`${s.start}-${s.end}`}
                        disabled={s.status !== "available"}
                        onPress={() =>
                            router.push({
                                pathname: "/parent/book/pet",
                                params: {
                                    location_id,
                                    clinic_name,
                                    vet_id,
                                    vet_name,
                                    line1,
                                    city,
                                    date: isoDate,
                                    start: s.start,
                                    end: s.end
                                },
                            })
                        }
                    >
                        <Card
                            style={{
                                padding: 14,
                                marginBottom: 14,
                                opacity: s.status === "available" ? 1 : 0.5,
                            }}
                        >
                            {/* Time range */}
                            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 6 }}>
                                {s.start} – {s.end}
                            </Text>

                            {/* Status */}
                            <View style={{ marginTop: 8 }}>{renderStatus(s)}</View>
                        </Card>
                    </Pressable>
                ))}
            </ScrollView>
        </Screen>
    );
}
