// src/components/LocationCard.tsx

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Field, Btn } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LocationCard({ index, loc, updateLoc, removeLocation }) {
    const staticMapUrl =
        loc.lat && loc.lng
            ? `https://staticmap.openstreetmap.de/staticmap.php?center=${loc.lat},${loc.lng}&zoom=15&size=600x300&markers=${loc.lat},${loc.lng},red`
            : null;

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="business-outline" size={18} color="#673AB7" />
                    <Text style={styles.title}> Location #{index + 1}</Text>
                </View>

                {loc.is_primary && (
                    <View style={styles.primaryBadge}>
                        <Text style={styles.primaryText}>Primary</Text>
                    </View>
                )}
            </View>

            {/* Fields */}
            <Field label="Clinic Name" value={loc.name ?? ""}
                onChangeText={(v) => updateLoc(index, { name: v })} />

            <Field label="Address" value={loc.line1 ?? ""}
                onChangeText={(v) => updateLoc(index, { line1: v })} />

            <Field label="City" value={loc.city ?? ""}
                onChangeText={(v) => updateLoc(index, { city: v })} />

            <Field label="Hours" value={loc.hours ?? ""}
                onChangeText={(v) => updateLoc(index, { hours: v })} />

            {/* Editable LAT/LNG */}
            <Field
                label="Latitude"
                value={loc.lat !== null && loc.lat !== undefined ? String(loc.lat) : ""}
                keyboardType="numeric"
                onChangeText={(v) =>
                    updateLoc(index, { lat: Number(v) || 0 })
                }
            />

            <Field
                label="Longitude"
                value={loc.lng !== null && loc.lng !== undefined ? String(loc.lng) : ""}
                keyboardType="numeric"
                onChangeText={(v) =>
                    updateLoc(index, { lng: Number(v) || 0 })
                }
            />


            {/* Map Preview */}
            {staticMapUrl ? (
                <Image source={{ uri: staticMapUrl }} style={styles.mapPreview} />
            ) : (
                <View style={styles.mapPlaceholder}>
                    <Text style={{ color: "#777" }}>No map preview</Text>
                </View>
            )}

            {/* Buttons */}
            <Btn
                title="📍 Pick Location on Map"
                onPress={() =>
                    router.push({
                        pathname: "/locationpicker",
                        params: { index },
                    })
                }
            />

            <Btn
                title="Remove"
                style={{ backgroundColor: "#E91E63", marginTop: 8 }}
                onPress={() => removeLocation(index)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#fafafa",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    title: {
        fontWeight: "700",
        marginLeft: 6,
    },
    primaryBadge: {
        backgroundColor: "#673AB7",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    primaryText: { color: "white", fontSize: 12 },
    mapPreview: {
        width: "100%",
        height: 160,
        borderRadius: 8,
        marginVertical: 12,
    },
    mapPlaceholder: {
        height: 160,
        backgroundColor: "#eee",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 12,
    },
});
