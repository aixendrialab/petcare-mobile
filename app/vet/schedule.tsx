import React, { useEffect, useState } from 'react';
import { Screen, Pill } from '@/src/ui';
import { api, asArray } from '@/src/api';

type SlotState = 'booked'|'open'|'closed';
const FALLBACK = ["08:00","08:30","09:00","09:30","10:00","10:30"];

export default function VetSchedule(){
  const [slots, setSlots] = useState<string[]>([]);
  const [state, setState] = useState<Record<string, SlotState>>({});

  useEffect(() => {
    (async () => {
      try {
        type SlotsResp = { slots: string[] };
        const j = await api.get<SlotsResp>('/providers/5/slots?date=today').then(r => r.data);
        const s = asArray<string>(j?.slots, FALLBACK);
        setSlots(s.length ? s : FALLBACK);
      } catch {
        setSlots(FALLBACK);
      }
      setState({ '08:00':'booked', '08:30':'booked', '09:00':'open', '09:30':'booked', '10:00':'open', '10:30':'open' } as any);
    })();
  }, []);

  const toggle = (s: string) => {
    setState(prev => {
      const curr = prev[s] || 'closed';
      const next: SlotState = curr === 'closed' ? 'open' : curr === 'open' ? 'booked' : 'closed';
      return { ...prev, [s]: next };
    });
  };

  return (
    <Screen title="PetCare – Veterinarian" subtitle="Today's Schedule">
      <div style={{ display:'flex', flexWrap:'wrap' } as any}>
        {slots.map(s => <Pill key={s} label={s} state={state[s] ?? 'closed'} onPress={()=>toggle(s)} />)}
      </div>
      <div style={{ marginTop:14, opacity:0.75 } as any}>Legend: <b style={{ color:'#22c55e' }}>Green=Booked</b>, <b style={{ color:'#4f46e5' }}>Indigo=Open</b>, White=Closed</div>
    </Screen>
  );
}
