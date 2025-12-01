// app/parent/book/success.tsx
import React from "react";
import { Text, View } from "react-native";
import { Screen, Btn } from "@/src/ui";   // Button -> Btn
import { useLocalSearchParams, router } from "expo-router";

export default function SuccessScreen() {
  const { appt_id, slot_id } = useLocalSearchParams();

  return (
    <Screen title="Booked!">
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>
          Appointment Confirmed!
        </Text>

        <Text style={{ marginTop: 12 }}>
          Booking ID: {slot_id}
        </Text>

        <Text style={{ opacity: 0.6, marginTop: 4 }}>
          Appointment #{appt_id}
        </Text>

        <Btn
          title="Go Home"
          onPress={() => router.replace("/parent/home")}
          style={{ marginTop: 20 }}
        />
      </View>
    </Screen>
  );
}
