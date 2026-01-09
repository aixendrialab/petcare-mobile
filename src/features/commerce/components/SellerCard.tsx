import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { StoreSummary, FulfillmentPromise } from "../types";
import { Badge } from "./Badge";
import { Stars } from "./Stars";

export function SellerCard({
  store,
  fulfillment,
}: {
  store: StoreSummary;
  fulfillment?: FulfillmentPromise | null;
}) {
  const inStock = fulfillment?.in_stock ?? true;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Seller & Delivery</Text>

      <Text style={styles.line}>
        Sold by <Text style={{ fontWeight: "900" }}>{store.display_name}</Text>
        {!!store.city && <Text style={styles.muted}> • {store.city}</Text>}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
        <Stars value={store.rating_avg ?? 0} />
        <Text style={styles.muted}> ({store.rating_count ?? 0})</Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {(store.badges ?? []).slice(0, 2).map((b) => (
          <Badge key={b} text={b} />
        ))}
        <Text style={[styles.stock, { color: inStock ? "lightgreen" : "tomato" }]}>
          {inStock ? "In stock" : "Out of stock"}
        </Text>
      </View>

      {!!fulfillment?.eta_text && (
        <Text style={[styles.line, { marginTop: 10 }]}>
          Delivery: <Text style={{ fontWeight: "900" }}>{fulfillment.eta_text}</Text>
        </Text>
      )}

      <Text style={styles.muted}>{fulfillment?.returnable ? "Returnable" : "Not returnable"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14 },
  title: { fontWeight: "900", fontSize: 14 },
  line: { marginTop: 6, opacity: 0.9 },
  muted: { opacity: 0.7 },
  stock: { fontWeight: "900", opacity: 0.95 },
});
