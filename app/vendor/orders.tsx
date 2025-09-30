import React,{useEffect,useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type OrderItem = { name:string; qty:number };
type Order = { id:number; status:string; items:OrderItem[] };

export default function VendorOrders(){
  const [items,setItems]=useState<Order[]>([]);
  const load=async()=>{
    try {
      const j = await api.get<Order>('/vendor/orders?status=pending').then(r=>r.data);
      setItems(asArray<Order>(j, []));
    } catch { setItems([]); }
  };
  useEffect(()=>{ load(); }, []);

  const accept=async(id:number)=>{ try { await api.patch(`/vendor/orders/${id}`, { status:'accepted' }); } finally { load(); } };
  const reject=async(id:number)=>{ try { await api.patch(`/vendor/orders/${id}`, { status:'rejected' }); } finally { load(); } };

  return (
    <Screen title="Vendor – Orders" onBack={()=>router.back()}>
      {items.length === 0 && <Text>No pending orders.</Text>}
      {items.map(o=>(
        <Card key={o.id} title={`Order #${o.id}`}>
          <Text style={{ marginBottom:8 }}>{(o.items||[]).map(i=>`${i.name}×${i.qty}`).join(', ')}</Text>
          <Btn title="Accept" onPress={()=>accept(o.id)} />
          <Btn title="Reject" variant="secondary" onPress={()=>reject(o.id)} />
        </Card>
      ))}
    </Screen>
  );
}
