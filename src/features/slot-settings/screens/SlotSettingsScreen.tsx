import React from 'react';
import LocationPicker from '../components/LocationPicker';
import SlotSettingsList from '../components/SlotSettingsList';
import SlotSettingForm from '../components/SlotSettingForm';
import SlotPreview from '../components/SlotPreview';
import { fetchLocations, fetchSlotSettingsByLocation, fetchSlotPreview } from '../api';
import { Location, LocalSlotSetting } from '../types';

export default function SlotSettingsScreen() {
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<number | null>(null);
  const [slotSettings, setSlotSettings] = React.useState<LocalSlotSetting[]>([]);
  const [selectedSetting, setSelectedSetting] = React.useState<LocalSlotSetting | null>(null);
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
  async function handlePreview(setting: LocalSlotSetting) {
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
        onCancel={() => setMode('list')}
        onSave={(s: Omit<LocalSlotSetting, 'id'>) => {
          setSlotSettings([...slotSettings, s]);
          setMode('list');
        }}
        onPreview={(dateISO, s) => handlePreview(s as LocalSlotSetting)}
      />
    );

  return (
    <SlotSettingsList
      settings={slotSettings}
      onAdd={() => setMode('form')}
      onEdit={(s: LocalSlotSetting) => {
        setSelectedSetting(s);
        setMode('form');
      }}
      onDelete={(s: LocalSlotSetting) => {
        setSlotSettings(prev => prev.filter(x => x.id !== s.id));
      }}
      onPreview={(s: LocalSlotSetting) => {
        setSelectedSetting(s);
        handlePreview(s);
      }}
    />
  );
}
