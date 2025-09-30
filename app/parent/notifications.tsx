import React, {useEffect, useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Notifications(){
  const [p, setP] = useState<any>({sms:true,email:true,whatsapp:true});
  const load = async()=> setP(await (await fetch(`${API_BASE}/me/notification-preferences`)).json());
  useEffect(()=>{ load(); }, []);
  const save = async()=>{
    await fetch(`${API_BASE}/me/notification-preferences?sms=${p.sms}&email=${p.email}&whatsapp=${p.whatsapp}`, {method:'PUT'});
    load();
  };
  return (
    <Screen>
      <Card title="Preferences">
        <Text>SMS: {String(p.sms)}</Text>
        <Text>Email: {String(p.email)}</Text>
        <Text>WhatsApp: {String(p.whatsapp)}</Text>
        <Btn title="Toggle SMS" onPress={()=>setP({...p, sms:!p.sms})} />
        <Btn title="Save" onPress={save} />
      </Card>
    </Screen>
  );
}
