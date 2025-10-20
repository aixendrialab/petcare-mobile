// Mount the feature screen at /slots/preview
import React from 'react';
import SlotBrowseScreen from '@/src/features/slot-settings/screens/SlotBrowseScreen';

export default function SlotPreview() {
  return <SlotBrowseScreen slots={[]} />;
}