// src/features/parent/api.ts
import { api } from '@/src/api'
import { 
  ParentProfile, 
  Appointment, 
  Invoice, 
  Prescription,  
  ParentConsultDetail, 
  ParentRecentConsult, 
  ParentUpcomingAppointment, 
  ParentUpcomingAppointmentsResponse, 
  ParentRecentConsultsResponse} from './types'
import { Appt } from './booking/types'

// ---------- Profile ----------
export async function fetchParentProfile(): Promise<ParentProfile> {
  const res = await api.get('/parents/profile')
  return { ...res.data.user, pets: res.data.pets || [] }
}

export async function saveParentProfile(data: ParentProfile): Promise<void> {
  await api.put('/parents/profile', data)
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

export async function fetchParentConsultDetail(
  consultId: number
): Promise<ParentConsultDetail> {
  const { data } = await api.get<ParentConsultDetail>(
    `/parents/consults/${consultId}`
  );
  return data;
}

// ---------- Upcoming appointments ----------
export async function fetchParentUpcomingAppointments(
  limit: number = 10
): Promise<ParentUpcomingAppointment[]> {
  const res = await api.get<ParentUpcomingAppointmentsResponse>(
    "/parents/appointments/upcoming",
    { params: { limit } }
  );
  return res.data.items ?? [];
}

export async function fetchParentNextAppointment(): Promise<ParentUpcomingAppointment | null> {
  const res = await api.get<ParentUpcomingAppointmentsResponse>(
    "/parents/appointments/upcoming",
    { params: { limit: 1 } }
  );
  return res.data.items?.[0] ?? null;
}

// ---------- Cancel ----------
export async function parentCancelAppointment(appointmentId: number) {
  await api.post(`/parents/appointments/${appointmentId}/cancel`);
}

// ---------- Reschedule ----------
export async function parentRescheduleAppointment(
  appointmentId: number,
  newSlotId: string
) {
  await api.post(`/parents/appointments/${appointmentId}/reschedule`, {
    new_slot_id: newSlotId,
  });
}

// src/features/parent/api.ts
export async function fetchParentRecentConsults(limit = 5): Promise<ParentRecentConsult[]> {
  const res = await api.get<ParentRecentConsultsResponse>("/parents/consults/recent", { params: { limit } });
  return res.data.items ?? [];
}
