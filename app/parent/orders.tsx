import React, {useEffect, useState} from 'react';
import { Screen, Card, Chip } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Orders(){
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ fetch(`${API_BASE}/orders?user_id=1`).then(r=>r.json()).then(setItems); }, []);
  return (
    <Screen>
      {items.map(o => <Card key={o.id} title={`Order #${o.id}`}><Text>Status: {o.status} • Amount ₹{o.amount}</Text></Card>)}
    </Screen>
  );
}
