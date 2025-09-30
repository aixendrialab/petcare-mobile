import React,{useState} from 'react';
import { Screen, Field, Btn } from '@/src/ui';
import { api } from '@/src/api';
import { router } from 'expo-router';

export default function Intake(){
  const [petId,setPetId]=useState(''); const [notes,setNotes]=useState('');
  const save=async()=>{ await api.post('/stays', { pet_id:Number(petId), instructions:notes, dates:{ from:new Date().toISOString(), to:new Date(Date.now()+86400000).toISOString() } }); alert('Stay created'); router.back(); };
  return (
    <Screen title="Hostel – Intake" onBack={()=>router.back()}>
      <Field placeholder="Pet ID" value={petId} onChangeText={setPetId} icon="paw-outline" keyboardType="numeric" />
      <Field placeholder="Instructions" value={notes} onChangeText={setNotes} icon="document-text-outline" />
      <Btn title="Create stay" onPress={save} />
    </Screen>
  );
}
