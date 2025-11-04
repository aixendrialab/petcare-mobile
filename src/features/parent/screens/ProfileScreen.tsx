// src/features/parent/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { Screen, Field, Btn, Card } from '@/src/ui'
import { fetchParentProfile, saveParentProfile } from '../api'
import { ParentProfile } from '../types'
import PetRow from '@/src/components/PetRow'

export default function ParentProfileScreen() {
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchParentProfile()
        setProfile(data)
      } catch (err) {
        console.error('[ParentProfileScreen] failed', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function update<K extends keyof ParentProfile>(key: K, value: ParentProfile[K]) {
    setProfile(prev => prev ? { ...prev, [key]: value } : prev)
  }

  function updatePet(idx: number, patch: Partial<ParentProfile['pets'][number]>) {
    if (!profile) return
    const next = [...profile.pets]
    next[idx] = { ...next[idx], ...patch }
    setProfile({ ...profile, pets: next })
  }

  function addPet() {
    if (!profile) return
    setProfile({
      ...profile,
      pets: [
        ...profile.pets,
        { name: '', breed: '', dob: '', gender: '', vaccine_status: '', rewards: '' }
      ]
    })
  }

  function removePet(idx: number) {
    if (!profile) return
    setProfile({ ...profile, pets: profile.pets.filter((_, i) => i !== idx) })
  }

  async function save() {
    if (!profile) return
    setSaving(true)
    try {
      await saveParentProfile(profile)
      alert('Profile saved successfully!')
    } catch (e) {
      console.error('[ParentProfileScreen] save error', e)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Screen title="Edit Profile">
        <View style={{ padding: 24, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 12, color: '#666' }}>Loading profile…</Text>
        </View>
      </Screen>
    )
  }

  if (!profile) return null

  return (
    <Screen
      title="Edit Profile"
      footer={<Btn title={saving ? 'Saving…' : 'Save'} onPress={save} disabled={saving} />}
    >
      <ScrollView style={{ paddingHorizontal: 8 }}>
        <Card title="Account">
          <Field label="Full name" value={profile.name ?? ''} onChangeText={v => update('name', v)} />
          <Field label="Email" value={profile.email ?? ''} onChangeText={v => update('email', v)} keyboardType="email-address" />
          <View style={{ marginTop: 8 }}>
            <Text style={{ opacity: 0.6 }}>Mobile</Text>
            <Text style={{ fontSize: 16 }}>{profile.phone || '—'}</Text>
          </View>
        </Card>

        <Card title="Pets">
          {profile.pets.map((p, idx) => (
            <PetRow
              key={idx}
              value={p}
              onChange={patch => updatePet(idx, patch)}
              onRemove={() => removePet(idx)}
            />
          ))}
          <Btn title="+ Add another pet" variant="secondary" onPress={addPet} />
        </Card>
      </ScrollView>
    </Screen>
  )
}
