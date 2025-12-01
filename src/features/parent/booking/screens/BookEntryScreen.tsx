// src/features/parent/booking/screens/BookEntryScreen.tsx
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/src/ui";

export default function BookEntryScreen() {
  useEffect(() => {
    // For now: always go to clinic list.
    // Later we can add favorite / nearby logic again.
    router.replace("/parent/book/clinics");
  }, []);

  return (
    <Screen title="Booking">
      <View style={{ padding: 16, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    </Screen>
  );
}
