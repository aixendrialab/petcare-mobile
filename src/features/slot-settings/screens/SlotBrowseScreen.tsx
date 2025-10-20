// src/features/slots/components/SlotList.tsx
import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import type { PreviewSlot as Slot } from '@/src/state/slots';

export default function SlotBrowseScreen({
  slots,
  onPress,
}: {
  slots: Slot[];
  onPress?: (s: Slot) => void;
}) {
  return (
    <FlatList
      data={slots}
      keyExtractor={(s, i) => `${s.start}-${s.end}-${i}`}
      ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onPress?.(item)}
          disabled={!onPress}
          style={{ opacity: item.capacity === 0 || item.status === 'blocked' ? 0.45 : 1 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
            <Text>{item.start}–{item.end}</Text>
            <Text>{item.status}  cap {item.capacity}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}
