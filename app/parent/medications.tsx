import React, {useEffect, useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Medications(){
  const [items, setItems] = useState<any[]>([]);
  const load = ()=> fetch(`${API_BASE}/pets/1/medications`).then(r=>r.json()).then(setItems);
  useEffect(load, []);
  const add = async ()=>{
    await fetch(`${API_BASE}/pets/1/medications`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({pet_id:1, name:'Probiotic', schedule:'09:00'})});
    load();
  };
  return (
    <Screen>
      <Btn title="Add Probiotic" onPress={add} />
      {items.map(m => <Card key={m.id} title={m.name}><Text>{m.schedule}</Text></Card>)}
    </Screen>
  );
}
