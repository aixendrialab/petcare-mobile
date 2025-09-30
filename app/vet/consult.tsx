// mobile/app/vet/consult.tsx
import React, { useState } from 'react';
import { Screen, Card, Field, Btn } from '@/src/ui';
import { api } from '@/src/api';
import { router } from 'expo-router';

export default function VetConsult(){
  const [petId, setPetId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const save = async ()=>{
    await api.post('/consults', { appointment_id: null, diagnosis, notes, pet_id: Number(petId||1) });
    alert('Consult saved');
  };

  return (
    <Screen title="Consult Editor" subtitle="Record diagnosis, notes, Rx and generate invoice" onBack={()=>router.back()}>
      <Card title="Consult">
        <Field placeholder="Pet ID" value={petId} onChangeText={setPetId} icon="paw-outline" keyboardType="numeric" />
        <Field placeholder="Diagnosis" value={diagnosis} onChangeText={setDiagnosis} icon="document-text-outline" />
        <Field placeholder="Notes" value={notes} onChangeText={setNotes} icon="create-outline" />
      </Card>
      <Btn title="Save Consult" onPress={save} />
    </Screen>
  );
}
