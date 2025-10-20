// src/features/slot-settings/types.ts

export type ConsultationType = 'in_person' | 'video';

export type BreakWindow = {
  start: string; // 'HH:mm'
  end: string;   // 'HH:mm'
};

export type WeekWindow = {
  start: string;  // e.g., "09:00"
  end: string;    // e.g., "12:00"
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

export type SlotSettingReadDTO = Partial<SlotSetting>;

export type SlotSetting = {
  id: number;
  user_id: number;
  location_id: number;
  consultation_type: 'in_person' | 'video';
  slot_minutes: number;
  gap_minutes: number;
  per_slot_capacity: number;
  lead_time_minutes: number;
  booking_window_days: number;
  visible_to_parents: boolean;
  week_rules: Record<string, any>;
  blackout_dates: string[];
  effective_from: string | null;
  effective_to: string | null;
};

export interface LocalSlotSetting {
  id?: number;
  locationId?: number;
  consultation_type: 'in_person' | 'video';
  effectiveDate?: string;
  windowStart?: string;
  windowEnd?: string;
  slotMinutes?: number;
  gapMinutes?: number;
  perSlotCapacity?: number;
  breaks?: { start: string; end: string }[];
  blockWindows?: { start: string; end: string }[];
  visibleToParents?: boolean;
  daysOfWeek?: number[];
}

export type Location = {
  id: number;
  name: string;
};

export type Booking = {
  id: number;
  slot_start: string;
  slot_end: string;
  status: string;
};

export interface Slot {
  start: string;
  end: string;
  capacity: number;
  status: 'available' | 'full' | 'blocked';
}

export type PreviewSlot = Slot;

export interface TimeRange {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

export interface BreakRange extends TimeRange {}

export interface OpenWindow extends TimeRange {
  breaks?: BreakRange[];
}

// Slot segment type used in slot preview timeline
// ---- Slot Preview Types ----

export type SlotSegmentStatus =
  | 'available'
  | 'blocked'
  | 'full'
  | 'break'
  | 'gap'
  | 'working';

export interface SlotSegment {
  start: string;
  end: string;
  status: SlotSegmentStatus;
}

export interface SlotSettingInfo {
  id: number;
  slot_minutes: number;
  gap_minutes: number;
  per_slot_capacity: number;
  lead_time_minutes: number;
  booking_window_days: number;
}

export interface SlotPreviewData {
  setting: SlotSettingInfo;
  segments: SlotSegment[];
}

export interface MergeWindowResponse {
  ok: boolean;
  id: number;
  payload: {
    open_windows?: { start: string; end: string }[];
    block_windows?: { start: string; end: string }[];
  };
}

// ────────────────────────────────
// Slot editing payloads
// ────────────────────────────────

// ────────────────────────────────
// Merge two adjacent segments
// ────────────────────────────────

export interface MergeWindowPayload {
  slot_setting_id: number;
  date: string;
  start: string;
  end: string;
  merge_time: string;
  status: 'available' | 'blocked' | 'break' | 'working';
}

export interface SplitWindowPayload {
  slot_setting_id: number;
  date: string;
  start: string;
  end: string;
  split_time: string;
  current_status?: 'available' | 'blocked' | 'break' | 'working'; // 👈 new field
  left_status?: 'available' | 'blocked' | 'break' | 'working';
  right_status?: 'available' | 'blocked' | 'break' | 'working';
}

export interface UpdateStatusPayload {
  slot_setting_id: number;
  date: string;
  start: string;
  end: string;
  status: 'available' | 'blocked' | 'break' | 'working';
}

// ────────────────────────────────
// Extend or shrink a window
// ────────────────────────────────
export interface ExtendWindowPayload {
  slot_setting_id: number;
  date: string;
  start: string;             // current start time of segment
  end: string;               // current end time of segment
  direction: 'start' | 'end'; // which side to move
  new_time: string;           // new start or end value
}

// ────────────────────────────────
// Revert (delete override) to base slot-setting
// ────────────────────────────────
export interface RevertOverridePayload {
  slot_setting_id: number;
  date: string;
}
