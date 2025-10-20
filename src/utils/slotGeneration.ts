import { Booking, Slot, SlotSetting } from '../types';

/** Utils */
function toMinutes(hhmm: string): number {
  const [h,m] = hhmm.split(':').map(Number);
  return h*60 + m;
}
function fromMinutes(mins: number): string {
  const h = Math.floor(mins/60).toString().padStart(2,'0');
  const m = (mins%60).toString().padStart(2,'0');
  return `${h}:${m}`;
}
function overlap(a0: number, a1: number, b0: number, b1: number) {
  return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
}
function isDowEnabled(setting: SlotSetting, date: Date): boolean {
  if (!setting.daysOfWeek || setting.daysOfWeek.length === 0) return true;
  const dow = date.getDay(); // 0..6
  return setting.daysOfWeek.includes(dow);
}

export function generateSlotsForDay(setting: SlotSetting, dateISO: string, bookings: Booking[]): Slot[] {
  const date = new Date(dateISO + 'T00:00:00');
  if (!isDowEnabled(setting, date)) return [];

  const dayMinsStart = toMinutes(setting.windowStart);
  const dayMinsEnd   = toMinutes(setting.windowEnd);
  const stride = setting.slotMinutes + setting.gapMinutes;

  // Build base slots
  const base: Slot[] = [];
  let t = dayMinsStart;
  while (t + setting.slotMinutes <= dayMinsEnd) {
    base.push({
      start: fromMinutes(t),
      end: fromMinutes(t + setting.slotMinutes),
      capacity: setting.perSlotCapacity,
      status: 'available'
    });
    t += stride;
  }

  // Mark breaks
  const breaks = (setting.breaks || []).map(b => [toMinutes(b.start), toMinutes(b.end)] as const);
  for (const s of base) {
    const s0 = toMinutes(s.start), s1 = toMinutes(s.end);
    for (const [b0,b1] of breaks) {
      if (overlap(s0,s1,b0,b1) > 0) {
        s.status = 'break';
        s.capacity = 0;
        break;
      }
    }
  }

  // Mark blocked
  const blocks = (setting.blockWindows || []).map(b => [toMinutes(b.start), toMinutes(b.end)] as const);
  for (const s of base) {
    if (s.status !== 'available') continue;
    const s0 = toMinutes(s.start), s1 = toMinutes(s.end);
    for (const [b0,b1] of blocks) {
      if (overlap(s0,s1,b0,b1) > 0) {
        s.status = 'blocked';
        s.capacity = 0;
        break;
      }
    }
  }

  // Apply bookings
  for (const s of base) {
    if (s.status !== 'available') continue;
    const s0 = toMinutes(s.start), s1 = toMinutes(s.end);
    for (const bk of bookings) {
      const b0 = toMinutes(bk.start), b1 = toMinutes(bk.end);
      if (overlap(s0,s1,b0,b1) > 0) {
        const remaining = s.capacity - bk.count;
        if (remaining <= 0) {
          s.status = 'booked';
          s.capacity = 0;
        } else {
          s.capacity = remaining as number;
        }
      }
    }
  }

  return base;
}
