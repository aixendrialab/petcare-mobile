import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge } from "./Badge";
import type { Money } from "../types";

export function PriceBlock({
  price,
  mrp,
  discountPct,
  badges,
  boughtRecentlyLabel,
}: {
  price: Money;
  mrp?: Money;
  discountPct?: number;
  badges?: string[];
  boughtRecentlyLabel?: string;
}) {
  const showMrp = !!mrp && mrp.amount > price.amount;

  const mrpLine = useMemo(() => {
    if (!showMrp) return null;
    const pct = discountPct ? ` (-${discountPct}%)` : "";
    return `M.R.P. ₹ ${Math.round(mrp!.amount)}${pct}`;
  }, [showMrp, mrp, discountPct]);

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 10 }}>
        <Text style={styles.price}>₹ {Math.round(price.amount)}</Text>
        {showMrp ? <Text style={styles.mrp}>₹ {Math.round(mrp!.amount)}</Text> : null}
        {discountPct ? <Text style={styles.off}>-{discountPct}%</Text> : null}
      </View>

      {mrpLine ? <Text style={styles.muted}>{mrpLine}</Text> : null}
      {boughtRecentlyLabel ? <Text style={styles.bought}>{boughtRecentlyLabel}</Text> : null}

      <View style={styles.badgeRow}>
        {(badges ?? []).slice(0, 3).map((b) => (
          <Badge key={b} text={b} variant="deal" />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14 },
  price: { fontWeight: "900", fontSize: 22 },
  mrp: { textDecorationLine: "line-through", opacity: 0.6, fontSize: 14 },
  off: { fontWeight: "900", color: "tomato" },
  muted: { marginTop: 6, opacity: 0.7 },
  bought: { marginTop: 6, fontWeight: "900", color: "lightgreen" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
});
