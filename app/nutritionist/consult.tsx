import React,{useState} from 'react';
import { Screen, Field, Btn, Card } from '@/src/ui';
import { api } from '@/src/api';
import { router } from 'expo-router';

export default function NutriConsult(){
  const [pet,setPet]=useState(''); const [goals,setGoals]=useState('weight, coat');
  const create=async()=>{
    await api.post('/consults', { appointment_id: null, diagnosis:'Nutrition consult', notes:goals, pet_id:Number(pet) });
    await api.post('/careplans', { pet_id:Number(pet), provider_id:5, tasks:[{ title:'Diet plan', schedule:'daily' }] });
    alert('Plan created'); router.back();
  };
  return (
    <Screen title="Nutritionist – Consult" onBack={()=>router.back()}>
      <Card title="Pet & Goals">
        <Field placeholder="Pet ID" value={pet} onChangeText={setPet} icon="paw-outline" keyboardType="numeric" />
        <Field placeholder="Goals (comma separated)" value={goals} onChangeText={setGoals} icon="leaf-outline" />
      </Card>
      <Btn title="Create Care Plan" onPress={create} />
    </Screen>
  );
}
