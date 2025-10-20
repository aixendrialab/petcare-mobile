// src/features/slots/components/SlotForm.tsx
import React, { useMemo } from 'react';
import { View, TextInput, Switch, Text } from 'react-native';
import { Btn, Card, CardContent } from '@/src/ui';
import type { SlotSetting, WeekRules, ConsultationType } from '@/src/state/slots';

type Props = {
  value?: SlotSetting | null;      // <- allow null/undefined
  onChange: (v: SlotSetting) => void;
  onSave: (v: SlotSetting) => Promise<void> | void;
  saving?: boolean;
};

export default function SlotForm({ value, onChange, onSave, saving }: Props) {
  if (!value) return null;
  const jsonWeek = useMemo(() => JSON.stringify(value.week_rules ?? {}, null, 2), [value.week_rules]);
  const jsonBlackout = useMemo(() => (value.blackout_dates ?? []).join('\n'), [value.blackout_dates]);

  const set = (patch: Partial<SlotSetting>) => onChange({ ...value, ...patch });

  return (
    <Card>
      <CardContent>
        <Field label="Location ID">
          <TextInput
            keyboardType="numeric"
            value={String(value.location_id ?? '')}
            onChangeText={t => set({ location_id: Number(t) || 0 })}
            placeholder="e.g. 101"
          />
        </Field>

        <Field label="Consultation type (in_person / video)">
          <TextInput
            value={value.consultation_type}
            onChangeText={(t) => set({ consultation_type: (t as ConsultationType) || 'in_person' })}
            placeholder="in_person or video"
            autoCapitalize="none"
          />
        </Field>

        <Row>
          <Field label="Slot minutes">
            <TextInput
              keyboardType="numeric"
              value={String(value.slot_minutes ?? '')}
              onChangeText={t => set({ slot_minutes: Number(t) || 0 })}
            />
          </Field>
          <Spacer />
          <Field label="Gap minutes">
            <TextInput
              keyboardType="numeric"
              value={String(value.gap_minutes ?? '')}
              onChangeText={t => set({ gap_minutes: Number(t) || 0 })}
            />
          </Field>
        </Row>

        <Row>
          <Field label="Capacity per slot">
            <TextInput
              keyboardType="numeric"
              value={String(value.per_slot_capacity ?? '')}
              onChangeText={t => set({ per_slot_capacity: Number(t) || 0 })}
            />
          </Field>
          <Spacer />
          <Field label="Lead time (minutes)">
            <TextInput
              keyboardType="numeric"
              value={String(value.lead_time_minutes ?? '')}
              onChangeText={t => set({ lead_time_minutes: Number(t) || 0 })}
            />
          </Field>
        </Row>

        <Field label="Booking window (days)">
          <TextInput
            keyboardType="numeric"
            value={String(value.booking_window_days ?? '')}
            onChangeText={t => set({ booking_window_days: Number(t) || 0 })}
          />
        </Field>

        <Field label="Visible to parents">
          <Switch
            value={!!value.visible_to_parents}
            onValueChange={(v) => set({ visible_to_parents: v })}
          />
        </Field>

        <Row>
          <Field label="Effective from (UTC YYYY-MM-DD)">
            <TextInput
              value={value.effective_from ?? ''}
              onChangeText={(t) => set({ effective_from: t || null })}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
            />
          </Field>
          <Spacer />
          <Field label="Effective to (UTC YYYY-MM-DD)">
            <TextInput
              value={value.effective_to ?? ''}
              onChangeText={(t) => set({ effective_to: t || null })}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
            />
          </Field>
        </Row>

        <Field label="Week rules (JSON)">
          <TextInput
            multiline
            numberOfLines={10}
            value={jsonWeek}
            onChangeText={(t) => {
              try {
                const parsed = JSON.parse(t) as WeekRules;
                set({ week_rules: parsed });
              } catch {
                // ignore while typing
              }
            }}
            placeholder={`{"mon":[{"start":"09:00","end":"12:00","breaks":[{"start":"10:00","end":"10:15"}]}]}`}
            autoCapitalize="none"
          />
        </Field>

        <Field label="Blackout dates (one UTC date per line)">
          <TextInput
            multiline
            numberOfLines={4}
            value={jsonBlackout}
            onChangeText={(t) => set({ blackout_dates: (t || '').split('\n').map(s => s.trim()).filter(Boolean) })}
            placeholder={"2025-10-22\n2025-11-04"}
            autoCapitalize="none"
          />
        </Field>

        <Btn title={saving ? 'Saving…' : 'Save'} onPress={()=>onSave} disabled={!!saving} />
      </CardContent>
    </Card>
  );
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>{props.label}</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#DDD',
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}
      >
        {props.children}
      </View>
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: 12 }}>{children}</View>;
}
function Spacer() { return <View style={{ width: 12 }} />; }
