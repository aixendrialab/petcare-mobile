import React,{useEffect,useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type Q = { id:number; pet:string; owner:string; triage:'routine'|'urgent'|'emergency'; status:'arrived'|'in_consult'|'out' };
const FALLBACK: Q[] = [
  { id:1, pet:'Milo', owner:'Sam', triage:'routine', status:'arrived' },
  { id:2, pet:'Coco', owner:'Ava', triage:'urgent', status:'arrived' },
];

export default function VetQueue(){
  const [items,setItems]=useState<Q[]>([]);
  const load = async ()=>{
    try {
      const j = await api.get<Q>('/providers/1/queue?date=today').then(r => r.data);
      setItems(asArray<Q>(j, FALLBACK));
    } catch { setItems(FALLBACK); }
  };
  useEffect(()=>{ load(); }, []);

  const advance = async (id:number, status:Q['status'])=>{
    try { await api.patch(`/queue/${id}`, { status }); } catch {}
    load();
  };

  return (
    <Screen title="PetCare – Veterinarian" subtitle="Queue" onBack={()=>router.back()}>
      {items.map(q=>(
        <Card key={q.id} title={`${q.pet} (${q.triage})`}>
          <Text>Owner: {q.owner} • Status: {q.status}</Text>
          <Btn title="Start consult" onPress={()=>advance(q.id,'in_consult')} />
          <Btn title="Mark out" variant="secondary" onPress={()=>advance(q.id,'out')} />
        </Card>
      ))}
    </Screen>
  );
}
