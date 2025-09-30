import React, { useState } from 'react'
import { View } from 'react-native'
import { Page, Card, Field, Pill, Btn } from '@/src/ui'
import { useRouter } from 'expo-router'
import { api } from '@/src/api'

export default function OrgLink() {
  const [invite, setInvite] = useState('')
  const [type, setType] = useState<'clinic' | 'shop' | 'hostel' | 'ngo' | ''>('')
  const [name, setName] = useState('')
  const router = useRouter()

  async function onJoin() {
    try {
      await api.post('/orgs/join', { invite_code: invite })
      router.replace('/who-am-i' as any)
    } catch (e: any) {
      alert(e?.response?.data?.detail || 'Failed to join organization')
    }
  }

  async function onCreate() {
    try {
      await api.post('/orgs/create', { type, name })
      router.replace('/who-am-i' as any)
    } catch (e: any) {
      alert(e?.response?.data?.detail || 'Failed to create organization')
    }
  }

  return (
    <Page title="Link your organization">
      <Card>
        <Pill>Join Existing</Pill>
        <Field label="Invite code" value={invite} onChangeText={setInvite}/>
        <Field.Button title="Join" onPress={onJoin} disabled={!invite}/>
      </Card>
      <Card>
        <Pill>Create New</Pill>
        <Field label="Type" value={type} onChangeText={(t)=>setType(t as any)}/>
        <Field label="Organization name" value={name} onChangeText={setName}/>
        <Field.Button title="Create" onPress={onCreate} disabled={!name}/>
      </Card>
    </Page>
  )
}
