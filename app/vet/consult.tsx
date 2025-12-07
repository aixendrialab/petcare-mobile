// app/vet/consult.tsx
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ConsultScreen } from '@/src/features/consult/screens/ConsultScreen';

export default function VetConsultRoute() {
  const { appointment_id, pet_id } = useLocalSearchParams<{
    appointment_id?: string;
    pet_id?: string;
  }>();

  return (
    <ConsultScreen
      appointmentId={Number(appointment_id)}
      petId={Number(pet_id)}
    />
  );
}
