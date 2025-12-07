import { Screen, Btn, Card } from "@/src/ui";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/src/api";
import { parentRescheduleAppointment } from "../api";

export default function ConfirmRescheduleScreen() {
  const {
    appt_id,
    location_id,
    clinic_name,
    vet_id,
    vet_name,
    date,
    start,
    end,
    pet_id,
  } = useLocalSearchParams();

async function confirm() {
  const new_start = `${date}T${start}:00`;
  const new_end   = `${date}T${end}:00`;

  try {
    const res = await parentRescheduleAppointment(
      Number(appt_id),
      new_start,
      new_end
    );

     router.push({
      pathname: "/parent/book/success",
      params: { appt_id: res.appt_id, slot_id: res.slot_id },
    });

  } catch (e: any) {
    alert(e?.response?.data?.detail || "Failed to reschedule");
  }
}


  return (
    <Screen title="Confirm Reschedule">
      <Card style={{ padding: 16, margin: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{clinic_name}</Text>

        <Text style={{ marginTop: 8 }}>Dr. {vet_name}</Text>

        <View style={{ marginTop: 16 }}>
          <Text>Date: {date}</Text>
          <Text>Time: {start} – {end}</Text>
        </View>
      </Card>

      <Btn title="Confirm Reschedule" onPress={confirm} />
    </Screen>
  );
}
