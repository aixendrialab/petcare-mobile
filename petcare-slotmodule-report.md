# PetCare Slot Module — Consolidation Report

This table lists all slot-related files detected across your project, indicating which ones to keep or remove.

| File | Action | Notes |
|------|---------|-------|
| `app/parent/slots.tsx` | **KEEP** | Canonical |
| `app/slots/preview.tsx` | **KEEP** | Canonical |
| `app/slots/settings.tsx` | **KEEP** | Canonical |
| `app/vet/slot-settings.tsx` | **KEEP** | Canonical |
| `app/vet/slot.tsx` | **KEEP** | Canonical |
| `app/vet/slots-preview.tsx` | **KEEP** | Canonical |
| `app/walker/slot-settings.tsxt` | **KEEP** | Latest by name |
| `src/components/CalendarDayPicker.tsx` | **KEEP** | Canonical |
| `src/components/LocationPicker.tsx` | **KEEP** | Canonical |
| `src/components/SlotPreview.tsx` | **KEEP** | Canonical |
| `src/components/SlotSettingForm.tsx` | **KEEP** | Canonical |
| `src/components/SlotSettingsList.tsx` | **KEEP** | Canonical |
| `src/features/slots/SlotBrowseScreen.tsx` | **KEEP** | Canonical |
| `src/features/slots/SlotSettingsScreen.tsx` | **KEEP** | Canonical |
| `src/features/slots/components/SlotForm.tsx` | **KEEP** | Canonical |
| `src/features/slots/components/SlotList.tsx` | **KEEP** | Latest by name |
| `src/features/slots/components/SlotsGrid.tsx` | **KEEP** | Canonical |
| `src/screens/SlotSettingsScreen.tsx` | **KEEP** | Canonical |
| `src/state/slots.ts` | **KEEP** | Canonical |
| `src/utils/slotGeneration.ts` | **KEEP** | Canonical |
| `app/walker/slot-settings.tsxt` | **REMOVE** | Duplicate of app/vet/slot-settings.tsx |
| `src/features/slots/components/SlotList.tsx` | **REMOVE** | Duplicate of src/features/slots/SlotBrowseScreen.tsx |
