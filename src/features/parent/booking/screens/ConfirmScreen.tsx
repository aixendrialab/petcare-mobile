import { Screen, Btn, Card } from "@/src/ui";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { createAppointment } from "../api";

export default function ConfirmScreen() {
  const {
    location_id,
    clinic_name,
    vet_id,
    vet_name,
    line1,
    city,
    date,
    start,
    end,
    pet_id,
    pet_name,
  } = useLocalSearchParams();

async function book() {
  try {
    const payload = {
      location_id: Number(location_id),
      vet_id: Number(vet_id),
      pet_id: Number(pet_id),
      mode: "in_person",
      start_ts: `${date}T${start}:00`,
      end_ts: `${date}T${end}:00`,
    };

    const res = await createAppointment(payload);

    router.push({
      pathname: "/parent/book/success",
      params: { appt_id: res.id, slot_id: res.slot_id },
    });

  } catch (err: any) {
    alert(err?.response?.data?.detail || "Unable to book slot");
  }
}


  return (
    <Screen title="Confirm">
      <Card style={{ padding: 16, margin: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{clinic_name}</Text>
        <Text style={{ marginTop: 4 }}>{line1}</Text>
        <Text>{city}</Text>

        <Text style={{ marginTop: 8, fontWeight: "600" }}>
          Dr. {vet_name}
        </Text>

        <Text style={{ marginTop: 12 }}>Pet: {pet_name}</Text>

        <View style={{ marginTop: 16 }}>
          <Text>Date: {date}</Text>
          <Text>
            Time: {start} – {end}
          </Text>
        </View>
      </Card>

      <Btn title="Book" onPress={book} />
    </Screen>
  );
}
