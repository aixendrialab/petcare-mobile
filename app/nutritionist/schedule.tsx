import React,{useEffect,useState} from 'react';
import { Screen, Pill, Btn } from '@/src/ui';
import { api } from '@/src/api';
import { router } from 'expo-router';

export default function NutriSchedule(){
  const [slots,setSlots]=useState<string[]>([]);
  const [state,setState]=useState<Record<string,'booked'|'open'|'closed'>>({});
  useEffect(()=>{ (async()=>{
    try {
      const j=await api.get<{slots:string[]; booked:string[]}>('/providers/5/slots?date=today').then(r => r.data);;
      const s = (Array.isArray(j?.slots)&&j.slots.length?j.slots:["08:00","08:30","09:00","09:30"]);
      setSlots(s); 
      const map:any={}; (Array.isArray(j?.booked)?j.booked:[]).forEach((s:string)=>map[s]='booked'); setState(map);
    } catch {
      setSlots(["08:00","08:30","09:00","09:30"]); setState({ "09:00":"booked" } as any);
    }
  })(); }, []);
  const toggle=(s:string)=>setState(p=>({ ...p, [s]: p[s]==='open'?'closed':'open' }));
  const save=async()=>{ await api.put('/providers/5/schedule', { open: Object.keys(state).filter(k=>state[k]==='open') }); alert('Saved'); };
  return (
    <Screen title="Nutritionist – Schedule" onBack={()=>router.back()}>
      <div style={{display:'flex',flexWrap:'wrap'} as any}>
        {slots.map(s=><Pill key={s} label={s} state={state[s]??'closed'} onPress={()=>toggle(s)} />)}
      </div>
      <Btn title="Save" onPress={save} />
    </Screen>
  );
}
