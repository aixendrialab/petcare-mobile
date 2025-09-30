import React from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Checkin(){
  const add = async()=>{
    const res = await fetch(`${API_BASE}/checkins`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({appointment_id:1, triage:'routine', status:'Arrived'})});
    const j = await res.json(); alert(`Created checkin #${j.id}`);
  };
  return (
    <Screen>
      <Card title="Walk-in / Appointment Check-in">
        <Text>Creates a triage entry</Text>
        <Btn title="Create Check-in" onPress={add} />
      </Card>
    </Screen>
  );
}
