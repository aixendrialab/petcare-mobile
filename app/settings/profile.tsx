// app/settings/profile.tsx
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useAuth } from '@/src/auth'
import { api } from '@/src/api'
import { Field, Card, Btn } from '@/src/ui'
import PetRow, { PetDraft } from '@/src/components/PetRow'

export default function ProfileSettings() {
  const { user, fetchMe } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')

  // start with empty array for “add a new pet”
  const [newPets, setNewPets] = useState<PetDraft[]>([{ }])
  const addRow = () => setNewPets(p => [...p, {}])
  const updateRow = (i: number, patch: PetDraft) => setNewPets(p => p.map((x, idx) => idx === i ? patch : x))
  const removeRow = (i: number) => setNewPets(p => p.filter((_, idx) => idx !== i))

  async function save() {
    // 1) update basic profile
    await api.post('/users/register', { name: name?.trim(), email: email?.trim() })

    // 2) fetch current pets so we can append (since PUT /me/pets replaces)
    const me = (await api.get('/auth/me')).data
    const currentPets = Array.isArray(me?.pets) ? me.pets : []  // if you include pets in /auth/me

    // if pets are not in /auth/me, add a GET /me/pets endpoint and call it here.

    const cleanedNew = newPets
      .map(p => ({ ...p, name: (p.name || '').trim() }))
      .filter(p => p.name && (p.picture_uri || true)) // picture optional

    const merged = [...currentPets, ...cleanedNew].map(p => ({
      name: p.name, breed: p.breed, dob: p.dob, gender: p.gender,
      vaccine_status: p.vaccine_status, rewards: p.rewards, picture_uri: p.picture_uri
    }))

    await api.put('/me/pets', { pets: merged })

    await fetchMe()
    alert('Profile updated')
  }

  return (
    <ScrollView>
      <Card title="Your profile">
        <Field label="Full name" value={name} onChangeText={setName} />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      </Card>

      <Card title="Add pets">
        {newPets.map((p, idx) => (
          <PetRow
            key={idx}
            value={p}
            onChange={(patch)=>updateRow(idx, patch)}
            onRemove={newPets.length > 1 ? ()=>removeRow(idx) : undefined}
          />
        ))}
        <Btn title="Add another pet" variant="secondary" onPress={addRow} />
      </Card>

      <Btn title="Save changes" onPress={save} style={{ margin: 16 }} />
    </ScrollView>
  )
}
