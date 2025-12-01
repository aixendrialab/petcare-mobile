import { api } from '@/src/api'
import { VetProfile, VetProfileInput, VetLocation } from './types'

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
