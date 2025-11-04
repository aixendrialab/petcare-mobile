// src/features/parent/api.ts
import { api } from '@/src/api'
import { ParentProfile, ParentPet, Appointment, Invoice, Prescription } from './types'

// ---------- Profile ----------
export async function fetchParentProfile(): Promise<ParentProfile> {
  const res = await api.get('/parents/profile')
  return { ...res.data.user, pets: res.data.pets || [] }
}

export async function saveParentProfile(data: ParentProfile): Promise<void> {
  await api.put('/parents/profile', data)
}

// ---------- Pets ----------
export async function fetchParentPets(): Promise<ParentPet[]> {
  const res = await api.get('/parents/pets')
  return res.data.pets || []
}

export async function addParentPet(pet: ParentPet): Promise<void> {
  await api.post('/parents/pets', { pets: [pet] })
}

export async function replaceParentPets(pets: ParentPet[]): Promise<void> {
  await api.put('/parents/pets', { pets })
}

export async function deleteParentPet(petId: number): Promise<void> {
  await api.delete(`/parents/pets/${petId}`)
}

// ---------- Appointments ----------
export async function fetchAppointments(parentId: number): Promise<Appointment[]> {
  const res = await api.get(`/parents/${parentId}/appointments`)
  return res.data.items || []
}

export async function cancelAppointment(parentId: number, appointmentId: number) {
  await api.post(`/parents/${parentId}/appointments/${appointmentId}/cancel`)
}

export async function rescheduleAppointment(parentId: number, appointmentId: number, newSlotId: number) {
  await api.post(`/parents/${parentId}/appointments/${appointmentId}/reschedule`, null, { params: { new_slot_id: newSlotId } })
}

// ---------- RX / Invoice ----------
export async function fetchPrescription(parentId: number, appointmentId: number): Promise<Prescription> {
  const res = await api.get(`/parents/${parentId}/appointments/${appointmentId}/prescription`)
  return res.data
}

export async function fetchInvoice(parentId: number, appointmentId: number): Promise<Invoice> {
  const res = await api.get(`/parents/${parentId}/appointments/${appointmentId}/invoice`)
  return res.data
}
