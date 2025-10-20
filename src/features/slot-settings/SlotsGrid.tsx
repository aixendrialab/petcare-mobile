// src/features/slots/components/SlotsGrid.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { PreviewSlot } from '@/src/state/slots';

export type SlotItem = {
  start: string;
  end: string;
  status: 'available' | 'break' | 'blocked' | 'booked' | 'partial';
  capacity?: number;
  booked?: number;
  id?: string | number;
};

type Props = {
  slots: (PreviewSlot | SlotItem)[];
  onPressSlot?: (slot: SlotItem) => void;
  onLongPressSlot?: (slot: SlotItem) => void;
  compact?: boolean;
};

export default function SlotsGrid({ slots, onPressSlot, onLongPressSlot, compact }: Props) {
  return (
    <View style={styles.wrap}>
      {slots.map((s, idx) => {
        const base = s as any;
        const computed: SlotItem = {
          start: base.start, end: base.end, id: base.id,
          status: inferStatus(base),
          capacity: base.capacity, booked: base.booked,
        };
        const key = computed.id ?? `${computed.start}-${computed.end}-${idx}`;
        const { bg, fg, border } = colorsForStatus(computed.status);
        return (
          <Pressable
            key={key}
            onPress={() => onPressSlot?.(computed)}
            onLongPress={() => onLongPressSlot?.(computed)}
            style={[
              styles.item,
              compact && styles.compact,
              { backgroundColor: bg, borderColor: border },
              computed.status === 'break' && styles.dashed,
            ]}
          >
            <Text style={[styles.time, { color: fg }]}>
              {computed.start} – {computed.end}
            </Text>
            <Text style={[styles.badge, { color: fg }]}>{labelFor(computed)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function inferStatus(s: any): SlotItem['status'] {
  if (s.status === 'break' || s.status === 'blocked' || s.status === 'booked' || s.status === 'available') {
    if (s.status === 'available' && typeof s.booked === 'number' && typeof s.capacity === 'number' && s.booked > 0 && s.booked < s.capacity) {
      return 'partial';
    }
    return s.status;
  }
  // fallback: compute from numbers
  const b = s.booked ?? 0, c = s.capacity ?? 1;
  if (c <= 0) return 'blocked';
  if (b >= c) return 'booked';
  if (b > 0) return 'partial';
  return 'available';
}

function labelFor(s: SlotItem) {
  switch (s.status) {
    case 'available': return 'available';
    case 'break': return 'break';
    case 'blocked': return 'blocked';
    case 'booked': return 'booked';
    case 'partial': return `${s.booked ?? 0}/${s.capacity ?? 1}`;
  }
}

function colorsForStatus(status: SlotItem['status']) {
  switch (status) {
    case 'available': return { bg: '#DEF7E7', fg: '#0B5D3B', border: '#8BD4B2' };
    case 'partial':   return { bg: '#E5F0FF', fg: '#0A3B8E', border: '#A7C5FF' };
    case 'booked':    return { bg: '#FFE2E0', fg: '#8B1A17', border: '#FFB4AF' };
    case 'blocked':   return { bg: '#EEE', fg: '#666', border: '#CCC' };
    case 'break':     return { bg: '#F5F5F5', fg: '#777', border: '#DDD' };
  }
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  item: { minWidth: 140, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  compact: { minWidth: 120, paddingVertical: 8, paddingHorizontal: 10 },
  time: { fontWeight: '600', fontSize: 14 },
  badge: { fontSize: 12, marginTop: 4, opacity: 0.9 },
  dashed: { borderStyle: 'dashed' },
});
