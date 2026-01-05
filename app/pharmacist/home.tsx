import React from "react";
import { Screen, Tile } from "@/src/ui";
import { View } from "react-native";
import { router } from "expo-router";

export default function PharmacistHome() {
  return (
    <Screen title="Pharmacy" subtitle="eRx • Catalog • Inventory • Orders">
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        <Tile icon="speedometer-outline" label="Dashboard" caption="Summary" onPress={() => router.push('/pharmacist/dashboard')} />
        <Tile icon="document-text-outline" label="eRx Queue" caption="Verify RX" onPress={() => router.push('/pharmacist/erx')} />
        <Tile icon="pricetag-outline" label="Catalog" caption="Items" onPress={() => router.push('/pharmacist/catalog')} />
        <Tile icon="cube-outline" label="Inventory" caption="Stock" onPress={() => router.push('/pharmacist/inventory')} />
        <Tile icon="cart-outline" label="Orders" caption="Pack & ship" onPress={() => router.push('/pharmacist/orders')} />
        <Tile icon="person-circle-outline" label="Profile" caption="License" onPress={() => router.push('/pharmacist/profile')} />
      </View>
    </Screen>
  );
}
