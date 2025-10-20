// src/state/slots.ts
import { get, post, put, del } from '@/src/api';

export type ConsultationType = 'in_person' | 'video';

export type WeekWindow = {
  start: string; // "09:00"
  end: string;   // "12:00"
  breaks?: { start: string; end: string }[];
};

export type WeekRules = {
  mon?: WeekWindow[];
  tue?: WeekWindow[];
  wed?: WeekWindow[];
  thu?: WeekWindow[];
  fri?: WeekWindow[];
  sat?: WeekWindow[];
  sun?: WeekWindow[];
};

export type SlotSetting = {
  id?: number;
  user_id?: number;
  location_id: number;
  consultation_type: ConsultationType;
  slot_minutes: number;
  gap_minutes: number;
  per_slot_capacity: number;
  lead_time_minutes: number;
  booking_window_days: number;
  visible_to_parents: boolean;
  week_rules: WeekRules;
  blackout_dates: string[]; // ISO dates
  effective_from?: string | null; // "YYYY-MM-DD"
  effective_to?: string | null;
};

export type PreviewScope = 'public' | 'internal';

export type PreviewSlot = {
  start: string; // "09:00"
  end: string;   // "09:30"
  capacity: number;
  booked: number;
  status: 'available' | 'break' | 'blocked' | 'booked';
};

const base = '/api/v1/slots';

export async function fetchSlotSetting(params: {
  location_id: number;
  consultation_type?: ConsultationType;
}) {
  const q = new URLSearchParams();
  q.set('location_id', String(params.location_id));
  if (params.consultation_type) q.set('consultation_type', params.consultation_type);
  return get<SlotSetting>(`${base}/settings?${q.toString()}`);
}

export async function createSlotSetting(payload: SlotSetting) {
  return post<SlotSetting>(`${base}/settings`, payload);
}

export async function updateSlotSetting(id: number, payload: Partial<SlotSetting>) {
  return put<SlotSetting>(`${base}/settings/${id}`, payload);
}

export async function deleteSlotSetting(id: number) {
  return del<void>(`${base}/settings/${id}`);
}

export async function previewSlots(params: {
  date: string; // UTC YYYY-MM-DD
  location_id: number;
  scope: PreviewScope; // 'public' or 'internal'
  consultation_type?: ConsultationType;
}) {
  const q = new URLSearchParams();
  q.set('date', params.date);
  q.set('location_id', String(params.location_id));
  q.set('scope', params.scope);
  if (params.consultation_type) q.set('consultation_type', params.consultation_type);
  return get<PreviewSlot[]>(`${base}/preview?${q.toString()}`);
}

/** Optional: list vet locations for selector */
export type VetLocation = { id: number; name: string };
export async function fetchMyLocations() {
  return get<VetLocation[]>(`/users/vet/locations`);
}
