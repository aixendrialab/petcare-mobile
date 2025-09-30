import React, {useEffect, useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Vaccines(){
  const [items, setItems] = useState<any[]>([]);
  const load = ()=> fetch(`${API_BASE}/pets/1/vaccines`).then(r=>r.json()).then(setItems);
  useEffect(load, []);
  const add = async ()=>{
    await fetch(`${API_BASE}/pets/1/vaccines`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({pet_id:1, name:'DHPP', status:'scheduled', due_on:'2026-01-10'})});
    load();
  };
  return (
    <Screen>
      <Btn title="Schedule DHPP" onPress={add} />
      {items.map(v => <Card key={v.id} title={v.name}><Text>{v.status} {v.due_on? '• '+v.due_on: ''}</Text></Card>)}
    </Screen>
  );
}
