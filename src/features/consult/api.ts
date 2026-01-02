// src/features/consult/api.ts
import { api } from '@/src/api';
import {
  AppointmentSummary,
  PetSummary,
  PastConsultSummary,
  VaccineStatus,
  ConsultContext,
  ConsultDraft,
  ConsultSaveInput,
  VisitHistory,
} from './types';

export async function fetchConsultContext(
  appointmentId: number,
  petId: number
): Promise<ConsultContext> {
  const { data } = await api.get<ConsultContext>('/consults/context', {
    params: { appointment_id: appointmentId, pet_id: petId },
  });
  return data;
}

export async function loadConsultData(appointment_id: number, pet_id: number) {
  const pet = await api.get<PetSummary>(`/parents/pets/${pet_id}`);
  const history = await api.get<VisitHistory[]>(`/consults/history/${pet_id}`);
  const vaccines = await api.get(`/vaccines/history/${pet_id}`);

  const draft = await api.get("/consults/draft", {
    params: { appointment_id: appointment_id },
  });

  return {
    pet: pet.data,
    history: history.data,
    vaccines: vaccines.data,
    draft: draft.data,
  };
}

export async function saveConsultDraft(payload: ConsultSaveInput) {
  return api.post('/consults/save', payload);
}

export async function completeConsult(payload: ConsultSaveInput) {
  return api.post('/consults/complete', payload);
}
