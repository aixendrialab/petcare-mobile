import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native-paper";
import { ParentPet } from "../types";
import { fetchParentPets } from "../api";
import { PetSummaryCard } from "@/src/features/parent/pets/components/PetSummaryCard";

// Minimal mapper: adapt ParentPet -> PetSummaryCard's PetSummary shape
function mapParentPetToSummary(p: ParentPet) {
  const dob = (p as any).dob as string | undefined;

  const ageYears =
    dob
      ? Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(dob).getTime()) /
              (365.25 * 24 * 3600 * 1000)
          )
        )
      : 0;

  return {
    name: p.name,
    breed: p.breed ?? "—",
    sex: (p as any).gender ?? (p as any).sex ?? "unknown",
    ageYears,
    ownerName: (p as any).owner_name ?? "",
    avatarUrl: (p as any).avatarUrl ?? p.picture_uri ?? "",
    microchip: (p as any).microchip,
    blood_group: (p as any).blood_group,
    color_markings: (p as any).color_markings,
    weight_kg: (p as any).weight_kg,
    behaviourNotes:
      (p as any).behavior_notes ?? (p as any).behaviour_notes,
    allergies:
      typeof (p as any).allergies === "string"
        ? (p as any).allergies
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : (p as any).allergies,
    chronicConditions:
      typeof (p as any).chronic_conditions === "string"
        ? (p as any).chronic_conditions
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : (p as any).chronicConditions,
  };
}

export default function PetSummaryScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  const [pet, setPet] = useState<ParentPet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const pets = await fetchParentPets();
        const found =
          pets.find((x) => String(x.id) === String(petId)) ?? null;
        setPet(found);
      } finally {
        setLoading(false);
      }
    })();
  }, [petId]);

  const summary = useMemo(
    () => (pet ? mapParentPetToSummary(pet) : null),
    [pet]
  );

  if (loading)
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading…</Text>
      </View>
    );

  if (!pet || !summary)
    return (
      <View style={{ padding: 16 }}>
        <Text>Pet not found.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        Pet Summary
      </Text>

      {/* ✅ Entire card is pressable */}
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/parent/pets/edit/[petId]",
            params: { petId: String(pet.id) },
          } as any)
        }
        style={({ pressed }) => ({
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <PetSummaryCard pet={summary as any} />
      </Pressable>
    </View>
  );
}
