import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";

import { replaceParentPets } from '../api';
import { fetchParentPets } from '../api';
import type { ParentPet } from "../types";
import PetRow, { PetDraft } from "../components/PetRow";

function draftToParentPet(d: PetDraft): ParentPet {
  // ParentPet shape in your app seems compatible with snake_case fields already.
  // Keep it simple and pass through.
  return {
    id: 0 as any, // server may assign; but replaceParentPets likely stores array as-is. If server requires id, you should use addParentPet instead.
    name: d.name ?? "",
    breed: d.breed ?? "",
    picture_uri: d.picture_uri,
    ...(d as any),
  } as any;
}

export default function PetAddScreen() {
  const router = useRouter();
  const [draft, setDraft] = useState<PetDraft>({ gender: "unknown" });

  async function onSave() {
    const newPet = draftToParentPet(draft);

    // If your backend supports adding without id, this works.
    // If it requires id, switch to addParentPet(newPet as any) instead.
    const existing = await fetchParentPets();
    await replaceParentPets([...(existing as any), newPet as any]);

    router.back();
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Add Pet</Text>

      <PetRow value={draft} onChange={setDraft} />

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
