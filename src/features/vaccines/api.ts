// src/features/vaccines/api.ts
import { get, post } from "@/src/api";
import type {
  VaccinesDueResponse,
  VaccinesSummaryResponse,
  PetPlanResponse,
  RecommendedPlanResponse,
  CreateVaccinationRecordIn,
  CreateVaccinationRecordOut,
  VetVaccinationRequestsResponse,
  VetAppointmentVaccinationContext,
  VetConfirmPlanIn,
  VetConfirmPlanOut,
  CreateVetVaccinationRecordIn,
  CreateVetVaccinationRecordOut,
} from "./types";

// Parent
export const fetchVaccinesDue = (limit = 3) =>
  get<VaccinesDueResponse>(`/vaccines/due?mine=1&limit=${limit}`);

export const fetchVaccinesSummary = () =>
  get<VaccinesSummaryResponse>(`/vaccines/summary?mine=1`);

export const fetchPetVaccinePlan = (petId: number) =>
  get<PetPlanResponse>(`/vaccines/pets/${petId}/plan`);

export const fetchRecommendedPlan = (petId: number) =>
  get<RecommendedPlanResponse>(`/vaccines/pets/${petId}/recommended`);

export const acceptPetPlan = (petId: number) =>
  post<{ plan_id: number; status: string }>(`/vaccines/pets/${petId}/plan/accept`);

export const createVaccinationRecord = (payload: CreateVaccinationRecordIn) =>
  post<CreateVaccinationRecordOut>(`/vaccines/records`, payload);

export const fetchVaccinationRecords = (petId: number) =>
  get<{ items: any[] }>(`/vaccines/records?pet_id=${petId}`);

// Vet
export const fetchVetVaccinationRequests = (day?: string) => {
  const qs = day ? `?day=${encodeURIComponent(day)}` : "";
  return get<VetVaccinationRequestsResponse>(`/vaccines/vet/requests${qs}`);
};

export const fetchVetAppointmentVaccinationContext = (appointmentId: number) =>
  get<VetAppointmentVaccinationContext>(`/vaccines/vet/appointment/${appointmentId}`);

export const vetConfirmPlan = (petId: number, payload: VetConfirmPlanIn) =>
  post<VetConfirmPlanOut>(`/vaccines/vet/pets/${petId}/plan/confirm`, payload);

export const vetCreateVaccinationRecord = (payload: CreateVetVaccinationRecordIn) =>
  post<CreateVetVaccinationRecordOut>(`/vaccines/vet/records`, payload);
