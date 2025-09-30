import React,{useEffect,useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type OrderItem={ name:string; qty:number };
type Order={ id:number; status:string; source?:string; items:OrderItem[] };

export default function PharmOrders(){
  const [items,setItems]=useState<Order[]>([]);
  const load=async()=>{
    try { const j = await api.get<Order>('/orders?status=awaiting_fulfillment').then(r=>r.data); 
      setItems(asArray<Order>(j, [])); }
    catch { setItems([]); }
  };
  useEffect(()=>{ load(); }, []);

  const pack=async(id:number)=>{ try { await api.patch(`/orders/${id}`, { status:'packed' }); } finally { load(); } };
  const ship=async(id:number)=>{ try { await api.post('/deliveries/assign', { order_id:id, slot:'today', partner:'local' }); await api.patch(`/orders/${id}`, { status:'shipped' }); } finally { load(); } };

  return (
    <Screen title="Pharmacist – Orders" onBack={()=>router.back()}>
      {items.length===0 && <Text>No orders to fulfill.</Text>}
      {items.map(o=>(
        <Card key={o.id} title={`Order #${o.id}`}>
          <Text style={{ marginBottom:8 }}>{(o.items||[]).map(i=>`${i.name}×${i.qty}`).join(', ')}</Text>
          <Btn title="Pack" onPress={()=>pack(o.id)} />
          <Btn title="Ship" onPress={()=>ship(o.id)} />
        </Card>
      ))}
    </Screen>
  );
}
