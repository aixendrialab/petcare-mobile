// Mount the feature screen at /slots/preview
import React from 'react';
import SlotBrowseScreen from '@/src/features/slot-settings/screens/SlotBrowseScreen'
import { PreviewSlot } from '../slots';

export default function SlotPreviewRoute() {
  const slots: PreviewSlot[] = []; 
  return <SlotBrowseScreen slots={slots}/>;
}
