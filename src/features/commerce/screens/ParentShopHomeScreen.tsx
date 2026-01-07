import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchShopHome } from "../api";
import type { ShopHome, CatalogCategory } from "../types";
import { ShopHomeShell } from "../components/shopHome/ShopHomeShell";

export default function ParentShopHomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [home, setHome] = useState<ShopHome | null>(null);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchShopHome();
      setHome(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openItem = (id: number) =>
    router.push({ pathname: "/parent/shop/item/[id]", params: { id: String(id) } });

  const openSearch = () =>
    router.push({ pathname: "/parent/shop/list", params: { q } });

  const pickCategory = (category: CatalogCategory) =>
    router.push({ pathname: "/parent/shop/list", params: { category } });

  const openRoute = (route?: string) => {
    if (!route) return;
    router.push(route as any);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, opacity: 0.7 }}>Loading shop…</Text>
      </View>
    );
  }

  if (!home) {
    return (
      <View style={styles.center}>
        <Text style={{ opacity: 0.7 }}>Shop is not available</Text>
        <Pressable style={styles.btn} onPress={load}>
          <Text>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ShopHomeShell
      home={home}
      q={q}
      onChangeQ={setQ}
      onSearch={openSearch}
      deliverTo={"Ram Satish • Vizag • 5300xx"} // ✅ wire real data later
      onChangeDeliverTo={() => {
        // later: open address picker
        router.push("/parent/profile" as any);
      }}
      onPickCategory={pickCategory}
      onOpenItem={openItem}
      onOpenRoute={openRoute}
      onGoToCart={() => router.push("/parent/cart")}
      onMyOrders={() => router.push("/parent/orders")}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  btn: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.08)" },
});
