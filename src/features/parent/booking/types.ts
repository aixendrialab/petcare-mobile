// src/features/parent/booking/types.ts

/** A clinic the parent can book at */
export interface Clinic {
  id: number;               // location_id
  name: string;             // clinic_name
  line1: string;
  city: string;
  lat: number | null;
  lng: number | null;

  vet_id: number;
  vet_name: string;
  display_name?: string;
}


/** Same clinic, but with distance for /clinics/nearby */
export interface NearbyClinic extends Clinic {
  distance_km: number;
}

/** Slot groups returned from /slots/view */
export interface DailySlots {
  vet_id: number;
  vet_name: string;
  slots: string[]; // ["09:30", "10:00", ...]
}

/** Used to create an appointment */
export interface AppointmentCreate {
  location_id: number;
  vet_id: number;
  pet_id: number;
  mode: string;
  start_ts: string;
  end_ts: string;
}

/** Appointment created response */
export interface AppointmentCreated {
  id: number;
  location_id: number;
  vet_id: number;
  pet_id: number;
  slot_ts: string;
}

/** For the simple slots API you’re using now */
export interface SimpleSlot {
  ts: string;  // ISO timestamp
  date: string;
  time: string;
}

export interface Slot {
  start: string;       // "11:00"
  end: string;         // "11:30"
  capacity: number;
  status: "available" | "full" | "blocked";
}
