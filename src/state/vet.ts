import { create } from 'zustand'

export type VetLocation = {
  name?: string
  line1?: string
  line2?: string
  city?: string
  lat?: number | null
  lng?: number | null
  hours?: string | null
  is_primary?: boolean
}

export type VetProfile = {
  legal_name?: string | null
  display_name?: string | null
  business_email?: string | null
  billing_email?: string | null
  billing_address?: string | null
  gstin?: string | null
  pan?: string | null
  qualifications?: string | null
  license_no?: string | null
  experience_years?: number
  specialties: string[]
  visit_in_clinic: boolean
  visit_video: boolean
  fee_in_clinic?: number
  fee_video?: number
  slot_minutes: number
  locations: VetLocation[]
}

const DEFAULT_PROFILE: VetProfile = {
  legal_name: '', display_name: '',
  business_email: '', billing_email: '', billing_address: '',
  gstin: '', pan: '',
  qualifications: '', license_no: '', experience_years: 0,
  specialties: [],
  visit_in_clinic: true, visit_video: true,
  fee_in_clinic: 0, fee_video: 0, slot_minutes: 15,
  locations: [],
}

type VetState = {
  // account (editable)
  userName: string
  email: string
  phoneReadOnly: string

  // vet profile
  profile: VetProfile
  specialtiesText: string

  // baselines for dirty checks
  baseUserName: string
  baseEmail: string
  baseVetJson: string

  // actions
  setAccount: (p: Partial<{ userName: string; email: string; phoneReadOnly: string }>) => void
  setProfile: (p: Partial<VetProfile>) => void
  setSpecialtiesText: (s: string) => void
  resetFromServer: (args: {
    userName: string; email: string; phoneReadOnly?: string
    profile: VetProfile
  }) => void
}

export const useVetStore = create<VetState>((set, get) => ({
  userName: '', email: '', phoneReadOnly: '',
  profile: DEFAULT_PROFILE,
  specialtiesText: '',
  baseUserName: '', baseEmail: '', baseVetJson: JSON.stringify(DEFAULT_PROFILE),

  setAccount: (p) => set((s) => ({ ...s, ...p })),
  setProfile: (p) => set((s) => ({ ...s, profile: { ...s.profile, ...p } })),
  setSpecialtiesText: (specialtiesText) => set({ specialtiesText }),

  resetFromServer: ({ userName, email, phoneReadOnly = '', profile }) => set({
    userName, email, phoneReadOnly,
    profile,
    specialtiesText: (profile.specialties || []).join(', '),
    baseUserName: userName,
    baseEmail: email,
    baseVetJson: JSON.stringify(profile),
  }),
}))
