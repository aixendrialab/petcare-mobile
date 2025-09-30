import React, {useEffect, useState} from 'react';
import { Screen, Card } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Events(){
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ fetch(`${API_BASE}/events`).then(r=>r.json()).then(setItems); }, []);
  return (
    <Screen>
      {items.map(e => <Card key={e.id} title={e.title}><Text>{e.city} • {e.starts_at}</Text></Card>)}
    </Screen>
  );
}
