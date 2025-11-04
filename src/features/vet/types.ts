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
