import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HomeTheme } from "../theme";

function IconButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.7 : 1 }]}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

export function HeaderActions({
  showBell,
  onPressBell,
  showProfile,
  onPressProfile,
}: {
  showBell?: boolean;
  onPressBell?: () => void;
  showProfile?: boolean;
  onPressProfile?: () => void;
}) {
  if (!showBell && !showProfile) return null;
  return (
    <View style={styles.row}>
      {showBell && onPressBell ? <IconButton label="🔔" onPress={onPressBell} /> : null}
      {showProfile && onPressProfile ? <IconButton label="👤" onPress={onPressProfile} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  btn: {
    width: 38,
    height: 38,
    borderRadius: HomeTheme.radius.pill,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: HomeTheme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 18,
  },
});
