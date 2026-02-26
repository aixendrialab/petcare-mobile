import React from "react";
import { StyleSheet, View } from "react-native";
import type { IconRegistry, SectionModel } from "../types";
import { HomeTheme } from "../theme";
import { SectionCard } from "../sections/SectionCard";
import { SectionHeader } from "../sections/SectionHeader";
import { StackWithSeparators } from "../sections/StackWithSeparators";
import { Row } from "../sections/Row";
import { Empty } from "../sections/Empty";

export function HomeSection({ section, icons }: { section: SectionModel; icons: IconRegistry }) {
  return (
    <View style={styles.wrap}>
      <SectionCard>
        <SectionHeader
          title={section.title}
          accent={section.accent}
          icons={icons}
          seeAll={section.onSeeAll ? { onPress: section.onSeeAll } : undefined}
        />
        <View style={{ marginTop: 10 }}>
          {section.content.kind === "custom" ? (
            section.content.render()
          ) : section.content.rows.length > 0 ? (
            <StackWithSeparators insetLeft={38}>
              {section.content.rows.map((r) => (
                <Row key={r.key} row={r} icons={icons} />
              ))}
            </StackWithSeparators>
          ) : section.content.empty ? (
            <Empty model={section.content.empty} />
          ) : null}
        </View>
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: HomeTheme.spacing.lg,
    marginTop: HomeTheme.spacing.lg,
  },
});
