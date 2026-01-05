import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native-paper";

import { deleteParentPet } from '../api';
import { replaceParentPets } from '../api';
import { fetchParentPets } from '../api';
import type { ParentPet } from "../types";
import PetRow, { PetDraft } from "../components/PetRow";

function parentPetToDraft(p: ParentPet): PetDraft {
  return {
    ...(p as any),
    picture_uri: (p as any).picture_uri,
  };
}

export default function PetEditScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  const [pets, setPets] = useState<ParentPet[]>([]);
  const [draft, setDraft] = useState<PetDraft>({});
  const [loading, setLoading] = useState(true);

  const current = useMemo(
    () => pets.find((x) => String(x.id) === String(petId)) ?? null,
    [pets, petId]
  );

  useEffect(() => {
    (async () => {
      try {
        const ps = await fetchParentPets();
        setPets(ps);
        const found = ps.find((x) => String(x.id) === String(petId));
        if (found) setDraft(parentPetToDraft(found));
      } finally {
        setLoading(false);
      }
    })();
  }, [petId]);

  async function onSave() {
    if (!current) return;

    const updatedPets = pets.map((p) =>
      String(p.id) === String(petId) ? ({ ...p, ...(draft as any) } as any) : p
    );

    await replaceParentPets(updatedPets as any);
    router.back();
  }

  async function onRemove() {
    if (!current) return;

    // If your backend supports delete endpoint, use it:
    await deleteParentPet(current.id);

    // And refresh list to be safe:
    const ps = await fetchParentPets();
    setPets(ps);

    router.back();
  }

  if (loading) return <View style={{ padding: 16 }}><Text>Loading…</Text></View>;
  if (!current) return <View style={{ padding: 16 }}><Text>Pet not found.</Text></View>;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Edit Pet</Text>

      <PetRow value={draft} onChange={setDraft} onRemove={onRemove} />

      <Pressable
        onPress={onSave}
        style={{
          marginTop: 8,
          padding: 14,
          borderRadius: 12,
          backgroundColor: "#111",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Save</Text>
      </Pressable>
    </View>
  );
}
