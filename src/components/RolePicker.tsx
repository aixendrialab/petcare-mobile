import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { Card } from '@/src/ui'

export type Role = 'parent' | 'vet' | 'hostel' | 'vendor' | 'pharmacist' | 'nutritionist' | 'walker';

type Props = {
  value: Role[];                     // <-- stays strongly typed
  onChange: (next: Role[]) => void;
};

const ALL: Role[] = ['parent','vet','walker','hostel','vendor','pharmacist','nutritionist']

export default function RolePicker({ value, onChange }: Props) {
  const toggle = (r: Role) => {
    const has = value.includes(r)
    const next = has ? value.filter(x => x !== r) : [...value, r]
    onChange(next)
  }

  const caption = (r: Role) => {
    switch (r) {
      case 'parent': return 'Manage your pets'
      case 'vet': return 'Clinics & consults'
      case 'walker': return 'Walks & availability'
      case 'hostel': return 'Boarding & stays'
      case 'vendor': return 'Products & orders'
      case 'pharmacist': return 'eRx & inventory'
      case 'nutritionist': return 'Diet & plans'
    }
  }

  return (
    <View style={{ gap: 12 }}>
      {ALL.map(r => {
        const selected = value.includes(r)
        return (
          <Pressable key={r} onPress={() => toggle(r)}>
            <Card
              title={r.toUpperCase()}
              subtitle={caption(r)}
              style={{
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? '#4A90E2' : '#ddd',
              }}
            >
              <Text style={{ color: selected ? '#4A90E2' : '#666', fontWeight: '600' }}>
                {selected ? 'Selected' : 'Tap to select'}
              </Text>
            </Card>
          </Pressable>
        )
      })}
    </View>
  )
}
