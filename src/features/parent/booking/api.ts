// src/features/parent/booking/api.ts

import { api } from "@/src/api";
import type {
  Clinic,
  NearbyClinic,
  DailySlots,
  AppointmentCreate,
  AppointmentCreated,
  SimpleSlot,
  Slot
} from "./types";

/** All clinics */
export async function fetchAllClinics() {
  return api.get<Clinic[]>("/vet/clinics/all").then((r) => r.data);
}

/** Nearby clinics */
export async function fetchNearbyClinics(lat: number, lng: number) {
  return api
    .get<NearbyClinic[]>("/vet/clinics/nearby", { params: { lat, lng } })
    .then((r) => r.data);
}

export async function fetchClinicSlots(location_id: number, date: string) {
  return api
    .get<Slot[]>("/appointments/slots", {
      params: { location_id, date }
    })
    .then(r => r.data);
}

/** Create appointment */
export async function createAppointment(payload: AppointmentCreate) {
  return api
    .post<AppointmentCreated>("/appointments", payload)
    .then((r) => r.data);
}

// =======================
// Parent Reschedule API
// =======================
export async function parentRescheduleAppointment(
  appointment_id: number,
  new_start_ts: string,
  new_end_ts: string
) {
  const res = await api.post(
    `/parents/appointments/reschedule`, 
    null,  // no body
    {
      params: {
        appointment_id,
        new_start_ts,
        new_end_ts,
      }
    }
  );

  return res.data;
}
