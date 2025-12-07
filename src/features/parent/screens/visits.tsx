import React, { useEffect, useState } from "react";
import { Screen } from "@/src/ui";
import { Tile } from "@/src/ui.paper";
import { fetchParentRecentConsults } from "@/src/features/parent/api";
import { ParentRecentConsult } from "@/src/features/parent/types";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";

export default function ParentVisitsScreen() {
  const [items, setItems] = useState<ParentRecentConsult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // 👈 toggle state

  async function load() {
    setLoading(true);
    try {
      const limit = showAll ? 500 : 5;  // 👈 Fetch either 5 or ALL
      const data = await fetchParentRecentConsults(limit);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [showAll]); // 👈 Reload when toggle changes

  return (
    <Screen title="Recent Visits" onBack={() => router.back()}>
      {/* Toggle */}
      <Pressable
        onPress={() => setShowAll(!showAll)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderWidth: 1.5,
            borderColor: "#555",
            borderRadius: 4,
            marginRight: 8,
            backgroundColor: showAll ? "#4c8bf5" : "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showAll && (
            <Text style={{ color: "white", fontWeight: "900" }}>✓</Text>
          )}
        </View>
        <Text style={{ fontSize: 16 }}>
          {showAll ? "Showing all visits" : "Show only recent (5)"}
        </Text>
      </Pressable>

      {loading && <Text>Loading…</Text>}

      {!loading && items.length === 0 && (
        <Text>No past consultations found.</Text>
      )}

      <View style={{ gap: 12 }}>
        {items.map((rv) => (
          <Tile
            key={rv.consult_id}
            title={`${rv.pet_name} – ${rv.vet_name ?? "Vet"}`}
            label={rv.clinic_name ?? ""}
            subtitle={rv.diagnosis || "Consult completed"}
            caption={new Date(rv.date).toLocaleString()}
            onPress={() =>
              router.push({
                pathname: "/parent/consult/[consultId]",
                params: { consultId: String(rv.consult_id) },
              })
            }
          />
        ))}
      </View>
    </Screen>
  );
}
