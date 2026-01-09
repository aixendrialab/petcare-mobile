import React from "react";
import { ScrollView, Text, View } from "react-native";

export function HomeShell({
  headerTitle,
  headerSubtitle,
  top,
  children,
}: {
  headerTitle: string;
  headerSubtitle?: string;
  top?: React.ReactNode; // e.g., pets row for Parent, clinics row for Vet
  children: React.ReactNode;
}) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "800" }}>{headerTitle}</Text>
        {!!headerSubtitle && <Text style={{ opacity: 0.6 }}>{headerSubtitle}</Text>}
        {top}
      </View>

      {children}
    </ScrollView>
  );
}
