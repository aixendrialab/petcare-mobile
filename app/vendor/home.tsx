import React from "react";
import { Screen, Tile } from "@/src/ui";
import { View } from "react-native";
import { router } from "expo-router";

export default function VendorHome() {
  return (
    <Screen title="Vendor / Shop" subtitle="Catalog • Inventory • Orders • Delivery">
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        <Tile icon="speedometer-outline" label="Dashboard" caption="Summary" onPress={() => router.push('/vendor/dashboard')} />
        <Tile icon="pricetag-outline" label="Catalog" caption="Items" onPress={() => router.push('/vendor/catalog')} />
        <Tile icon="cube-outline" label="Inventory" caption="Stock" onPress={() => router.push('/vendor/inventory')} />
        <Tile icon="cart-outline" label="Orders" caption="Pack" onPress={() => router.push('/vendor/orders')} />
        <Tile icon="bicycle-outline" label="Delivery" caption="Dispatch" onPress={() => router.push('/vendor/delivery')} />
        <Tile icon="person-circle-outline" label="Profile" caption="Business" onPress={() => router.push('/vendor/profile')} />
      </View>
    </Screen>
  );
}
