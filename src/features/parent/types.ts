// src/features/parent/types.ts

import { ParentPet } from "./pets/types";

export interface Rx {
  id: number;
  consult_id: number;

  pet_id: number;
  pet_name: string;

  vet_id: number;
  vet_name?: string | null;
  clinic_name?: string | null;

  drug: string;
  dose?: string | null;
  frequency?: string | null;
  days?: number | null;
  notes?: string | null;

  status: "ACTIVE" | "COMPLETED";
  created_at: string; // ISO
}

export interface ParentPrescriptionsResponse {
  items: Rx[];
}

export type Order = {
  id: number;
  status: string;
  total: number;
};

export type ParentProfile = {
  id?: number
  name: string
  email?: string
  phone?: string
  pets: ParentPet[]
}

export type Appointment = {
  id: number
  calendar_state: string
  visit_state: string
}

export type Invoice = {
  invoice_no: string
  subtotal: string
  tax_cgst: string
  tax_sgst: string
  tax_igst: string
  total: string
  status: string
  items: {
    description: string
    qty: number
    unit_price: number
    amount: number
    tax_rate: number
  }[]
}

export type Prescription = {
  diagnosis: string
  items: {
    drug_name: string
    dose: string
    frequency: string
    before_after_food: string
  }[]
}

export interface Vitals {
  weight_kg?: number | null;
  temp_c?: number | null;
  heart_rate?: number | null;
  resp_rate?: number | null;
  notes?: string | null;
}

export interface Medication {
  name: string;
  dose?: string | null;
  frequency?: string | null;
  days?: number | null;
  notes?: string | null;
}

export interface ParentConsultDetail {
  consult_id: number;
  date: string;              // ISO string from server
  pet_name: string;
  pet_avatar_url?: string | null;
  clinic_name?: string | null;
  vet_name?: string | null;

  reason?: string | null;
  symptom_notes?: string | null;
  findings?: string | null;
  diagnosis?: string | null;
  advice?: string | null;

  vitals?: Vitals | null;
  medications: Medication[];
}

export interface ParentRecentConsult {
  consult_id: number;
  date: string;                // ISO string from server
  pet_id: number;
  pet_name: string;
  pet_avatar_url?: string | null;
  clinic_name?: string | null;
  vet_name?: string | null;
  diagnosis?: string | null;
}

export type ParentRecentConsultsResponse = { items: ParentRecentConsult[] };

export interface ParentUpcomingAppointment {
  id: number;

  pet_id: number;
  parent_id: number;
  vet_id: number;

  pet_name: string;
  vet_name: string;

  location_id: number | null;
  location_name: string | null;

  start_ts: string;
  end_ts: string;

  mode: "in_person" | "video" | string;

  slot_id: string;

  calendar_state:
    | "BOOKED"
    | "CANCELLED_BY_PARENT"
    | "CANCELLED_BY_VET"
    | "COMPLETED"
    | "NO_SHOW"
    | "ARRIVED"
    | "IN_CONSULT"
    | string;

  visit_state: string | null;
  notes: string | null;
}

export type ParentUpcomingAppointmentsResponse = {
  items: ParentUpcomingAppointment[];
};


