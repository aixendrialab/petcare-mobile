import React from 'react';
import { View } from 'react-native';
import { Card, Text, Chip, Avatar } from '@/src/ui';
import { PetSummary } from "../types";

interface Props {
  pet: PetSummary;
}

export function PetSummaryCard({ pet }: Props) {

  const allergies = pet.allergies ?? [];
  const chronic = pet.chronicConditions ?? [];

  return (
    <Card title="Pet">
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Avatar.Image size={60} source={{ uri: pet.avatarUrl }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{pet.name}</Text>
          <Text>{pet.breed} • {pet.sex} • {pet.ageYears} yrs</Text>
          <Text>Owner: {pet.ownerName}</Text>

          {pet.microchip && <Text>Microchip: {pet.microchip}</Text>}
          {pet.blood_group && <Text>Blood Group: {pet.blood_group}</Text>}
          {pet.color_markings && <Text>Markings: {pet.color_markings}</Text>}
          {pet.weight_kg && <Text>Weight: {pet.weight_kg} kg</Text>}
        </View>
      </View>

      {!!pet.behaviourNotes && (
        <View style={{ marginTop: 8 }}>
          <Chip mode="outlined" icon="alert">{pet.behaviourNotes}</Chip>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
        {allergies.map(a => (
          <Chip key={a} mode="flat" icon="alert" style={{ backgroundColor: '#fee' }}>
            {a}
          </Chip>
        ))}
        {chronic.map(c => (
          <Chip key={c} mode="outlined">{c}</Chip>
        ))}
      </View>
    </Card>
  );
}
