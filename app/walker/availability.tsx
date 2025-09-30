import React,{useEffect,useState} from 'react';
import { Screen, Pill, Btn } from '@/src/ui';
import { api } from '@/src/api';
import { router } from 'expo-router';

export default function WalkerAvailability(){
  const [slots,setSlots]=useState<string[]>([]);
  const [open,setOpen]=useState<Record<string,boolean>>({});
  const load = async ()=>{
    try {
      type AvailResp = { slots: string[]; open?: string[] };
      const j = await api.get<AvailResp>('/walkers/1/availability').then(r => r.data);
      const s = (Array.isArray(j?.slots) && j.slots.length) ? j.slots : ["08:00","08:30","09:00","09:30","10:00","10:30"];
      setSlots(s);
      const map: Record<string, boolean> = {};
      (j.open ?? []).forEach((t) => (map[t] = true));
      setOpen(map);
    } catch {
      setSlots(["08:00","08:30","09:00","09:30","10:00","10:30"]); setOpen({ "08:30":true, "10:00":true });
    }
  };
  useEffect(()=>{ load(); }, []);
  const toggle=(s:string)=>setOpen(p=>({ ...p, [s]:!p[s] }));
  const save=async()=>{ await api.put('/walkers/1/availability', { open: Object.keys(open).filter(k=>open[k]) }); alert('Saved'); };
  return (
    <Screen title="Walker – Availability" onBack={()=>router.back()}>
      <div style={{display:'flex',flexWrap:'wrap'} as any}>
        {slots.map(s=><Pill key={s} label={s} state={open[s]?'open':'closed'} onPress={()=>toggle(s)} />)}
      </div>
      <Btn title="Save" onPress={save} />
    </Screen>
  );
}
