import React, { useEffect, useState } from "react";
import { ScrollView, Pressable, Text } from "react-native";
import { Screen, Card } from "@/src/ui";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/src/api";

interface Pet {
  id: number;
  name: string;
  breed: string;
}

export default function SelectPetScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const params = useLocalSearchParams();

useEffect(() => {
  api.get("/parents/pets")
    .then((r) => {
      const list = Array.isArray(r.data) ? r.data : r.data.pets || [];
      setPets(list);
    })
    .catch(() => setPets([]));
}, []);


  return (
    <Screen title="Select Pet">
      <ScrollView style={{ padding: 16 }}>
        {Array.isArray(pets) && pets.map((p) => (
          <Pressable
            key={p.id}
            onPress={() =>
              router.push({
                pathname: "/parent/book/confirm",
                params: { ...params, pet_id: p.id, pet_name: p.name },
              })
            }
          >
            <Card style={{ padding: 14, marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{p.name}</Text>
              <Text style={{ color: "#555" }}>{p.breed}</Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}
