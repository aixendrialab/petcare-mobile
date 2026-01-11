import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, FlatList, Pressable, Image } from "react-native";

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
  | "bowl"
  | "prescription";

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
  render: () => React.ReactNode;
};

/** Icon registry is injected so shell stays generic */
type IconRegistry = Record<IconName, React.ReactElement>;

/** ---------- tiny design system helpers ---------- */

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
        marginTop: 10,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "800", color: "rgba(17,24,39,0.75)" }}>
        {label}
      </Text>
    </View>
  );
}

function SeeAllPill({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: pressed ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.10)",
        borderWidth: 1,
        borderColor: "rgba(37,99,235,0.18)",
      })}
    >
      <Text style={{ fontWeight: "800", color: "#2563EB", fontSize: 12 }}>See all</Text>
    </Pressable>
  );
}

function StackWithSeparators({ children, gap = 12 }: { children: React.ReactNode; gap?: number }) {
  const items = React.Children.toArray(children).filter(Boolean);
  if (items.length <= 1) return <View style={{ gap }}>{children}</View>;

  return (
    <View>
      {items.map((node, idx) => (
        <View key={idx}>
          {node}
          {idx !== items.length - 1 && (
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(17,24,39,0.08)",
                marginTop: gap,
                marginBottom: gap,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );
}

function PetAvatar({ uri }: { uri?: string | null }) {
  if (!uri) {
    return (
      <View
        style={{
          width: 68,
          height: 68,
          borderRadius: 34,
          backgroundColor: "rgba(17,24,39,0.06)",
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.06)",
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: 68,
        height: 68,
        borderRadius: 34,
        overflow: "hidden",
        backgroundColor: "rgba(17,24,39,0.06)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
      }}
    >
      <Image source={{ uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
    </View>
  );
}

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
        borderRadius: 20,
        backgroundColor: pressed ? "rgba(255,255,255,0.92)" : "#fff",
        borderWidth: 1,
        borderColor: pressed ? palette.border : "rgba(0,0,0,0.06)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
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

/** ---------- Section icon + accent system (Shell-only) ---------- */

type SectionAccent = {
  iconName: IconName;
  tone?: QuickTone;
  // optional tiny label chip under title (e.g. "Upcoming", "Due soon")
  label?: string;
};

function getSectionAccent(role: RoleKind, sectionKey: string): SectionAccent {
  // You can tune these per role over time.
  // Parent keys (your current keys): nextAppt, recentVisit, vaccinesDue, prescriptions, orders, rewards, events
  if (role === "PARENT") {
    switch (sectionKey) {
      case "nextAppt":
        return { iconName: "calendar", tone: "primary", label: "Upcoming" };
      case "recentVisit":
        return { iconName: "history", tone: "neutral", label: "Last consult" };
      case "vaccinesDue":
        return { iconName: "syringe", tone: "warning", label: "Due / Upcoming" };
      case "prescriptions":
        return { iconName: "prescription", tone: "warning", label: "Medicines" };
      case "orders":
        return { iconName: "truck", tone: "neutral", label: "Delivery" };
      case "rewards":
        return { iconName: "store", tone: "success", label: "Points" }; // replace later with "trophy" if you add a trophy icon
      case "events":
        return { iconName: "video", tone: "primary", label: "Nearby" }; // replace later with "pin" if you add a location icon
      default:
        return { iconName: "history", tone: "neutral" };
    }
  }

  // fallback for other roles (generic)
  switch (sectionKey) {
    case "nextAppt":
      return { iconName: "calendar", tone: "primary" };
    default:
      return { iconName: "history", tone: "neutral" };
  }
}

function SectionIconBadge({
  icon,
  tone = "neutral",
}: {
  icon: React.ReactElement;
  tone?: QuickTone;
}) {
  const palette = useMemo(() => {
    switch (tone) {
      case "primary":
        return { bg: "rgba(59,130,246,0.12)", fg: "#2563EB", border: "rgba(37,99,235,0.18)" };
      case "success":
        return { bg: "rgba(16,185,129,0.12)", fg: "#059669", border: "rgba(5,150,105,0.18)" };
      case "warning":
        return { bg: "rgba(245,158,11,0.14)", fg: "#D97706", border: "rgba(217,119,6,0.20)" };
      default:
        return { bg: "rgba(17,24,39,0.06)", fg: "#111827", border: "rgba(17,24,39,0.10)" };
    }
  }, [tone]);

  const iconNode = React.cloneElement(icon, { size: 18, color: palette.fg });

  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 14,
        backgroundColor: palette.bg,
        borderWidth: 1,
        borderColor: palette.border,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {iconNode}
    </View>
  );
}

function SectionLabelChip({ text, tone = "neutral" }: { text: string; tone?: QuickTone }) {
  const palette = useMemo(() => {
    switch (tone) {
      case "primary":
        return { bg: "rgba(59,130,246,0.10)", fg: "#2563EB", border: "rgba(37,99,235,0.18)" };
      case "success":
        return { bg: "rgba(16,185,129,0.10)", fg: "#059669", border: "rgba(5,150,105,0.18)" };
      case "warning":
        return { bg: "rgba(245,158,11,0.12)", fg: "#D97706", border: "rgba(217,119,6,0.20)" };
      default:
        return { bg: "rgba(17,24,39,0.05)", fg: "rgba(17,24,39,0.70)", border: "rgba(17,24,39,0.10)" };
    }
  }, [tone]);

  return (
    <View
      style={{
        alignSelf: "flex-start",
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: palette.bg,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: "800", color: palette.fg }}>{text}</Text>
    </View>
  );
}

function SectionCard({
  title,
  onSeeAll,
  leftIcon,
  tone,
  label,
  children,
}: {
  title: string;
  onSeeAll?: () => void;
  leftIcon: React.ReactElement;
  tone?: QuickTone;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        borderRadius: 18,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "rgba(17,24,39,0.08)",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, paddingRight: 10 }}>
          <SectionIconBadge icon={leftIcon} tone={tone} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15.5, fontWeight: "900", color: "#111827" }} numberOfLines={1}>
              {title}
            </Text>
            {!!label && <SectionLabelChip text={label} tone={tone} />}
          </View>
        </View>

        {!!onSeeAll && <SeeAllPill onPress={onSeeAll} />}
      </View>

      {/* Body */}
      <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
        {children}
      </View>
    </View>
  );
}

/** ---------- Shell component ---------- */

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
  const pageBg = "#F8FAFC";
  const headerText = "#0F172A";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: pageBg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontSize: 24, fontWeight: "900", color: headerText }}>{greeting}</Text>
        {!!subtitle && <Text style={{ marginTop: 4, opacity: 0.6 }}>{subtitle}</Text>}
        <RoleBadge role={role} />
      </View>

      {/* Applies-to strip */}
      <View style={{ marginBottom: 18 }}>
        <Text style={{ fontSize: 16, fontWeight: "900", color: headerText, marginBottom: 10 }}>
          {appliesToTitle}
        </Text>

        <FlatList
          data={appliesToItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x) => x.key}
          renderItem={({ item }) => (
            <Pressable onPress={item.onPress} style={{ marginRight: 14, alignItems: "center", width: 86 }}>
              <PetAvatar uri={item.imageUri} />
              <Text style={{ marginTop: 8, fontWeight: "800" }} numberOfLines={1}>
                {item.title}
              </Text>
              {!!item.subtitle && (
                <Text style={{ marginTop: 2, opacity: 0.6, fontSize: 12 }} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              )}
            </Pressable>
          )}
          ListFooterComponent={
            onAddAppliesTo ? (
              <Pressable onPress={onAddAppliesTo} style={{ marginRight: 12, alignItems: "center", width: 86 }}>
                <View
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderColor: "rgba(17,24,39,0.20)",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.9)",
                  }}
                >
                  <Text style={{ fontSize: 26, fontWeight: "900", opacity: 0.75 }}>+</Text>
                </View>
                <Text style={{ marginTop: 8, fontWeight: "900" }}>Add</Text>
                <Text style={{ opacity: 0.6, fontSize: 12 }}>{role === "PARENT" ? "Pet" : "Item"}</Text>
              </Pressable>
            ) : null
          }
        />
      </View>

      {/* Tiles */}
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontSize: 18, fontWeight: "900", marginBottom: 12, color: headerText }}>
          {tilesTitle}
        </Text>

        <View
          style={{
            borderRadius: 18,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "rgba(17,24,39,0.08)",
            padding: 12,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 8 },
            elevation: 2,
          }}
        >
          <FlatList
            data={tiles}
            key={tilesPerRow}
            numColumns={tilesPerRow}
            scrollEnabled={false}
            columnWrapperStyle={tilesPerRow > 1 ? { justifyContent: "flex-start" } : undefined}
            renderItem={({ item }) => (
              <View style={{ width: 112, marginRight: 16, marginBottom: 14 }}>
                <IconTile size={64} tone={item.tone} icon={icons[item.iconName]} onPress={item.onPress} />
                <Text style={{ marginTop: 10, fontSize: 13, fontWeight: "900", color: "#111827" }} numberOfLines={2}>
                  {item.title}
                </Text>
                {!!item.subtitle && (
                  <Text style={{ marginTop: 3, fontSize: 12, color: "rgba(17,24,39,0.55)" }} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </View>

      {/* Sections with icons */}
      <View style={{ marginTop: 14 }}>
        {sections.map((s) => {
          const accent = getSectionAccent(role, s.key);
          const headerIcon = icons[accent.iconName] ?? icons.history;

          return (
            <View key={s.key} style={{ marginTop: 12 }}>
              <SectionCard
                title={s.title}
                onSeeAll={s.onSeeAll}
                leftIcon={headerIcon}
                tone={accent.tone}
                label={accent.label}
              >
                <StackWithSeparators gap={12}>{s.render()}</StackWithSeparators>
              </SectionCard>
            </View>
          );
        })}
      </View>

      <View style={{ height: 10 }} />
    </ScrollView>
  );
}
