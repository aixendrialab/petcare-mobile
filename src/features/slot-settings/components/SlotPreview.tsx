import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { fetchSlotPreview, mergeSlotWindow, revertSlotOverride, splitSlotWindow, updateSlotStatus } from '../api';
import { MergeWindowPayload, SlotPreviewData } from '../types';

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
  const [zoom, setZoom] = React.useState(2.0); // px per minute
  const [mode, setMode] = React.useState<'view' | 'merge' | 'split' | 'update' | 'revert'>('view');
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
  // Handle segment interactions
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

        const left_status = prompt(
          'Enter LEFT status (available | blocked | break | working)',
          status
        ) as (typeof allowed)[number];

        const right_status = prompt(
          'Enter RIGHT status (available | blocked | break | working)',
          status
        ) as (typeof allowed)[number];

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
      } else if (mode === 'revert') {
        if (!data) return;

        const confirmRevert = confirm(
          `Revert all overrides for date ${date}?\n\nThis will restore slots to base slot settings.`
        );
        if (!confirmRevert) return;

        console.log('♻️ Reverting overrides for', date);
        await revertSlotOverride({
          slot_setting_id: data.setting.id,
          date,
        });

        alert('✅ Overrides reverted successfully!');
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
  // Render Time Ruler
  // ────────────────────────────────
  const renderVerticalTimeRuler = () => {
    if (!data || !data.segments?.length) return null;
    const { segments } = data;
    const startMin = toMinutes(segments[0].start);
    const endMin = toMinutes(segments[segments.length - 1].end);

    const ticks: JSX.Element[] = [];
    for (let t = startMin; t <= endMin; t += 30) {
      const hh = String(Math.floor(t / 60)).padStart(2, '0');
      const mm = String(t % 60).padStart(2, '0');
      ticks.push(
        <Text key={t} style={styles.verticalTick}>
          {`${hh}:${mm}`}
        </Text>
      );
    }

    return <View style={styles.verticalRuler}>{ticks}</View>;
  };

  // ────────────────────────────────
  // Render Timeline (vertical)
  // ────────────────────────────────
  const renderTimeline = () => {
    if (!data || !data.segments?.length) return null;

    const first = toMinutes(data.segments[0].start);
    const last = toMinutes(data.segments[data.segments.length - 1].end);
    const total = last - first;
    const totalHeight = total * zoom;

    return (
      <View style={[styles.timelineContainerAbsolute, { height: totalHeight }]}>
        {data.segments.map((seg, i) => {
          const start = toMinutes(seg.start);
          const end = toMinutes(seg.end);
          const top = (start - first) * zoom;
          const height = (end - start) * zoom;

          let bg = '#22c55e';
          switch (seg.status) {
            case 'blocked':
              bg = '#dc2626';
              break;
            case 'full':
              bg = '#475569';
              break;
            case 'break':
              bg = '#6b7280';
              break;
            case 'gap':
              bg = '#0ea5e9';
              break;
            case 'working':
              bg = '#f59e0b';
              break;
          }

          const isSelected =
            selected && selected.start === seg.start && selected.end === seg.end;

          return (
            <Pressable
              key={i}
              onPress={() => handleSegmentPress(seg)} // ✅ Pass seg directly
              style={({ pressed }) => [
                styles.segmentAbsolute,
                {
                  backgroundColor: bg,
                  top,
                  height,
                  opacity: pressed ? 0.85 : 1,
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: isSelected ? '#3b82f6' : undefined,
                },
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

      {/* Date Picker */}
      <View style={styles.dateRow}>
        <Text style={styles.label}>Select Date:</Text>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.dateInput as any}
        />
      </View>

      {/* Zoom Slider */}
      <View style={styles.zoomRow}>
        <Text style={styles.label}>Zoom:</Text>
        <input
          type="range"
          min={0.8}
          max={3}
          step={0.2}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          style={styles.zoomSlider as any}
        />
        <Text style={styles.zoomValue}>{zoom.toFixed(1)} px/min</Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.actionsRow}>
        {['merge', 'split', 'update', 'revert', 'view'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.actionBtn, mode === m && styles.actionBtnActive]}
            onPress={() => setMode(m as any)}
          >
            <Text style={styles.actionBtnText}>{m[0].toUpperCase() + m.slice(1)}</Text>
          </TouchableOpacity>
        ))}
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

          <View style={styles.legend}>
            <Legend color="#22c55e" label="Available" />
            <Legend color="#ef4444" label="Blocked" />
            <Legend color="#94a3b8" label="Full" />
            <Legend color="#9ca3af" label="Break" />
            <Legend color="#f59e0b" label="Working" />
            <Legend color="#0ea5e9" label="Gap" />
          </View>

          <Text style={styles.summary}>{data?.segments?.length || 0} segments</Text>
        </>
      )}

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ────────────────────────────────
// Legend
// ────────────────────────────────
const Legend = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendColor, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

// ────────────────────────────────
// Styles
// ────────────────────────────────
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
  timelineContainerAbsolute: {
    position: 'relative',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  segmentAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
  },
  timeOverlay: { position: 'absolute', left: 10, top: 4, alignItems: 'flex-start' },
  timeText: { fontSize: 10, fontWeight: '600', color: '#0f172a' },
  segmentStatus: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    textShadowColor: '#0006',
    textShadowRadius: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  actionBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnActive: { backgroundColor: '#1e40af' },
  actionBtnText: { color: '#fff', fontWeight: '600' },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-evenly',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 6 },
  legendColor: { width: 12, height: 12, marginRight: 4, borderRadius: 2 },
  legendText: { fontSize: 12, color: '#333' },
  summary: { textAlign: 'center', color: '#555', marginTop: 8 },
  backButton: { marginTop: 20, padding: 12, backgroundColor: '#3b82f6', borderRadius: 8 },
  backButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
