import React from "react";
import { Screen, Tile } from "@/src/ui";
import { View } from "react-native";
import { router } from "expo-router";

export default function HostelHome() {
  return (
    <Screen title="Hostel / Daycare" subtitle="Intake • Stays • Reports">
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        <Tile icon="log-in-outline" label="Intake" caption="Create stay" onPress={() => router.push("/hostel/intake")} />
        <Tile icon="bed-outline" label="Stays" caption="Today & active" onPress={() => router.push("/hostel/stays")} />
        <Tile icon="person-circle-outline" label="Profile" caption="Business details" onPress={() => router.push("/hostel/onboarding")} />
      </View>
    </Screen>
  );
}
