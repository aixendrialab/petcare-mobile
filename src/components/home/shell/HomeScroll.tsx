import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { HomeTheme } from "../theme";

export function HomeScroll({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: HomeTheme.pageBg,
  },
  content: {
    paddingBottom: HomeTheme.spacing.xl,
  },
});
