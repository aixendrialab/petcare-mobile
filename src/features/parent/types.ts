// src/features/parent/types.ts

export type ParentPet = {
  id?: number
  name: string
  breed?: string
  dob?: string
  gender?: string
  vaccine_status?: string
  rewards?: string
  picture_uri?: string
}

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
