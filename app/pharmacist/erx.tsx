import React,{useEffect,useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type ERx={ id:number; pet_id:number; provider_id:number; status:string; items:{name:string;dosage:string}[] };
export default function ERxQueue(){
  const [items,setItems]=useState<ERx[]>([]);
  const load=async()=>{
    try { 
      const j = await api.get<ERx>('/erx?status=pending').then(r => r.data);
      setItems(asArray<ERx>(j, [])); }
    catch { setItems([]); }
  };
  useEffect(()=>{ load(); }, []);
  const accept=async(id:number)=>{ await api.patch(`/erx/${id}`, { status:'accepted' }); load(); };
  const reject=async(id:number)=>{ await api.patch(`/erx/${id}`, { status:'rejected' }); load(); };
  const ready=async(id:number)=>{ await api.patch(`/erx/${id}`, { status:'ready' }); load(); };

  return (
    <Screen title="Pharmacist – eRx Queue" onBack={()=>router.back()}>
      {items.map(x=>(
        <Card key={x.id} title={`eRx #${x.id} • Pet ${x.pet_id}`}>
          <Text>Items: {x.items.map(i=>i.name).join(', ')}</Text>
          <Btn title="Accept" onPress={()=>accept(x.id)} />
          <Btn title="Reject" variant="secondary" onPress={()=>reject(x.id)} />
          <Btn title="Mark Ready" onPress={()=>ready(x.id)} />
        </Card>
      ))}
    </Screen>
  );
}
