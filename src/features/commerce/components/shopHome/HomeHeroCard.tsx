import React from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import type { ShopHome } from "../../types";

export function HomeHeroCard({
  home,
  onPress,
}: {
  home: ShopHome;
  onPress?: () => void;
}) {
  const hero = home.hero;
  if (!hero) return null;

  const title = hero.title || "Today’s picks";
  const subtitle = hero.subtitle || "Deals and essentials for your pet";

  const Content = (
    <View style={styles.inner}>
      <Text style={styles.kicker}>Recommended</Text>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <Text style={styles.subtitle} numberOfLines={2}>
        {subtitle}
      </Text>

      <View style={styles.ctaPill}>
        <Text style={styles.ctaText}>Explore deals</Text>
      </View>
    </View>
  );

  // With banner image
  if (hero.banner_uri) {
    return (
      <Pressable
        style={styles.wrap}
        onPress={onPress}
        disabled={!onPress}
      >
        <ImageBackground
          source={{ uri: hero.banner_uri }}
          style={styles.bg}
          imageStyle={styles.bgImg}
        >
          <View style={styles.overlay} />
          {Content}
        </ImageBackground>
      </Pressable>
    );
  }

  // Without banner image (gradient-like fallback)
  return (
    <Pressable
      style={[styles.wrap, styles.fallback]}
      onPress={onPress}
      disabled={!onPress}
    >
      {Content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  bg: {
    height: 160,
    justifyContent: "flex-end",
  },
  bgImg: {
    borderRadius: 18,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  inner: {
    padding: 14,
  },

  kicker: {
    fontWeight: "900",
    opacity: 0.85,
    fontSize: 12,
    marginBottom: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 6,
    opacity: 0.85,
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 16,
  },

  ctaPill: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },

  ctaText: {
    fontWeight: "900",
    opacity: 0.95,
    fontSize: 12,
  },

  // no-image fallback
  fallback: {
    height: 160,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "flex-end",
  },
});
