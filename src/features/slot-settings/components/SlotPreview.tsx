import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { fetchSlotPreview, mergeSlotWindow, revertSlotOverride, splitSlotWindow, updateSlotStatus } from '../api';
import { SlotPreviewData } from '../types';

interface Props {
  previewData: SlotPreviewData;
  onBack: () => void;
  locationId: number;
  consultationType: 'video' | 'in_person';
}

export default function SlotPreview({
  previewData: initialData,
  onBack,
  locationId,
  consultationType,
}: Props) {
  const [data, setData] = React.useState<SlotPreviewData | null>(initialData);
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = React.useState(false);
  const [zoom, setZoom] = React.useState(2.0);
  const [mode, setMode] = React.useState<'view' | 'merge' | 'split' | 'update'>('view');
  const [selected, setSelected] = React.useState<{ start: string; end: string } | null>(null);

  React.useEffect(() => {
    async function reload() {
      setLoading(true);
      try {
        const res = await fetchSlotPreview(date, locationId, consultationType);
        setData(res);
      } catch (err) {
        console.error('❌ Error fetching slot preview:', err);
        alert('Error loading slot preview');
      } finally {
        setLoading(false);
      }
    }
    reload();
  }, [date, locationId, consultationType]);

  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  // ────────────────────────────────
  // Handle Revert directly (no mode)
  // ────────────────────────────────
  const handleRevert = async () => {
    if (!data) {
      alert('No slot data loaded.');
      return;
    }

    const confirmRevert = confirm(
      `Revert all overrides for date ${date}?\n\nThis will restore slots to base slot settings.`
    );
    if (!confirmRevert) return;

    try {
      console.log('♻️ Reverting overrides for', date);
      const res = await revertSlotOverride({
        slot_setting_id: data.setting.id,
        date,
      });
      console.log('✅ Revert result:', res);
      alert('✅ Overrides reverted successfully!');

      const updated = await fetchSlotPreview(date, locationId, consultationType);
      setData(updated);
    } catch (err) {
      console.error('❌ Revert failed:', err);
      alert('❌ Revert failed. See console for details.');
    }
  };

  // ────────────────────────────────
  // Handle segment press (merge/split/update)
  // ────────────────────────────────
  const handleSegmentPress = async (seg: { start: string; end: string; status: string }) => {
    if (!data) return;
    const { start, end, status } = seg;

    try {
      if (mode === 'merge') {
        const merge_time = prompt(`Enter merge time (earlier or later than ${start}-${end})`);
        if (!merge_time) return;

        const new_status = prompt('Enter merged status (available | blocked | break | working)', status);
        const allowed = ['available', 'blocked', 'break', 'working'] as const;
        if (!new_status || !allowed.includes(new_status as any)) {
          alert('Invalid status. Please enter one of: available, blocked, break, working.');
          return;
        }

        const payload = {
          slot_setting_id: data.setting.id,
          date,
          start,
          end,
          merge_time,
          status: new_status as (typeof allowed)[number],
        };

        console.log('🧩 Merging with payload:', payload);
        await mergeSlotWindow(payload);
      } else if (mode === 'split') {
        const split_time = prompt(`Enter split time between ${start} and ${end}`);
        if (!split_time) return;

        const allowed = ['available', 'blocked', 'break', 'working'] as const;
        const left_status = prompt('Enter LEFT status (available | blocked | break | working)', status) as (typeof allowed)[number];
        const right_status = prompt('Enter RIGHT status (available | blocked | break | working)', status) as (typeof allowed)[number];

        if (!left_status || !allowed.includes(left_status) || !right_status || !allowed.includes(right_status)) {
          alert('Invalid status. Please enter one of: available, blocked, break, working.');
          return;
        }

        const payload = {
          slot_setting_id: data.setting.id,
          date,
          start,
          end,
          split_time,
          current_status: status as (typeof allowed)[number],
          left_status,
          right_status,
        };

        console.log('✂️ Splitting window with payload:', payload);
        await splitSlotWindow(payload);
      } else if (mode === 'update') {
        const statusInput = prompt('Enter new status: available | blocked | break | working', status);
        if (!statusInput) return;

        const allowed = ['available', 'blocked', 'break', 'working'] as const;
        if (!allowed.includes(statusInput as any)) {
          alert('Invalid status. Please enter one of: available, blocked, break, working.');
          return;
        }

        const payload = {
          slot_setting_id: data.setting.id,
          date,
          start,
          end,
          status: statusInput as (typeof allowed)[number],
        };

        console.log('🟡 Updating slot status with payload:', payload);
        await updateSlotStatus(payload);
      }

      // 🔁 Always refresh
      const updated = await fetchSlotPreview(date, locationId, consultationType);
      console.log('✅ Refetched updated preview');
      setData(updated);
    } catch (err) {
      console.error('❌ Operation failed:', err);
      alert('Operation failed');
    }
  };

  // ────────────────────────────────
  // Render ruler and timeline
  // ────────────────────────────────
  const renderVerticalTimeRuler = () => {
    if (!data || !data.segments?.length) return null;
    const startMin = toMinutes(data.segments[0].start);
    const endMin = toMinutes(data.segments[data.segments.length - 1].end);

    const ticks: JSX.Element[] = [];
    for (let t = startMin; t <= endMin; t += 30) {
      const hh = String(Math.floor(t / 60)).padStart(2, '0');
      const mm = String(t % 60).padStart(2, '0');
      ticks.push(<Text key={t} style={styles.verticalTick}>{`${hh}:${mm}`}</Text>);
    }
    return <View style={styles.verticalRuler}>{ticks}</View>;
  };

  const renderTimeline = () => {
    if (!data || !data.segments?.length) return null;
    const first = toMinutes(data.segments[0].start);
    const last = toMinutes(data.segments[data.segments.length - 1].end);
    const totalHeight = (last - first) * zoom;

    return (
      <View style={[styles.timelineContainerAbsolute, { height: totalHeight }]}>
        {data.segments.map((seg, i) => {
          const start = toMinutes(seg.start);
          const end = toMinutes(seg.end);
          const top = (start - first) * zoom;
          const height = (end - start) * zoom;

          let bg = '#22c55e';
          switch (seg.status) {
            case 'blocked': bg = '#dc2626'; break;
            case 'full': bg = '#475569'; break;
            case 'break': bg = '#6b7280'; break;
            case 'gap': bg = '#0ea5e9'; break;
            case 'working': bg = '#f59e0b'; break;
          }

          const isSelected = selected && selected.start === seg.start && selected.end === seg.end;

          return (
            <Pressable
              key={i}
              onPress={() => handleSegmentPress(seg)}
              style={({ pressed }) => [
                styles.segmentAbsolute,
                { backgroundColor: bg, top, height, opacity: pressed ? 0.85 : 1, borderWidth: isSelected ? 2 : 0, borderColor: isSelected ? '#3b82f6' : undefined },
              ]}
            >
              <View style={styles.timeOverlay}>
                <Text style={styles.timeText}>{seg.start}</Text>
                <Text style={styles.timeText}>{seg.end}</Text>
              </View>
              <Text style={styles.segmentStatus}>{seg.status.toUpperCase()}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  // ────────────────────────────────
  // UI Layout
  // ────────────────────────────────
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Slot Preview</Text>

      <View style={styles.dateRow}>
        <Text style={styles.label}>Select Date:</Text>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.dateInput as any} />
      </View>

      <View style={styles.zoomRow}>
        <Text style={styles.label}>Zoom:</Text>
        <input type="range" min={0.8} max={3} step={0.2} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} style={styles.zoomSlider as any} />
        <Text style={styles.zoomValue}>{zoom.toFixed(1)} px/min</Text>
      </View>

      {/* Top toolbar */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setMode('merge')}>
          <Text style={styles.actionBtnText}>Merge</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setMode('split')}>
          <Text style={styles.actionBtnText}>Split</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setMode('update')}>
          <Text style={styles.actionBtnText}>Update</Text>
        </TouchableOpacity>

        {/* ✅ Revert now works directly here */}
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#dc2626' }]} onPress={handleRevert}>
          <Text style={styles.actionBtnText}>Revert</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setMode('view')}>
          <Text style={styles.actionBtnText}>View</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <>
          <ScrollView style={{ maxHeight: 600 }}>
            <View style={styles.timelineContainer}>
              <View style={styles.verticalRulerWrapper}>{renderVerticalTimeRuler()}</View>
              <View style={{ flex: 1 }}>{renderTimeline()}</View>
            </View>
          </ScrollView>
        </>
      )}

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  label: { fontSize: 14 },
  dateInput: { border: '1px solid #ccc', borderRadius: 8, padding: '6px 8px' },
  zoomRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  zoomSlider: { width: 150, accentColor: '#22c55e' },
  zoomValue: { fontSize: 12, color: '#555', minWidth: 50 },
  loading: { textAlign: 'center', color: '#666', marginTop: 10 },
  timelineContainer: { flexDirection: 'row', marginVertical: 10, minHeight: 70 },
  verticalRulerWrapper: { width: 40, alignItems: 'center', marginRight: 6 },
  verticalRuler: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  verticalTick: { fontSize: 10, color: '#555' },
  timelineContainerAbsolute: { position: 'relative', width: '100%', borderRadius: 10, backgroundColor: '#f1f5f9', overflow: 'hidden' },
  segmentAbsolute: { position: 'absolute', left: 0, right: 0, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#fff', borderRadius: 4 },
  timeOverlay: { position: 'absolute', left: 10, top: 4, alignItems: 'flex-start' },
  timeText: { fontSize: 10, fontWeight: '600', color: '#0f172a' },
  segmentStatus: { color: '#fff', fontWeight: '600', fontSize: 12, textShadowColor: '#0006', textShadowRadius: 1 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 },
  actionBtn: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  actionBtnText: { color: '#fff', fontWeight: '600' },
  backButton: { marginTop: 20, padding: 12, backgroundColor: '#3b82f6', borderRadius: 8 },
  backButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
