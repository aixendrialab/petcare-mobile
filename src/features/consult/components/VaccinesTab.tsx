import React from 'react';
import { Card, Text, Chip } from '@/src/ui';
import { VaccineStatus } from '../types';

interface Props {
  vaccines: VaccineStatus[];
}

export function VaccinesTab({ vaccines }: Props) {
  return (
    <Card title="Vaccination Status">
      {vaccines.map((v) => (
        <Card key={v.name} style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: '600' }}>{v.name}</Text>

          <Chip mode="outlined" style={{ marginTop: 6 }}>
            {v.status}
          </Chip>

          <Text style={{ marginTop: 6 }}>
            Last: {v.lastGiven || '—'} • Next: {v.nextDue || '—'}
          </Text>
        </Card>
      ))}
    </Card>
  );
}
