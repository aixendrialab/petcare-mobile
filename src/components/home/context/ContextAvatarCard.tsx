import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { SecondaryContextItem } from "../types";
import { HomeTheme } from "../theme";
import { ContextMiniBadges } from "./ContextMiniBadges";
import { ContextStatusDot } from "./ContextStatusDot";

export function ContextAvatarCard({
  item,
  showStatus,
}: {
  item: SecondaryContextItem;
  showStatus: boolean;
}) {
  return (
    <Pressable onPress={item.onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.wrap}>
        <View>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]} />
          )}
          {showStatus ? (
            <View style={styles.statusDot}>
              <ContextStatusDot status={item.status} />
            </View>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : (
          <View style={{ height: 16 }} />
        )}
        {showStatus ? <ContextMiniBadges badges={item.badges} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 86,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: HomeTheme.radius.avatar,
    backgroundColor: "#E2E8F0",
  },
  avatarFallback: {
    borderWidth: 1,
    borderColor: HomeTheme.border,
  },
  statusDot: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 14,
    height: 14,
    borderRadius: 99,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: HomeTheme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 8,
    fontWeight: "900",
    color: HomeTheme.text,
  },
  subtitle: {
    marginTop: 2,
    fontWeight: "700",
    color: HomeTheme.textMuted,
    fontSize: 12,
  },
});
