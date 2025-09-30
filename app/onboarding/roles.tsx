import React, { useState } from 'react'
import { Screen, Card, Btn } from '@/src/ui'
import RolePicker, { Role } from '@/src/components/RolePicker'
import { api } from '@/src/api'
import { router } from 'expo-router'

export default function Roles() {
  const [value, setValue] = useState<Role[]>([])

  async function save() {
    if (!value.length) return
    await api.post('/me/roles', { roles: value })
    router.replace('/who-am-i' as any)
  }

  return (
    <Screen title="Roles" subtitle="Choose how you’ll use PetCare">
      <Card>
        <RolePicker value={value} onChange={setValue} />
        <Btn title="Save & Continue" onPress={save} disabled={!value.length} />
      </Card>
    </Screen>
  )
}
