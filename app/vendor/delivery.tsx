import React,{useEffect,useState} from 'react';
import { Screen, Card, Field, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type Delivery={ id:number; order_id:number; status:string };

export default function VendorDelivery(){
  const [items,setItems]=useState<Delivery[]>([]);
  const [orderId,setOrderId]=useState('');

  const load=async()=>{
    try { 
        const j = await api.get<Delivery>('/deliveries?partner=vendor').then(r=>r.data); 
        setItems(asArray<Delivery>(j, [])); }
    catch { setItems([]); }
  };
  useEffect(()=>{ load(); }, []);

  const assign=async()=>{
    try { await api.post('/deliveries/assign',{ order_id:Number(orderId||0), slot:'today', partner:'vendor' }); setOrderId(''); }
    finally { load(); }
  };

  return (
    <Screen title="Vendor – Deliveries" onBack={()=>router.back()}>
      <Card title="Assign courier">
        <Field placeholder="Order ID" value={orderId} onChangeText={setOrderId} icon="cube-outline" keyboardType="numeric" />
        <Btn title="Assign" onPress={assign} />
      </Card>
      {items.map(d=>(
        <Card key={d.id} title={`Delivery #${d.id}`}><Text>Order #{d.order_id} • {d.status}</Text></Card>
      ))}
    </Screen>
  );
}
