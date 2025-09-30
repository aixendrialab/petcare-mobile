import React, {useEffect, useState} from 'react';
import { Screen, Card } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Prescriptions(){
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ fetch(`${API_BASE}/prescriptions?pet_id=1`).then(r=>r.json()).then(setItems); }, []);
  return (
    <Screen>
      {items.map(rx => <Card key={rx.id} title={`Rx #${rx.id}`}><Text>{rx.items}</Text></Card>)}
    </Screen>
  );
}
