// src/features/vaccines/types.ts
export type PlanStatus = "SUGGESTED" | "VET_CONFIRMED";
export type PlanItemStatus = "DUE" | "UPCOMING" | "COMPLETED" | "MISSED" | "SKIPPED";
export type RequestedAction = "ADMINISTER" | "CONFIRM_PLAN" | "BOTH";

export interface VaccineDueItem {
  pet_id: number;
  pet_name: string;
  plan_item_id: number;
  vaccine_code: string;
  vaccine_name: string;
  dose_no: number;
  due_on: string; // ISO date
  status: PlanItemStatus;
}

export interface VaccinesDueResponse {
  items: VaccineDueItem[];
}

export interface PetVaccineSummary {
  pet_id: number;
  pet_name: string;
  plan_status?: PlanStatus | null;
  overdue: number;
  due: number;
  upcoming: number;
  completed: number;
}

export interface VaccinesSummaryResponse {
  pets: PetVaccineSummary[];
}

export interface VaccinePlanInfo {
  id: number;
  status: PlanStatus;
  generated_at: string;
  confirmed_at?: string | null;
  confirmed_by_vet_id?: number | null;
}

export interface PetInfo {
  id: number;
  name: string;
  breed?: string | null;
  dob?: string | null;
}

export interface VaccinePlanItem {
  id: number;
  vaccine_code: string;
  vaccine_name: string;
  dose_no: number;
  due_on: string;
  status: PlanItemStatus;
  overridden: boolean;
  override_reason?: string | null;
  completed_on?: string | null;
  completed_record_id?: number | null;
}

export interface VaccinationRecordOut {
  id: number;
  pet_id: number;
  vaccine_code?: string | null;
  vaccine_name: string;
  vaccine_type?: string | null;
  last_given?: string | null;
  next_due?: string | null;
  batch_no?: string | null;
  manufacturer?: string | null;
  notes?: string | null;
  vet_id?: number | null;
  location_id?: number | null;
  created_at?: string | null;
}

export interface PetPlanResponse {
  pet: PetInfo;
  plan?: VaccinePlanInfo | null;
  due_now: VaccinePlanItem[];
  upcoming: VaccinePlanItem[];
  completed: VaccinePlanItem[];
  records: VaccinationRecordOut[];
}

export interface RecommendedPlanItem {
  vaccine_code: string;
  vaccine_name: string;
  dose_no: number;
  due_on: string;
  vaccine_type?: string | null;
}
export interface RecommendedPlanResponse {
  pet_id: number;
  items: RecommendedPlanItem[];
}

export interface CreateVaccinationRecordIn {
  pet_id: number;
  vaccine_code?: string;
  vaccine_name?: string;
  last_given: string; // yyyy-mm-dd
  notes?: string;
  batch_no?: string;
  manufacturer?: string;
}
export interface CreateVaccinationRecordOut {
  id: number;
}

export interface VetVaccinationRequestItem {
  appointment_id: number;
  start_ts: string;
  location_name?: string | null;
  pet_id: number;
  pet_name: string;
  owner_name: string;
  requested_vaccine_code?: string | null;
  requested_action: RequestedAction;
  plan_status?: PlanStatus | null;
}
export interface VetVaccinationRequestsResponse {
  items: VetVaccinationRequestItem[];
}

export interface VetAppointmentVaccinationContext {
  appointment_id: number;
  pet: PetInfo;
  owner_name: string;
  intent?: any | null;
  plan_status?: PlanStatus | null;
  due_now: VaccinePlanItem[];
  records: VaccinationRecordOut[];
}

export interface PlanOverrideIn {
  plan_item_id: number;
  due_on?: string; // yyyy-mm-dd
  status?: PlanItemStatus;
  reason?: string;
}
export interface VetConfirmPlanIn {
  appointment_id?: number;
  notes?: string;
  overrides: PlanOverrideIn[];
}
export interface VetConfirmPlanOut {
  plan_id: number;
  status: PlanStatus;
}

export interface CreateVetVaccinationRecordIn {
  appointment_id?: number;
  pet_id: number;
  vaccine_code?: string;
  vaccine_name?: string;
  last_given: string; // yyyy-mm-dd
  batch_no?: string;
  manufacturer?: string;
  notes?: string;
}
export interface CreateVetVaccinationRecordOut {
  id: number;
}
