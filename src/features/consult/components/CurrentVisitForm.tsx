import React from 'react';
import { View } from 'react-native';
import { Card, Field, Btn } from '@/src/ui';
import { ConsultDraft, MedicationDraft } from '../types';
import { PrescriptionRow } from './PrescriptionRow';

interface Props {
  draft: ConsultDraft;
  setDraft: React.Dispatch<React.SetStateAction<ConsultDraft>>;
}

export function CurrentVisitForm({ draft, setDraft }: Props) {
  const update = (key: keyof ConsultDraft, value: any) =>
    setDraft({ ...draft, [key]: value });

  const vitals = draft.vitals ?? {};

  const updateVitals = (key: keyof ConsultDraft['vitals'], val: string) =>
    setDraft({ ...draft, vitals: { ...draft.vitals, [key]: val } });

  const addMedicine = () => {
    const newMed: MedicationDraft = {
      name: '',
      dose: '',
      frequency: '',
      days: '',
      notes: '',
    };
    setDraft({ ...draft, medications: [...draft.medications, newMed] });
  };

  const updateMedicine = (i: number, newItem: MedicationDraft) => {
    const meds = [...draft.medications];
    meds[i] = newItem;
    setDraft({ ...draft, medications: meds });
  };

  return (
    <View>
      <Card title="Reason & Symptoms">
        <Field
          placeholder="Reason for visit"
          value={draft.reason}
          onChangeText={(v) => update('reason', v)}
        />
        <Field
          placeholder="Symptom details / onset"
          multiline
          value={draft.symptomNotes}
          onChangeText={(v) => update('symptomNotes', v)}
        />
      </Card>

      <Card title="Vitals">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Field
            placeholder="Weight (kg)"
            keyboardType="decimal-pad"
            value={vitals.weightKg}
            onChangeText={(v) => updateVitals('weightKg', v)}
          />
          <Field
            placeholder="Temp (°C)"
            value={vitals.temp}
            onChangeText={(v) => updateVitals('temp', v)}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Field
            placeholder="Heart rate"
            value={vitals.heartRate}
            onChangeText={(v) => updateVitals('heartRate', v)}
          />
          <Field
            placeholder="Resp rate"
            value={vitals.respRate}
            onChangeText={(v) => updateVitals('respRate', v)}
          />
        </View>

        <Field
          placeholder="Notes"
          value={vitals.notes}
          onChangeText={(v) => updateVitals('notes', v)}
        />
      </Card>

      <Card title="Clinical Findings">
        <Field
          placeholder="Exam findings"
          multiline
          value={draft.findings}
          onChangeText={(v) => update('findings', v)}
        />
      </Card>

      <Card title="Diagnosis">
        <Field
          placeholder="Primary diagnosis"
          value={draft.diagnosis}
          onChangeText={(v) => update('diagnosis', v)}
        />
      </Card>

      <Card title="Treatment & Prescription">
        {draft.medications.map((m, i) => (
          <PrescriptionRow
            key={i}
            item={m}
            onChange={(newItem) => updateMedicine(i, newItem)}
          />
        ))}
        <Btn title="Add medicine" onPress={addMedicine} />
      </Card>

      <Card title="Advice & Follow-up">
        <Field
          placeholder="Advice / home care"
          multiline
          value={draft.advice}
          onChangeText={(v) => update('advice', v)}
        />
        <Field
          placeholder="Follow-up date (yyyy-mm-dd)"
          value={draft.followUpDate}
          onChangeText={(v) => update('followUpDate', v)}
        />
      </Card>
    </View>
  );
}
