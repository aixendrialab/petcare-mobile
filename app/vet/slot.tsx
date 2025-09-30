import React, {useEffect, useState} from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Slot(){
  const { s } = useLocalSearchParams<{s:string}>();
  const [appts, setAppts] = useState<any[]>([]);
  useEffect(()=>{ fetch(`${API_BASE}/appointments?provider_id=1`).then(r=>r.json()).then(setAppts); }, []);
  return (
    <Screen>
      <Card title={`Who is visiting @ ${s}`}>
        {appts.map(a => <Text key={a.id}>Appt #{a.id} • Pet {a.pet_id} • {a.status}</Text>)}
      </Card>
      <Btn title="Propose Reschedule" onPress={()=>alert('Reschedule sent')} />
      <Btn title="Start Tele-visit" onPress={()=>alert('Televisit link shared')} />
    </Screen>
  );
}
