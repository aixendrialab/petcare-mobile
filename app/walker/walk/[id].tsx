import React,{useEffect,useState} from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen, Card, Btn, Field } from '@/src/ui';
import { api } from '@/src/api';
import { Text } from 'react-native';

export default function WalkDetail(){
  const { id } = useLocalSearchParams<{id:string}>();
  const [w,setW]=useState<any>(null); const [note,setNote]=useState('');
  const load=async()=>setW(await api.get(`/walks/${id}`));
  useEffect(()=>{ load(); }, [id]);

  const start=async()=>{ await api.patch(`/walks/${id}/start`,{}); load(); };
  const stop=async()=>{ await api.patch(`/walks/${id}/stop`,{}); load(); };
  const upload=async()=>{ await api.post(`/walks/${id}/media`, { note, photo:'data:image/png;base64,...' }); setNote(''); alert('Uploaded'); };

  return (
    <Screen title={`Walk #${id}`} onBack={()=>router.back()}>
      {w && <Card title={`Pet #${w.pet_id}`}><Text>Status: {w.status}</Text></Card>}
      <Btn title="Start" onPress={start} />
      <Btn title="Stop" onPress={stop} />
      <Field placeholder="Notes" value={note} onChangeText={setNote} icon="document-text-outline" />
      <Btn title="Upload note/photo" onPress={upload} />
    </Screen>
  );
}
