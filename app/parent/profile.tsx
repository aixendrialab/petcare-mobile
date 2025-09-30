// app/parent/profile.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { api } from '@/src/api'
import { Screen, Card, Field, Btn } from '@/src/ui'
import { useAuth } from '@/src/auth'
import PetRow from '@/src/components/PetRow'
import { useParentStore } from '@/src/state/parent'

type Mode = 'create' | 'edit'

export default function ParentProfile({ mode = 'create' }: { mode?: Mode }) {
  const router = useRouter()
  const { user, fetchMe, setActiveContext } = useAuth()

  // Zustand slices
  const {
    userName, email, phoneReadOnly, pets,
    baseUserName, baseEmail, basePetsJson,
    resetFromServer, setAccount, upsertPet, addPet, removePet,
  } = useParentStore()

  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)

  // preload
  useEffect(() => {
    if (mode === 'create') {
      resetFromServer({
        userName: user?.name ?? '',
        email: user?.email ?? '',
        phoneReadOnly: user?.phone ?? '',
        pets: [{}], // at least one row on onboarding
      })
      return
    }
    (async () => {
      setLoading(true)
      try {
        // 1) pull /me to seed account (single source of truth)
        const me = (await api.get('/me')).data
        // 2) prefer dedicated pets API, fallback to me.user.pets if present
        let currentPets: any[] = []
        try {
          const res = await api.get('/me/pets')
          currentPets = res.data?.pets ?? []
        } catch {
          currentPets = me?.pets ?? []
        }
        resetFromServer({
          userName: me?.user?.name ?? '',
          email: me?.user?.email ?? '',
          phoneReadOnly: me?.user?.phone ?? '',
          pets: (currentPets || []).map((p: any) => ({
            name: p.name,
            breed: p.breed,
            dob: p.dob,
            gender: p.gender,
            vaccine_status: p.vaccine_status,
            rewards: p.rewards,
            picture_uri: p.picture_uri,
          })),
        })
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // dirtiness:
  const isAccountDirty =
    userName.trim() !== baseUserName.trim() ||
    email.trim() !== baseEmail.trim()

  const cleanedPets = pets
    .map(p => ({ ...p, name: (p.name || '').trim() }))
    .filter(p => !!p.name)
    .map(p => ({
      name: p.name,
      breed: p.breed || undefined,
      dob: p.dob || undefined,
      gender: p.gender || undefined,
      vaccine_status: p.vaccine_status || undefined,
      rewards: p.rewards || undefined,
      picture_uri: p.picture_uri || undefined,
    }))
  const petsJson = JSON.stringify(cleanedPets)
  const arePetsDirty = petsJson !== basePetsJson

  async function save() {
    if (saving) return
    // Nothing changed → just leave
    if (!isAccountDirty && !arePetsDirty) {
      return mode === 'create'
        ? router.replace('/parent/home' as any)
        : router.back()
    }

    setSaving(true)
    try {
      // 1) only call /users/register when name/email changed
      if (isAccountDirty) {
        await api.post('/users/register', {
          name: userName.trim(),
          email: email.trim(),
        })
      }

      // 2) only call /me/pets when pets changed (replace semantics)
      if (arePetsDirty) {
        await api.put('/me/pets', { pets: cleanedPets })
      }

      // 3) reflect server truth
      await fetchMe()

      // 4) route by mode
      if (mode === 'create') {
        await setActiveContext('parent')
        router.replace('/parent/home' as any)
      } else {
        router.back()
      }
    } catch (e: any) {
      console.error('[parent/profile] save error:', e)
      alert(e?.response?.data?.detail || e?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Screen title="Edit Profile" subtitle="Parent">
        <View style={{ padding: 24, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 12, color: '#666' }}>Loading profile…</Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen
      title={mode === 'create' ? 'Onboarding' : 'Edit Profile'}
      subtitle="Parent"
      footer={<Btn title={saving ? 'Saving…' : (mode === 'create' ? 'Save & Continue' : 'Save')} onPress={save} disabled={saving} />}
    >
      <Card title="Your details">
        <Field label="Full name" value={userName} onChangeText={(v) => setAccount({ userName: v })} />
        <Field label="Email" value={email} onChangeText={(v) => setAccount({ email: v })} keyboardType="email-address" />
        <View style={{ marginTop: 8 }}>
          <Text style={{ opacity: 0.6 }}>Mobile</Text>
          <Text style={{ fontSize: 16 }}>{phoneReadOnly || '—'}</Text>
        </View>
      </Card>

      <Card title="Pets">
        {pets.map((p, idx) => (
          <PetRow
            key={idx}
            value={p}
            onChange={(patch) => upsertPet(idx, patch)}
            onRemove={pets.length > (mode === 'create' ? 1 : 0) ? () => removePet(idx) : undefined}
          />
        ))}
        <Btn title="Add another pet" variant="secondary" onPress={addPet} />
      </Card>
    </Screen>
  )
}
