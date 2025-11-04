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
// src/features/slot-settings/api.ts

export const fetchSlotSettingsByLocation = async (
  id: number,
  consultationType: 'video' | 'in_person' = 'in_person',
  includeInactive = false
): Promise<SlotSetting[]> => {
  const data = await get<SlotSetting[]>(
    `/slot-settings?location_id=${id}&consultation_type=${consultationType}&include_inactive=${includeInactive}`
  );

  return data.map((s) => ({
    ...s,
    slot_summary: summarizeWeekRules(s.week_rules),
    break_count: countBreaks(s.week_rules),
  }));
};

function summarizeWeekRules(week_rules: any): string {
  if (!week_rules) return '—';
  const days = Object.keys(week_rules);
  for (const d of days) {
    const windows = week_rules[d];
    if (windows && windows.length > 0) {
      const first = windows[0];
      const dayName = d.charAt(0).toUpperCase() + d.slice(1);
      return `${dayName} ${first.start}–${first.end}`;
    }
  }
  return '—';
}

function countBreaks(week_rules: any): number {
  let total = 0;
  Object.values(week_rules || {}).forEach((v: any) =>
    (v || []).forEach((win: any) => (total += win.breaks?.length || 0))
  );
  return total;
}

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


/**
 * Revert an override for a specific date/setting.
 */
export const revertSlotOverride = (payload: RevertOverridePayload) =>
  del<{ ok: boolean }>(
    `/slot-settings/revert/${payload.slot_setting_id}/${payload.date}`
  );
