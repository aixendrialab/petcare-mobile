import React,{useEffect,useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type Walk={ id:number; pet_id:number; when:string; status:'scheduled'|'in_progress'|'done' };
export default function Walks(){
  const [items,setItems]=useState<Walk[]>([]);
  const load=async()=>{
    try {
      const j = await api.get<Walk[] | Walk>('/walks').then(r => r.data);
      setItems(asArray<Walk>(j, [{ id:1, pet_id:1, when:'2025-09-20T10:00:00+05:30', status:'scheduled' }]));
    } catch {
      setItems([{ id:1, pet_id:1, when:'2025-09-20T10:00:00+05:30', status:'scheduled' }]);
    }
  };
  useEffect(()=>{ load(); }, []);
  return (
    <Screen title="Walker – My Walks" onBack={()=>router.back()}>
      {items.map(w=>(
        <Card key={w.id} title={`Walk #${w.id} • ${w.when}`}>
          <Text>Pet #{w.pet_id} • Status: {w.status}</Text>
          <Btn title="Open" onPress={()=>router.push(`/walker/walk/${w.id}`)} />
        </Card>
      ))}
    </Screen>
  );
}
