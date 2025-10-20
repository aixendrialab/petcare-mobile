import { get, post, put, del } from '@/src/api';
import { Location, SlotSetting, Slot, RevertOverridePayload } from './types';
import { SlotPreviewData } from './types';
import { MergeWindowPayload, SplitWindowPayload, UpdateStatusPayload } from './types';

/**
 * ---- Locations ----
 */
export async function fetchLocations() {
  try {
    const data = await get<Location[]>('/users/vet/locations');
    console.log('🔍 fetchLocations response:', data);
   // alert('Server returned:\n' + JSON.stringify(data, null, 2)); // temporary debug
    return data;
  } catch (err) {
    console.error('❌ fetchLocations error:', err);
    alert('Error fetching locations: ' + err);
    return [];
  }
}

/**
 * ---- Slot Settings CRUD ----
 */
export const fetchSlotSettingsByLocation = (
    id: number, 
    consultationType: 'video' | 'in_person' = 'in_person', 
    includeInactive = false) =>
  get<SlotSetting[]>(`/slot-settings?location_id=${id}&consultation_type=${consultationType}&include_inactive=${includeInactive}`);

export const createSlotSetting = (payload: Omit<SlotSetting, 'id'>) =>
  post<SlotSetting>('/slot-settings', payload);

export const updateSlotSetting = (id: number, payload: Omit<SlotSetting, 'id'>) =>
  put<SlotSetting>(`/slot-settings/${id}`, payload);

export const deleteSlotSetting = (id: number) =>
  del(`/slot-settings/${id}`);

/**
 * ---- Daily Slots (server-driven preview) ----
 */
export const fetchSlotsForDay = (
  dateISO: string,
  locationId: number,
  consultationType: 'video' | 'in_person'
) =>
  get<Slot[]>(
    `/slots?date_str=${dateISO}&location_id=${locationId}&consultation_type=${consultationType}&public=true`
  );

/**
 * ---- Slot Preview (rich visualization) ----
 * Returns unified segments for visualization.
 */
export const fetchSlotPreview = async (
  dateISO: string,
  locationId: number,
  consultationType: 'video' | 'in_person'
): Promise<SlotPreviewData> => {
  return get<SlotPreviewData>(
    `/slots/preview?date_str=${dateISO}&location_id=${locationId}&consultation_type=${consultationType}`
  );
};

/**
 * ---- Slot Overrides and Exceptions ----
 * These correspond to special router actions in FastAPI:
 *  - /api/v1/slot-settings/overrides
 *  - /api/v1/slot-settings/away-until
 *  - /api/v1/appointments/running-late
 */
export const upsertOverride = (payload: {
  slot_setting_id: number;
  date: string; // YYYY-MM-DD
  payload: {
    open_windows?: { start: string; end: string }[];
    block_windows?: { start: string; end: string }[];
    extra_slots?: { start: string; end: string; slot_minutes?: number; capacity?: number }[];
    capacity_overrides?: { start: string; end?: string; capacity: number }[];
  };
}) =>
  post<{ ok: boolean; id: number }>('/slot-settings/overrides', payload);

/**
 * Mark vet as away for a given window of time.
 */
export const awayUntil = (payload: {
  slot_setting_id: number;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  until: string; // HH:MM
}) =>
  post<{ ok: boolean; id: number }>('/slot-settings/away-until', payload);

/**
 * Mark vet as running late for appointments.
 */
export const runningLate = (payload: {
  slot_setting_id: number;
  date: string; // YYYY-MM-DD
  from_time: string; // HH:MM
  extra_minutes: number; // e.g., 15, 30, 60
}) =>
  post<{ ok: boolean; id: number }>('/appointments/running-late', payload);

  /**
 * Merge adjacent or overlapping slots (creates/updates open window override).
 */
/**
 * Merge adjacent or overlapping slot windows.
 */
export const mergeSlotWindow = (payload: MergeWindowPayload) =>
  post<{ ok: boolean; id: number }>('/slot-settings/merge-window', payload);

/**
 * Split an existing slot window into two smaller windows.
 */
export const splitSlotWindow = (payload: SplitWindowPayload) =>
  post<{ ok: boolean; id: number }>('/slot-settings/split-window', payload);

/**
 * Update the status of an existing slot window.
 */
export const updateSlotStatus = (payload: UpdateStatusPayload) =>
  post<{ ok: boolean; id: number }>('/slot-settings/update-status', payload);

export async function revertSlotOverride(payload: RevertOverridePayload) {
  return del<void>(`/slot-settings/revert/${payload.slot_setting_id}/${payload.date}`);
}