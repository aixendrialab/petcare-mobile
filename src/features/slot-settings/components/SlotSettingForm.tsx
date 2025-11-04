// src/features/slot-settings/components/SlotSettingForm.tsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  FlatList,
} from "react-native";
import CalendarDayPicker from "./CalendarDayPicker";
import { BreakWindow, SlotSetting } from "../types";
import { createSlotSetting, updateSlotSetting } from "../api";
import DateField from "@/src/components/DateField";

type Props = {
  initial?: Partial<SlotSetting>;
  locationId: number;
  onCancel: () => void;
  onSave: (s: SlotSetting) => void;
  onPreview: (dateISO: string, s: SlotSetting) => void;
};

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SlotSettingForm({
  initial = {},
  locationId,
  onCancel,
  onSave,
  onPreview,
}: Props) {
  // ------------------------
  // form state
  // ------------------------
  const [consultationType, setConsultationType] = React.useState<
    "in_person" | "video"
  >(initial.consultation_type ?? "in_person");

  const [effectiveFrom, setEffectiveFrom] = React.useState(
    initial.effective_from ?? new Date().toISOString().slice(0, 10)
  );
  const [effectiveTo, setEffectiveTo] = React.useState(
    initial.effective_to ?? new Date().toISOString().slice(0, 10)
  );


  const [slotMinutes, setSlotMinutes] = React.useState(
    String(initial.slot_minutes ?? 15)
  );
  const [gapMinutes, setGapMinutes] = React.useState(
    String(initial.gap_minutes ?? 0)
  );
  const [perSlotCapacity, setPerSlotCapacity] = React.useState(
    String(initial.per_slot_capacity ?? 1)
  );
  const [leadTimeMinutes, setLeadTimeMinutes] = React.useState(
    String(initial.lead_time_minutes ?? 30)
  );
  const [bookingWindowDays, setBookingWindowDays] = React.useState(
    String(initial.booking_window_days ?? 30)
  );
  const [visibleToParents, setVisibleToParents] = React.useState(
    initial.visible_to_parents ?? true
  );

  const [windowStart, setWindowStart] = React.useState("09:00");
  const [windowEnd, setWindowEnd] = React.useState("17:00");
  // Try to extract breaks from initial.week_rules if present
  const initialBreaks =
    initial.week_rules && Object.keys(initial.week_rules).length > 0
      ? (() => {
        const firstDay = Object.keys(initial.week_rules)[0];
        const firstRule = initial.week_rules[firstDay]?.[0];
        return firstRule?.breaks?.length
          ? firstRule.breaks
          : [{ start: "13:00", end: "13:30" }];
      })()
      : [{ start: "13:00", end: "13:30" }];

  const [breaks, setBreaks] = React.useState<BreakWindow[]>(initialBreaks);

  const [daysOfWeek, setDaysOfWeek] = React.useState<number[]>([1, 2, 3, 4, 5]);
  const [blackoutDates, setBlackoutDates] = React.useState<string[]>(
    initial.blackout_dates ?? []
  );
  const [previewDate, setPreviewDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );

  // ------------------------
  // helpers
  // ------------------------
  function toggleDow(i: number) {
    setDaysOfWeek((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i].sort()
    );
  }

  function addBreak() {
    setBreaks((prev) => [...prev, { start: "10:00", end: "10:15" }]);
  }

  function addBlackout() {
    const today = new Date().toISOString().slice(0, 10);
    setBlackoutDates((prev) => [...prev, today]);
  }

  function updateBlackoutDate(idx: number, newDate: string) {
    const next = [...blackoutDates];
    next[idx] = newDate;
    setBlackoutDates(next);
  }

  // ------------------------
  // submit handlers
  // ------------------------
  async function save() {
    const weekRules: any = {};
    daysOfWeek.forEach((i) => {
      const key = DOW[i].toLowerCase();
      weekRules[key] = [{ start: windowStart, end: windowEnd, breaks }];
    });

    const payload: Omit<SlotSetting, "id"> = {
      location_id: locationId,
      consultation_type: consultationType,
      slot_minutes: Number(slotMinutes),
      gap_minutes: Number(gapMinutes),
      per_slot_capacity: Number(perSlotCapacity),
      lead_time_minutes: Number(leadTimeMinutes),
      booking_window_days: Number(bookingWindowDays),
      visible_to_parents: visibleToParents,
      week_rules: weekRules,
      blackout_dates: blackoutDates,
      effective_from: effectiveFrom,
      effective_to: effectiveTo || null,
    };

    try {
      let result: SlotSetting;
      if (initial.id) result = await updateSlotSetting(initial.id, payload);
      else result = await createSlotSetting(payload);
      onSave(result);
    } catch (err) {
      console.error("❌ Save failed", err);
      alert("Failed to save slot setting");
    }
  }

  function preview() {
    const weekRules: any = {};
    daysOfWeek.forEach((i) => {
      const key = DOW[i].toLowerCase();
      weekRules[key] = [{ start: windowStart, end: windowEnd, breaks }];
    });

    const s: SlotSetting = {
      ...initial,
      id: initial.id ?? 0,
      location_id: locationId,
      consultation_type: consultationType,
      slot_minutes: Number(slotMinutes),
      gap_minutes: Number(gapMinutes),
      per_slot_capacity: Number(perSlotCapacity),
      lead_time_minutes: Number(leadTimeMinutes),
      booking_window_days: Number(bookingWindowDays),
      visible_to_parents: visibleToParents,
      week_rules,
      blackout_dates: blackoutDates,
      effective_from: effectiveFrom,
      effective_to: effectiveTo || null,
    };
    onPreview(previewDate, s);
  }

  // ------------------------
  // UI
  // ------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slot Setting</Text>

      {/* Consultation type toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Consultation Type</Text>
        <View style={styles.toggleRow}>
          {[
            { key: "in_person", label: "In-Person" },
            { key: "video", label: "Video" },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() =>
                setConsultationType(opt.key as "in_person" | "video")
              }
              style={[
                styles.toggleBtn,
                consultationType === opt.key && styles.toggleBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleTxt,
                  consultationType === opt.key && styles.toggleTxtActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Effective period */}
      <View style={styles.row}>
        <Text style={styles.label}>Effective From / To</Text>
        <View style={styles.rowHorizontal}>
          <DateField value={effectiveFrom} onChange={setEffectiveFrom} />
          <Text style={{ marginHorizontal: 6 }}>→</Text>
          <DateField value={effectiveTo} onChange={setEffectiveTo} />
        </View>
      </View>

      {/* Slot, gap, capacity */}
      <View style={styles.rowHorizontal}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Slot Minutes</Text>
          <TextInput
            value={slotMinutes}
            onChangeText={setSlotMinutes}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={{ width: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Gap Minutes</Text>
          <TextInput
            value={gapMinutes}
            onChangeText={setGapMinutes}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.rowHorizontal}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Capacity</Text>
          <TextInput
            value={perSlotCapacity}
            onChangeText={setPerSlotCapacity}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={{ width: 10 }} />
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Text style={styles.label}>Visible to Parents</Text>
          <Switch value={visibleToParents} onValueChange={setVisibleToParents} />
        </View>
      </View>

      {/* Lead + booking window */}
      <View style={styles.rowHorizontal}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Lead Time (mins)</Text>
          <TextInput
            value={leadTimeMinutes}
            onChangeText={setLeadTimeMinutes}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={{ width: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Booking Window (days)</Text>
          <TextInput
            value={bookingWindowDays}
            onChangeText={setBookingWindowDays}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      {/* Working window */}
      <View style={styles.row}>
        <Text style={styles.label}>Working Window (Start–End)</Text>
        <View style={styles.rowHorizontal}>
          <TextInput
            value={windowStart}
            onChangeText={setWindowStart}
            placeholder="HH:mm"
            style={styles.input}
          />
          <Text style={{ marginHorizontal: 6 }}>–</Text>
          <TextInput
            value={windowEnd}
            onChangeText={setWindowEnd}
            placeholder="HH:mm"
            style={styles.input}
          />
        </View>
      </View>

      {/* Days of week */}
      <Text style={[styles.label, { marginTop: 8 }]}>Days of Week</Text>
      <View style={styles.dowRow}>
        {DOW.map((d, i) => (
          <TouchableOpacity
            key={d}
            style={[styles.dowBtn, daysOfWeek.includes(i) && styles.dowBtnOn]}
            onPress={() => toggleDow(i)}
          >
            <Text
              style={[styles.dowTxt, daysOfWeek.includes(i) && styles.dowTxtOn]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Breaks */}
      <View style={styles.row}>
        <Text style={styles.label}>Breaks</Text>
        <FlatList
          data={breaks}
          keyExtractor={(_, i) => "b" + i}
          renderItem={({ item, index }) => (
            <View style={styles.rowHorizontal}>
              <TextInput
                value={item.start}
                onChangeText={(v) => {
                  const n = [...breaks];
                  n[index] = { ...n[index], start: v };
                  setBreaks(n);
                }}
                placeholder="HH:mm"
                style={[styles.input, { flex: 1 }]}
              />
              <Text style={{ marginHorizontal: 6 }}>–</Text>
              <TextInput
                value={item.end}
                onChangeText={(v) => {
                  const n = [...breaks];
                  n[index] = { ...n[index], end: v };
                  setBreaks(n);
                }}
                placeholder="HH:mm"
                style={[styles.input, { flex: 1 }]}
              />
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={addBreak} style={styles.smallBtn}>
              <Text style={styles.smallBtnTxt}>
                + Add Break ({breaks.length})
              </Text>
            </TouchableOpacity>

          }
        />
      </View>

      {/* Blackout Dates */}
      <View style={styles.row}>
        <Text style={styles.label}>Blackout Dates</Text>
        <FlatList
          data={blackoutDates}
          keyExtractor={(_, i) => "blk" + i}
          renderItem={({ item, index }) => (
            <View style={{ marginVertical: 4 }}>
              <CalendarDayPicker
                value={item}
                onChange={(v) => updateBlackoutDate(index, v)}
              />
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={addBlackout} style={styles.smallBtn}>
              <Text style={styles.smallBtnTxt}>+ Add Date</Text>
            </TouchableOpacity>
          }
        />
      </View>

      {/* Preview & actions */}
      <View style={{ marginTop: 12 }}>
        <Text style={styles.label}>Preview Date</Text>
        <CalendarDayPicker value={previewDate} onChange={setPreviewDate} />
      </View>

      <View style={styles.ctaRow}>
        <TouchableOpacity
          onPress={onCancel}
          style={[styles.cta, styles.secondary]}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={preview}
          style={[styles.cta, styles.neutral]}
        >
          <Text>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={save} style={[styles.cta, styles.primary]}>
          <Text style={{ color: "#fff" }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  label: { fontSize: 12, color: "#555", marginBottom: 6 },
  row: { marginVertical: 6 },
  rowHorizontal: { flexDirection: "row", alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 90,
  },
  toggleRow: { flexDirection: "row", gap: 10 },
  toggleBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toggleBtnActive: {
    backgroundColor: "#e9f2ff",
    borderColor: "#0b61ff",
  },
  toggleTxt: { fontSize: 13, color: "#444" },
  toggleTxtActive: { fontWeight: "700", color: "#0b61ff" },
  dowRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dowBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
  },
  dowBtnOn: { backgroundColor: "#e9f2ff", borderColor: "#8bb4ff" },
  dowTxt: { fontSize: 12, color: "#444" },
  dowTxtOn: { fontWeight: "700", color: "#0b61ff" },
  smallBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 8,
  },
  smallBtnTxt: { fontWeight: "700" },
  ctaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cta: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  primary: { backgroundColor: "#0b61ff", borderColor: "#0b61ff" },
  neutral: { backgroundColor: "#f3f4f6" },
  secondary: { backgroundColor: "#fff" },
});
