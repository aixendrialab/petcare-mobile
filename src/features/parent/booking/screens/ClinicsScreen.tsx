// src/features/parent/booking/screens/ClinicsScreen.tsx

import React, { useEffect, useState } from "react";
import { ScrollView, Pressable, Text } from "react-native";
import { router } from "expo-router";

import { Screen, Card } from "@/src/ui";
import { Clinic } from "../types";
import { fetchAllClinics } from "../api";


export default function ClinicsScreen() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const list = await fetchAllClinics();
                if (!cancelled) {
                    setClinics(list);
                }
            } catch (e) {
                if (!cancelled) {
                    setClinics([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Screen title="Select Clinic">
            <ScrollView style={{ padding: 12 }}>
                {clinics.map((c) => (
                    <Pressable
                        key={c.id}
                        onPress={() =>
                            router.push({
                                pathname: "/parent/book/slots",
                                params: {
                                    location_id: c.id,
                                    clinic_name: c.name,
                                    vet_id: c.vet_id,
                                    vet_name: c.vet_name,
                                    line1: c.line1,
                                    city: c.city,
                                },
                            })
                        }
                    >
                        <Card style={{ padding: 12, marginBottom: 12 }}>
                            <Text style={{ fontWeight: "700", fontSize: 16 }}>
                                {c.display_name || c.vet_name}
                            </Text>

                            <Text>{c.name}</Text>        {/* clinic name */}
                            <Text>{c.line1}</Text>       {/* address */}
                            <Text>{c.city}</Text>
                        </Card>

                    </Pressable>
                ))}

                {!loading && clinics.length === 0 && (
                    <Text>No clinics configured yet.</Text>
                )}
            </ScrollView>
        </Screen>
    );
}
