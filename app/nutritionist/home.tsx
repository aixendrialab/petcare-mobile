import React from "react";
import { Screen, Tile } from "@/src/ui";
import { View } from "react-native";
import { router } from "expo-router";

export default function NutriHome() {
  return (
    <Screen title="Nutritionist" subtitle="Schedule • Consult • Plans">
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        <Tile icon="calendar-outline" label="Schedule" caption="Open & booked" onPress={() => router.push("/nutritionist/schedule")} />
        <Tile icon="leaf-outline" label="Consult" caption="Diet plan" onPress={() => router.push("/nutritionist/consult")} />
        <Tile icon="person-circle-outline" label="Profile" caption="Business details" onPress={() => router.push("/nutritionist/onboarding")} />
      </View>
    </Screen>
  );
}
