// src/components/RoleContextPicker.tsx
import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { Card } from '@/src/ui'
import  {RoleBinding} from '@/src/auth'

export function RoleContextPicker({ items, onPick }:{ items: RoleBinding[]; onPick:(rb:RoleBinding)=>void }){
  return (
    <View style={{ gap: 12 }}>
      {items.map((rb, i) => {
        const title = rb.role.toUpperCase()
        const subtitle = rb.org ? `${rb.role} @ ${rb.org.name}` : desc(rb.role)
        return (
          <Pressable key={i} onPress={() => onPick(rb)}>
            <Card>
              <Text style={{ fontWeight: '700' }}>{title}</Text>
              {!!subtitle && <Text>{subtitle}</Text>}
            </Card>
          </Pressable>
        )
      })}
    </View>
  )
}

function desc(role: string){
  switch(role){
    case 'parent': return 'Personal context'
    case 'vet': return 'Clinic context'
    case 'hostel': return 'Boarding context'
    case 'vendor': return 'Store context'
    case 'walker': return 'Walks context'
    case 'pharmacist': return 'Pharmacy context'
    case 'nutritionist': return 'Nutrition context'
    default: return ''
  }
}
