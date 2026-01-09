import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { QUICK_ACTION_ICONS, QuickIconName } from "./iconRegistry";

export type QuickTone = "neutral" | "primary" | "success" | "warning";

export type QuickActionItem = {
  key: string;
  title: string;
  subtitle?: string;
  icon: QuickIconName;
  tone?: QuickTone;
  onPress: () => void;
};

function IconTile({
  icon,
  tone = "neutral",
  onPress,
  size = 64,
}: {
  icon: React.ReactElement;
  tone?: QuickTone;
  onPress: () => void;
  size?: number;
}) {
  const [pressed, setPressed] = useState(false);

  const palette = useMemo(() => {
    switch (tone) {
      case "primary":
        return { pillBg: "rgba(59,130,246,0.12)", pillFg: "#2563EB", border: "rgba(37,99,235,0.18)" };
      case "success":
        return { pillBg: "rgba(16,185,129,0.12)", pillFg: "#059669", border: "rgba(5,150,105,0.18)" };
      case "warning":
        return { pillBg: "rgba(245,158,11,0.14)", pillFg: "#D97706", border: "rgba(217,119,6,0.20)" };
      default:
        return { pillBg: "rgba(17,24,39,0.06)", pillFg: "#111827", border: "rgba(17,24,39,0.10)" };
    }
  }, [tone]);

  const iconNode = React.cloneElement(icon, { size: 22, color: palette.pillFg });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        width: size,
        height: size,
        borderRadius: 18,
        backgroundColor: pressed ? "rgba(255,255,255,0.92)" : "#fff",
        borderWidth: 1,
        borderColor: pressed ? palette.border : "rgba(0,0,0,0.06)",
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,

        transform: [{ scale: pressed ? 0.98 : 1 }],
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 16,
          backgroundColor: palette.pillBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconNode}
      </View>
    </Pressable>
  );
}

export function QuickActionGrid({
  title = "What would you like to do?",
  columns = 3,
  items,
  tileSize = 64,
}: {
  title?: string;
  columns?: number; // ✅ fixed horizontal tiles
  items: QuickActionItem[];
  tileSize?: number;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      {!!title && <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>{title}</Text>}

      <FlatList
        data={items}
        key={columns}
        numColumns={columns}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 6 }}
        columnWrapperStyle={columns > 1 ? { justifyContent: "space-between" } : undefined}
        renderItem={({ item }) => (
          <View style={{ flex: 1, alignItems: "center", marginBottom: 14 }}>
            <IconTile
              size={tileSize}
              tone={item.tone}
              icon={QUICK_ACTION_ICONS[item.icon]}
              onPress={item.onPress}
            />

            <Text
              style={{
                marginTop: 8,
                fontSize: 13,
                fontWeight: "700",
                color: "#111827",
                textAlign: "center",
              }}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {!!item.subtitle && (
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                  color: "rgba(17,24,39,0.55)",
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {item.subtitle}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
