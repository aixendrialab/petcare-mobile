import React from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import type { ShopHome } from "../../types";

export function HomeHeroCard({
  home,
  onPress,
}: {
  home: ShopHome;
  onPress?: (route?: string) => void;
}) {
  const hero = (home as any).hero;
  if (!hero) return null;

  const title = hero.title || "Today’s picks";
  const subtitle = hero.subtitle || "Deals and essentials for your pet";

  const handlePress = () => onPress?.(hero.route ?? undefined);

  return (
    <Pressable style={styles.wrap} onPress={handlePress} disabled={!onPress}>
      <ImageBackground
        source={{ uri: hero.banner_uri || "https://picsum.photos/seed/petcare-hero/1200/600" }}
        style={styles.bg}
        imageStyle={styles.bgImg}
      >
        <View style={styles.overlay} />
        <View style={styles.inner}>
          <Text style={styles.kicker}>Recommended</Text>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
          <View style={styles.ctaPill}>
            <Text style={styles.ctaText}>Explore</Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  bg: { height: 132, justifyContent: "flex-end" },
  bgImg: { borderRadius: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  inner: { padding: 12 },
  kicker: { fontWeight: "900", opacity: 0.9, fontSize: 12, marginBottom: 4, color: "white" },
  title: { fontSize: 16, fontWeight: "900", color: "white" },
  subtitle: { marginTop: 4, opacity: 0.9, fontWeight: "700", fontSize: 12, color: "white" },
  ctaPill: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  ctaText: { fontWeight: "900", color: "white", fontSize: 12 },
});
