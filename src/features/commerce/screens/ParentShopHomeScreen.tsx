import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { fetchShopHome } from "../api";
import type { ShopHome, CatalogCategory } from "../types";
import { ShopHomeShell } from "../components/shopHome/ShopHomeShell";
import { CartIcon } from "../components/icons/ShopIcons";

export default function ParentShopHomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [home, setHome] = useState<ShopHome | null>(null);

  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");

  // debounce typing (for smoother local filtering / future API search)
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

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

  // ✅ refresh home/cart_count whenever you come back to the screen
  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load])
  );

  const openItem = (productId: number) =>
    router.push({ pathname: "/parent/shop/item/[id]", params: { id: String(productId) } });

  // keep these routes for "See all" etc.
  const openSearch = () =>
    router.push({ pathname: "/parent/shop/list", params: { q: qDebounced } });

  const pickCategory = (category: CatalogCategory) =>
    router.push({ pathname: "/parent/shop/list", params: { category } });

  const openRoute = (route?: string) => {
    if (!route) return;
    router.push(route as any);
  };

  const goToCart = () => router.push("/parent/cart");
  const myOrders = () => router.push("/parent/orders");

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

  const cartCount = (home as any).cart_count ?? 0;

  return (
    <View style={{ flex: 1 }}>
      <ShopHomeShell
        home={home}
        q={qDebounced}
        onChangeQ={setQ}
        onSearch={openSearch}
        deliverTo={home.deliver_to_text ?? "Delivering to you"}
        onChangeDeliverTo={() => router.push("/parent/profile" as any)}
        onPickCategory={pickCategory}
        onOpenItem={openItem}
        onOpenRoute={openRoute}
        onGoToCart={goToCart}
        onMyOrders={myOrders}
      />

      <Pressable style={styles.fabCart} onPress={goToCart} hitSlop={10}>
        <CartIcon size={18} />
        {cartCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount > 99 ? "99+" : String(cartCount)}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  btn: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.08)" },

  fabCart: {
    position: "absolute",
    right: 16,
    top: 52,
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  badge: {
    position: "absolute",
    right: -4,
    top: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "tomato",
  },
  badgeText: { color: "white", fontSize: 11, fontWeight: "900" },
});
