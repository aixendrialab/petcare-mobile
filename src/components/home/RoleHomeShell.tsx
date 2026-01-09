import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, FlatList, Pressable } from "react-native";

export type RoleKind = "PARENT" | "VET" | "VENDOR" | "NUTRITIONIST";

export type QuickTone = "neutral" | "primary" | "success" | "warning";

export type IconName =
  | "stethoscope"
  | "syringe"
  | "calendar"
  | "history"
  | "video"
  | "upload"
  | "store"
  | "cart"
  | "truck"
  | "pills"
  | "bowl";

export type QuickTile = {
  key: string;
  title: string;
  subtitle?: string;
  iconName: IconName;
  tone?: QuickTone;
  onPress: () => void;
};

export type AppliesToItem = {
  key: string;
  title: string;
  subtitle?: string;
  imageUri?: string | null;
  onPress: () => void;
};

export type SectionDef = {
  key: string;
  title: string;
  onSeeAll?: () => void;
  render: () => React.ReactNode; // ✅ Parent/Vet decides what to render
};

function RoleBadge({ role }: { role: RoleKind }) {
  const label =
    role === "PARENT" ? "Parent" :
    role === "VET" ? "Vet" :
    role === "VENDOR" ? "Vendor" :
    "Role";

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "rgba(17,24,39,0.06)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        alignSelf: "flex-start",
        marginTop: 8,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "700", color: "rgba(17,24,39,0.75)" }}>{label}</Text>
    </View>
  );
}

/** Icon registry is injected so shell stays generic */
type IconRegistry = Record<IconName, React.ReactElement>;

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

export function RoleHomeShell({
  role,
  greeting,
  subtitle,
  appliesToTitle,
  appliesToItems,
  onAddAppliesTo,
  tilesTitle = "What would you like to do?",
  tilesPerRow = 3,
  tiles,
  icons,
  sections,
}: {
  role: RoleKind;
  greeting: string;
  subtitle?: string;
  appliesToTitle: string;
  appliesToItems: AppliesToItem[];
  onAddAppliesTo?: () => void;

  tilesTitle?: string;
  tilesPerRow?: number;
  tiles: QuickTile[];
  icons: IconRegistry;

  sections: SectionDef[];
}) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "800" }}>{greeting}</Text>
        {!!subtitle && <Text style={{ opacity: 0.6 }}>{subtitle}</Text>}
        <RoleBadge role={role} />
      </View>

      {/* Applies-to strip (pets now; later locations for vet) */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 10 }}>{appliesToTitle}</Text>

        <FlatList
          data={appliesToItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x) => x.key}
          renderItem={({ item }) => (
            <Pressable onPress={item.onPress} style={{ marginRight: 12, alignItems: "center" }}>
              {item.imageUri ? (
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    overflow: "hidden",
                    backgroundColor: "#eee",
                  }}
                >
                  {/* Image passed by caller via URI – keep shell generic */}
                  {/* Caller can also set imageUri undefined to show placeholder */}
                  {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
                  <img
                    src={item.imageUri}
                    style={{ width: "64px", height: "64px", objectFit: "cover" } as any}
                    alt=""
                  />
                </View>
              ) : (
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#eee" }} />
              )}

              <Text style={{ marginTop: 6, fontWeight: "600" }}>{item.title}</Text>
              {!!item.subtitle && <Text style={{ opacity: 0.6, fontSize: 12 }}>{item.subtitle}</Text>}
            </Pressable>
          )}
          ListFooterComponent={
            onAddAppliesTo ? (
              <Pressable onPress={onAddAppliesTo} style={{ marginRight: 12, alignItems: "center" }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderColor: "#cfcfcf",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Text style={{ fontSize: 26, fontWeight: "700", opacity: 0.7 }}>+</Text>
                </View>
                <Text style={{ marginTop: 6, fontWeight: "600" }}>Add</Text>
                <Text style={{ opacity: 0.6, fontSize: 12 }}>{role === "PARENT" ? "Pet" : "Item"}</Text>
              </Pressable>
            ) : null
          }
        />
      </View>

      {/* Tiles */}
      <View style={{ marginBottom: 18 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>{tilesTitle}</Text>

        <FlatList
          data={tiles}
          key={tilesPerRow}
          numColumns={tilesPerRow}
          scrollEnabled={false}
          columnWrapperStyle={tilesPerRow > 1 ? { justifyContent: "flex-start" } : undefined}
          renderItem={({ item }) => (
            <View style={{ width: 120, marginRight: 18, marginBottom: 16 }}>
              <IconTile
                size={64}
                tone={item.tone}
                icon={icons[item.iconName]}
                onPress={item.onPress}
              />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#111827",
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

      {/* Sections */}
      {sections.map((s) => (
        <View key={s.key} style={{ marginTop: 8, marginBottom: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>{s.title}</Text>
            {s.onSeeAll && (
              <Pressable onPress={s.onSeeAll}>
                <Text style={{ opacity: 0.7 }}>See all</Text>
              </Pressable>
            )}
          </View>
          <View style={{ gap: 10 }}>{s.render()}</View>
        </View>
      ))}
    </ScrollView>
  );
}
