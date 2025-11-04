import React from 'react';
import LocationPicker from '../components/LocationPicker';
import SlotSettingsList from '../components/SlotSettingsList';
import SlotSettingForm from '../components/SlotSettingForm';
import SlotPreview from '../components/SlotPreview';
import {
  fetchLocations,
  fetchSlotSettingsByLocation,
  fetchSlotPreview,
  deleteSlotSetting,
} from '../api';
import { Location, SlotSetting } from '../types';

// (Optional) If using toast notifications
import toast from 'react-hot-toast';

export default function SlotSettingsScreen() {
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<number | null>(null);
  const [slotSettings, setSlotSettings] = React.useState<SlotSetting[]>([]);
  const [selectedSetting, setSelectedSetting] = React.useState<SlotSetting | null>(null);
  const [previewData, setPreviewData] = React.useState<any>(null);
  const [mode, setMode] = React.useState<'list' | 'form' | 'preview'>('list');

  // ---- Load locations ----
  React.useEffect(() => {
    fetchLocations().then(setLocations);
  }, []);

  // ---- Handle selecting a location ----
  async function handleSelectLocation(id: number) {
    setSelectedLocation(id);
    const settings = await fetchSlotSettingsByLocation(id, 'in_person', false);
    setSlotSettings(settings);
    setMode('list');
  }

  // ---- Handle preview ----
  async function handlePreview(setting: SlotSetting) {
    if (!selectedLocation) return;
    const todayISO = new Date().toISOString().slice(0, 10);
    try {
      const data = await fetchSlotPreview(
        todayISO,
        selectedLocation,
        setting.consultation_type ?? 'in_person'
      );
      setPreviewData(data);
      setSelectedSetting(setting);
      setMode('preview');
    } catch (err) {
      console.error('❌ Error fetching preview:', err);
      alert('Error fetching slot preview');
    }
  }

  // ---- Handle delete ----
  async function handleDelete(setting: SlotSetting) {
    const confirmed = window.confirm(
      `Are you sure you want to delete slot setting ${setting.id}?`
    );
    if (!confirmed) return;

    try {
      await deleteSlotSetting(setting.id);
      setSlotSettings((prev) => prev.filter((x) => x.id !== setting.id));

      if (toast) toast.success('✅ Slot setting deleted');
      else alert('Slot setting deleted successfully');
    } catch (err) {
      console.error('❌ Delete failed:', err);
      if (toast) toast.error('Failed to delete slot setting');
      else alert('Failed to delete slot setting');
    }
  }

  // ---- Conditional Rendering ----
  if (!selectedLocation)
    return <LocationPicker locations={locations} onSelect={handleSelectLocation} />;

  if (mode === 'preview' && selectedSetting && selectedLocation)
    return (
      <SlotPreview
        previewData={previewData}
        onBack={() => setMode('list')}
        locationId={selectedLocation}
        consultationType={selectedSetting.consultation_type ?? 'in_person'}
      />
    );

  if (mode === 'form')
    return (
      <SlotSettingForm
        initial={selectedSetting ?? undefined}
        locationId={selectedLocation}
        onCancel={() => setMode('list')}
        onSave={(s: SlotSetting) => {
          const exists = slotSettings.find((x) => x.id === s.id);
          if (exists)
            setSlotSettings((prev) => prev.map((x) => (x.id === s.id ? s : x)));
          else setSlotSettings((prev) => [...prev, s]);
          setMode('list');
        }}
        onPreview={(dateISO, s) => handlePreview(s)}
      />
    );

  // ---- Default view (list) ----
  return (
    <SlotSettingsList
      settings={slotSettings}
      onAdd={() => {
        setSelectedSetting(null);
        setMode('form');
      }}
      onEdit={(s: SlotSetting) => {
        setSelectedSetting(s);
        setMode('form');
      }}
      onDelete={handleDelete}
      onPreview={(s: SlotSetting) => handlePreview(s)}
    />
  );
}
