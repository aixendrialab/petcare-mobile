import React from 'react';
import { View } from 'react-native';
import { Field } from '@/src/ui';
import { MedicationDraft } from '../types';

interface Props {
  item: MedicationDraft;
  onChange: (item: MedicationDraft) => void;
}

export function PrescriptionRow({ item, onChange }: Props) {
  const update = (key: keyof MedicationDraft, value: string) =>
    onChange({ ...item, [key]: value });

  return (
    <View style={{ marginBottom: 12 }}>
      <Field
        placeholder="Medicine name"
        value={item.name}
        onChangeText={(v) => update('name', v)}
      />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Field
          placeholder="Dose"
          value={item.dose}
          onChangeText={(v) => update('dose', v)}
        />
        <Field
          placeholder="Freq"
          value={item.frequency}
          onChangeText={(v) => update('frequency', v)}
        />
        <Field
          placeholder="Days"
          value={item.days}
          keyboardType="numeric"
          onChangeText={(v) => update('days', v)}
        />
      </View>

      <Field
        placeholder="Notes (optional)"
        value={item.notes}
        onChangeText={(v) => update('notes', v)}
      />
    </View>
  );
}
