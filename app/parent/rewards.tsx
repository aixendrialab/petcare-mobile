import React, {useEffect, useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Rewards(){
  const [summary, setSummary] = useState<any>({points:0});
  const [history, setHistory] = useState<any[]>([]);
  const load = async()=>{
    setSummary(await (await fetch(`${API_BASE}/rewards`)).json());
    setHistory(await (await fetch(`${API_BASE}/rewards/history`)).json());
  };
  useEffect(()=>{ load(); }, []);
  const redeem = async()=>{ await fetch(`${API_BASE}/rewards/redeem`, {method:'POST'}); load(); };
  return (
    <Screen>
      <Card title="Points"><Text>{summary.points}</Text></Card>
      {history.map(h => <Card key={h.id} title={h.reason}><Text>{h.delta}</Text></Card>)}
      <Btn title="Redeem 100" onPress={redeem} />
    </Screen>
  );
}
