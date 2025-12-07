import { router, useLocalSearchParams } from "expo-router";
import SlotsScreen from "@/src/features/parent/booking/screens/SlotsScreen";

export default function AppointmentReschedule() {
  const params = useLocalSearchParams();

  return (
    <SlotsScreen
      mode="reschedule"
      appt_id={params.appt_id}
      pet_id={params.pet_id}
      pet_name={params.pet_name}
      location_id={params.location_id}
      location_name={params.location_name}
      vet_id={params.vet_id}
      vet_name={params.vet_name}
      start_ts={params.start_ts}
      end_ts={params.end_ts}
    />
  );
}
