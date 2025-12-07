import { api } from '@/src/api'
import { VetProfile, VetProfileInput, VetLocation, VetQueueItem, VetRecentConsult, VetCheckinAppt } from './types'

export async function fetchVetProfile(): Promise<VetProfile> {
  const { data } = await api.get('/vet/profile')
  // backend returns { profile, locations }
  return {
    ...(data.profile ?? {}),
    locations: data.locations ?? []
  }
}

export async function saveVetProfile(body: VetProfileInput): Promise<VetProfile> {
  const { data } = await api.put('/vet/register', body)
  return {
    ...(data.profile ?? {}),
    locations: data.locations ?? []
  }
}

export async function listVetLocations(): Promise<VetLocation[]> {
  const { data } = await api.get('/vet/locations')
  return data ?? []
}

export async function fetchVetQueue(dayIso?: string) {
  const { data } = await api.get<VetQueueItem[]>('/consults/queue', {
    params: dayIso ? { day: dayIso } : undefined,
  })
  return data
}

export async function fetchVetRecentConsults() {
  const { data } = await api.get<VetRecentConsult[]>('/consults/recent')
  return data
}


/** New: list of appointments for check-in for a day */
export async function fetchVetCheckinAppointments(params: {
  date: string;                // YYYY-MM-DD
  location_id?: number | null;
  search?: string;
}): Promise<VetCheckinAppt[]> {
  const { data } = await api.get<VetCheckinAppt[]>('/consults/checkin/day', {
    params: {
      date: params.date,
      location_id: params.location_id ?? undefined,
      search: params.search || undefined,
    },
  });
  return data ?? [];
}

/** New: mark appointment as ARRIVED */
export async function vetCheckinAppointment(appointmentId: number): Promise<void> {
  await api.post(`/appointments/${appointmentId}/checkin`, {});
}
