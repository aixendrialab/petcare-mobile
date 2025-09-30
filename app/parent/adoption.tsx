import React, {useEffect, useState} from 'react';
import { Screen, Card } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Adoption(){
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ fetch(`${API_BASE}/adoptions`).then(r=>r.json()).then(setItems); }, []);
  return (
    <Screen>
      {items.map(a => <Card key={a.id} title={`${a.name} • ${a.breed}`}><Text>{a.org} • {a.age}</Text></Card>)}
    </Screen>
  );
}
