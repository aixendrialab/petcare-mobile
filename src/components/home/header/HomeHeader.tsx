import React from "react";
import { StyleSheet, View } from "react-native";
import type { HeaderModel, RoleKind } from "../types";
import { HomeTheme } from "../theme";
import { roleLabel } from "../utils/derive";
import { GreetingTitle } from "./GreetingTitle";
import { SubtitleLine } from "./SubtitleLine";
import { RoleBadge } from "./RoleBadge";
import { TodaySummaryLine } from "./TodaySummaryLine";
import { HeaderActions } from "./HeaderActions";

export function HomeHeader({ role, model }: { role: RoleKind; model: HeaderModel }) {
  const badgeLabel = model.roleBadge?.label ?? roleLabel(role);
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <GreetingTitle text={model.greeting} />
          {model.subtitle ? <SubtitleLine text={model.subtitle} /> : null}
          {badgeLabel ? <RoleBadge label={badgeLabel} /> : null}
        </View>
        <HeaderActions
          showBell={model.actions?.showBell}
          onPressBell={model.actions?.onPressBell}
          showProfile={model.actions?.showProfile}
          onPressProfile={model.actions?.onPressProfile}
        />
      </View>

      {model.summary ? (
        <TodaySummaryLine
          text={model.summary.text}
          tone={model.summary.tone}
          isLoading={model.summary.isLoading}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: HomeTheme.spacing.lg,
    paddingTop: HomeTheme.spacing.xl,
    paddingBottom: HomeTheme.spacing.md,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
});
