import React,{useEffect,useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type Stay={ id:number; pet_id:number; from:string; to:string; status:string };
export default function Stays(){
  const [items,setItems]=useState<Stay[]>([]);
  const load=async()=>{
    try {
      const j = await api.get<Stay>('/providers/10/stays?date=today').then(r => r.data);;
      setItems(asArray<Stay>(j, [{ id:1, pet_id:1, from:'2025-09-20', to:'2025-09-21', status:'active' }]));
    } catch {
      setItems([{ id:1, pet_id:1, from:'2025-09-20', to:'2025-09-21', status:'active' }]);
    }
  };
  useEffect(()=>{ load(); }, []);
  return (
    <Screen title="Hostel – Stays" onBack={()=>router.back()}>
      {items.map(s=>(
        <Card key={s.id} title={`Stay #${s.id} • Pet ${s.pet_id}`}>
          <Text>{s.from} → {s.to} • {s.status}</Text>
          <Btn title="Daily report" onPress={()=>router.push(`/hostel/stay/${s.id}`)} />
        </Card>
      ))}
    </Screen>
  );
}
