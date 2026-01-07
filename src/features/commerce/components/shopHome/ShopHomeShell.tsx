import React, { useMemo } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import type { ShopHome, CatalogCategory, CatalogMiniItem, Money } from "../../types";
import { ShopSearchBar } from "./ShopSearchBar";
import { DeliverToBar } from "./DeliverToBar";
import { CategoriesRow } from "./CategoriesRow";
import { HomeHeroCard } from "./HomeHeroCard";
import { DiscountHintsRow } from "./DiscountHintsRow";
import { HomeShelf } from "./HomeShelf";
import { addToCart } from "../../api";

const INR = (amount: number): Money => ({ amount, currency: "INR" });

function demoItems(seed: string, baseId: number): CatalogMiniItem[] {
    // deterministic “good looking” placeholders so UI never feels empty
    const pics = (i: number) => `https://picsum.photos/seed/${seed}-${i}/500/500`;

    return [
        { id: baseId + 1, name: "Omega Coat Supplement (60 chews)", price: INR(499), mrp: INR(699), primary_image: pics(1), badges: ["Limited time deal"], rating: { avg: 4.4, count: 1210 } },
        { id: baseId + 2, name: "Grain-free Puppy Dry Food 2kg", price: INR(899), mrp: INR(1099), primary_image: pics(2), badges: ["Best seller"], rating: { avg: 4.2, count: 870 } },
        { id: baseId + 3, name: "No-pull Harness (M)", price: INR(649), mrp: INR(899), primary_image: pics(3), badges: ["Top rated"], rating: { avg: 4.6, count: 540 } },
        { id: baseId + 4, name: "Tick & Flea Shampoo 200ml", price: INR(299), mrp: INR(399), primary_image: pics(4), badges: ["Deal"], rating: { avg: 4.1, count: 320 } },
        { id: baseId + 5, name: "Dental Chew Sticks (Pack of 10)", price: INR(199), mrp: INR(249), primary_image: pics(5), badges: ["Add-on"], rating: { avg: 4.3, count: 980 } },
    ];
}

export function ShopHomeShell({
    home,
    q,
    onChangeQ,
    onSearch,
    deliverTo,
    onChangeDeliverTo,
    onPickCategory,
    onOpenItem,
    onOpenRoute,
    onGoToCart,
    onMyOrders,
}: {
    home: ShopHome;

    q: string;
    onChangeQ: (v: string) => void;
    onSearch: () => void;

    deliverTo: string;
    onChangeDeliverTo?: () => void;

    onPickCategory: (c: CatalogCategory) => void;
    onOpenItem: (id: number) => void;
    onOpenRoute: (route?: string) => void;

    onGoToCart: () => void;
    onMyOrders: () => void;
}) {
    const sectionsToShow = useMemo(() => {
        const real = (home.sections ?? []).filter((s) => (s.items ?? []).length > 0);
        if (real.length) return real;

        // fallback sections if API returns empty
        return [
            {
                key: "deals",
                title: "Deals for you",
                subtitle: "Limited-time discounts",
                items: demoItems("deals", 1000),
                cta: { title: "More deals", route: "/parent/shop/list?q=deal" },
            },
            {
                key: "food",
                title: "Food & treats",
                subtitle: "Daily essentials",
                items: demoItems("food", 2000),
                cta: { title: "More food", route: "/parent/shop/list?category=FOOD" },
            },
            {
                key: "accessories",
                title: "Accessories",
                subtitle: "Comfort & style",
                items: demoItems("acc", 3000),
                cta: { title: "More accessories", route: "/parent/shop/list?category=ACCESSORY" },
            },
        ];
    }, [home.sections]);

    return (
        <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.h1}>Shop</Text>
            <Text style={styles.sub}>Buy products & services for your pet</Text>

            {/* 1) Search */}
            <ShopSearchBar value={q} onChange={onChangeQ} onSubmit={onSearch} />

            {/* 2) Deliver to */}
            <DeliverToBar value={deliverTo} onPress={onChangeDeliverTo} />

            {/* 3) Categories */}
            <CategoriesRow onPick={onPickCategory} />

            {/* 4) Hero (optional) */}
            <HomeHeroCard home={home} onPress={() => onOpenRoute("/parent/shop/list?category=FOOD")} />

            {/* 5) Deal hints */}
            <DiscountHintsRow hints={home.discount_hints} />

            {/* 6) Shelves */}
            {sectionsToShow.map((sec) => (
                <HomeShelf
                    title={sec.title}
                    subtitle={sec.subtitle}
                    items={sec.items}
                    onOpenItem={onOpenItem}
                    onSeeAll={sec.cta?.route ? () => onOpenRoute(sec.cta?.route) : undefined}
                    onQuickAdd={(id) => addToCart(id, 1)}
                    fadeColor={"rgba(0,0,0,1)"} // match your page background
                />
            ))}

            <View style={{ height: 18 }} />

            {/* Bottom actions */}
            <Pressable style={styles.primaryBtn} onPress={onGoToCart}>
                <Text style={styles.primaryBtnText}>Go to Cart</Text>
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={onMyOrders}>
                <Text style={styles.secondaryBtnText}>My Orders</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, padding: 16 },
    h1: { fontSize: 22, fontWeight: "900" },
    sub: { marginTop: 4, opacity: 0.7 },

    primaryBtn: {
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "rgba(0,0,0,0.08)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.10)",
    },
    primaryBtnText: { textAlign: "center", fontWeight: "900" },
    secondaryBtn: {
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.12)",
        backgroundColor: "rgba(255,255,255,0.85)",
    },
    secondaryBtnText: { textAlign: "center", fontWeight: "900", opacity: 0.9 },
});
