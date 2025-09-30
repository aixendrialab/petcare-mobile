import React, {useEffect, useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Reports(){
  const [items, setItems] = useState<any[]>([]);
  const load=()=> fetch(`${API_BASE}/pets/1/reports`).then(r=>r.json()).then(setItems);
  useEffect(load, []);
  const add = async ()=>{
    await fetch(`${API_BASE}/pets/1/reports`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({pet_id:1, title:'X-Ray', file_url:'s3://demo/xray.pdf'})});
    load();
  };
  return (
    <Screen>
      <Btn title="Add Report" onPress={add} />
      {items.map(r => <Card key={r.id} title={r.title}><Text>{r.file_url}</Text></Card>)}
    </Screen>
  );
}
