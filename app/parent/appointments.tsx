import React, {useEffect, useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type Appt = { id:number; slot_ts:string; mode:string; status:string; provider_id:number; pet_id:number };

export default function ParentAppointments(){
  const [items, setItems] = useState<Appt[]>([]);
  const load = async ()=>{
    try { 
      const j = await api.get<Appt>('/appointments?owner_id=1').then(r => r.data); 
      setItems(asArray<Appt>(j, [])); }
    catch { setItems([]); }
  };
  useEffect(()=>{ load(); }, []);

  const cancel = async (id:number)=>{ await api.delete(`/appointments/${id}`); load(); };
  const reschedule = async (id:number)=>{ await api.post(`/appointments/${id}/reschedule`, { proposed_slot: new Date().toISOString() }); load(); };
  const confirmNotify = async (id:number)=>{ await api.post(`/appointments/${id}/confirm`, {}); await api.post(`/appointments/${id}/notify`, {}); load(); };

  return (
    <Screen title="PetCare – Appointments" onBack={()=>router.back()}>
      {items.length===0 && <Text>No appointments yet.</Text>}
      {items.map(a=>(
        <Card key={a.id} title={`#${a.id} • ${a.slot_ts}`}>
          <Text>Mode: {a.mode} • Status: {a.status}</Text>
          <Btn title="Confirm & Notify" onPress={()=>confirmNotify(a.id)} />
          <Btn title="Reschedule" onPress={()=>reschedule(a.id)} />
          <Btn title="Cancel" variant="secondary" onPress={()=>cancel(a.id)} />
        </Card>
      ))}
    </Screen>
  );
}
