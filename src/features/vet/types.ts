export interface VetLocation {
  id?: number
  name: string
  line1?: string
  line2?: string
  city?: string
  lat?: number | null
  lng?: number | null
  hours?: string
  is_primary?: boolean
}

export interface VetProfile {
  id?: number
  name?: string
  email?: string
  legal_name?: string
  display_name?: string
  business_email?: string
  billing_email?: string
  billing_address?: string
  gstin?: string
  pan?: string
  qualifications?: string
  license_no?: string
  experience_years?: number
  specialties?: string[]
  visit_in_clinic: boolean
  visit_video: boolean
  fee_in_clinic?: number
  fee_video?: number
  slot_minutes: number
  locations: VetLocation[]
}

export type VetProfileInput = Omit<VetProfile, 'id'>

export interface VetQueueItem {
  appointment_id: number
  pet_id: number
  pet_name: string
  pet_avatar_url?: string | null
  start_ts: string
  state: 'ARRIVED' | 'IN_CONSULT'
  owner_name: string
  location_name?: string | null
}

export interface VetRecentConsult {
  consult_id: number
  date: string
  pet_id: number
  pet_name: string
  pet_avatar_url?: string | null
  diagnosis?: string | null
}

export interface VetCheckinAppt {
  id: number;                 // appointment id
  pet_id: number;
  pet_name: string;
  parent_name: string;
  slot_id: string;
  start_ts: string;
  mode: 'in_person' | 'video';
  calendar_state: string;     // BOOKED | ARRIVED | IN_CONSULT | COMPLETED...
  visit_state?: string | null;
  location_name?: string | null;
}
