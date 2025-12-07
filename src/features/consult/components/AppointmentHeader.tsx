import React from 'react';
import { View } from 'react-native';
import { Card, Text, Chip } from '@/src/ui';
import { AppointmentSummary } from '../types';

interface Props {
  appointment: AppointmentSummary;
}

export function AppointmentHeader({ appointment }: Props) {
  return (
    <Card title="Appointment">
      <Text style={{ marginBottom: 4 }}>{appointment.bookingCode}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Chip mode="outlined">{appointment.mode}</Chip>
        <Chip mode="flat">{appointment.locationName}</Chip>
      </View>

      <Text style={{ marginTop: 4, opacity: 0.7 }}>
        {appointment.startTs} – {appointment.endTs}
      </Text>
    </Card>
  );
}
