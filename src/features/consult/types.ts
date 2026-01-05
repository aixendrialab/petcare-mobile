import { PetSummary } from "../parent/pets/types";

// src/features/consult/types.ts
export type AppointmentMode = 'IN_CLINIC' | 'VIDEO';

export interface AppointmentSummary {
  id: number;
  bookingCode: string;
  startTs: string;
  endTs: string;
  locationName: string;
  mode: AppointmentMode;
}

export type Sex = 'male' | 'female' | 'unknown' | '';

export interface PastConsultSummary {
  id: number;
  date: string;
  reason: string;
  diagnosis?: string;
  medicationsCount: number;
}

export type VaccineStatusCode = 'DONE' | 'DUE_SOON' | 'OVERDUE' | 'NOT_STARTED';

export interface VaccineStatus {
  name: string;
  status: VaccineStatusCode;
  lastGiven?: string;
  nextDue?: string;
}

export interface VitalsDraft {
  weightKg?: string;
  temp?: string;
  heartRate?: string;
  respRate?: string;
  notes?: string;
}

export interface MedicationDraft {
  name: string;
  dose: string;
  frequency: string;
  days: string;
  notes: string;
}

export interface ConsultDraft {
  appointment_id: number;   // was appointmentId
  pet_id: number;           // was petId

  reason?: string;
  findings?: string;
  diagnosis?: string;
  advice?: string;
  symptomNotes?: string; 
  followUpDate: string;

  vitals: VitalsDraft | null;   // must be null, NOT {}

  medications: MedicationDraft[];
}

export interface ConsultContext {
  appointment: AppointmentSummary;
  pet: PetSummary;
  history: PastConsultSummary[];
  vaccines: VaccineStatus[];
}


export type VisitHistory = {
  id: number;
  date: string;
  diagnosis: string;
};

export type VaccineRecord = {
  id: number;
  vaccine: string;
  date: string;
};

export type Medicine = {
  name: string;
  dose: string;
  freq: string;
  days: string;
};

export type ConsultSaveInput = {
  appointment_id: number;
  pet_id: number;
  symptoms: string;
  diagnosis: string;
  notes: string;
  medicines: Medicine[];
  attachments: string[];
};
