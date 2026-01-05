import api from '@/src/api';
import { ParentPet, ParentPetsResponse } from './types';


// ---------- Pets ----------

export async function fetchParentPets(): Promise<ParentPet[]> {
  const res = await api.get<ParentPetsResponse>("/parents/pets")
  return res.data.pets ?? []
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

