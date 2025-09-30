import React, {useEffect, useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Book(){
  const [providers, setProviders] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selProv, setSelProv] = useState<number|undefined>();
  useEffect(()=>{ fetch(`${API_BASE}/providers?role=veterinarian`).then(r=>r.json()).then(setProviders); }, []);
  const pickProv = async (id:number)=>{ setSelProv(id); const j = await (await fetch(`${API_BASE}/providers/${id}/slots`)).json(); setSlots(j.slots); };
  const book = async (slot:string)=>{
    const payload = { pet_id: 1, provider_id: selProv, slot, mode: 'inperson' };
    const res = await fetch(`${API_BASE}/appointments`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    const j = await res.json(); alert(`Booked #${j.id}`);
  };
  return (
    <Screen>
      {!selProv && providers.map(p => <Card key={p.id} title={p.name}><Btn title="Select" onPress={()=>pickProv(p.id)} /></Card>)}
      {selProv && slots.map(s => <Card key={s} title={s}><Btn title="Book" onPress={()=>book(s)} /></Card>)}
    </Screen>
  );
}
