import React,{useState} from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen, Field, Btn } from '@/src/ui';
import { api } from '@/src/api';
export default function StayReport(){
  const { id } = useLocalSearchParams<{id:string}>();
  const [msg,setMsg]=useState('');
  const send=async()=>{ await api.post(`/stays/${id}/report`, { message:msg, media:'data:image/png;base64,...' }); setMsg(''); alert('Sent'); };
  return (
    <Screen title={`Stay #${id} – Daily Report`} onBack={()=>router.back()}>
      <Field placeholder="Notes for owner" value={msg} onChangeText={setMsg} icon="chatbox-ellipses-outline" />
      <Btn title="Upload & Send" onPress={send} />
    </Screen>
  );
}
