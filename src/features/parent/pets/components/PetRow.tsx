import React, { useState } from 'react'
import { View, Image, Platform, Text, Pressable } from 'react-native'
import { Field, Pill } from '@/src/ui'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import { api } from '@/src/api'

export type PetSpecies = 'dog' | 'cat' | ''  // ✅ supported for now

export type PetDraft = {
  name?: string
  breed?: string
  species?: PetSpecies   // ✅ dog/cat only
  dob?: string
  gender?: 'male' | 'female' | 'unknown' | ''

  vaccine_status?: string
  rewards?: string

  microchip?: string
  blood_group?: string

  allergies?: string          // text field
  chronic_conditions?: string // text field

  behavior_notes?: string
  color_markings?: string

  weight_kg?: number

  picture_uri?: string
  _local_uri?: string
}

function yyyyMmDd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function upload(localUri: string): Promise<string> {
  const form = new FormData()

  if (Platform.OS === 'web') {
    const res = await fetch(localUri)
    const blob = await res.blob()
    form.append('file', blob, 'pet.jpg')
  } else {
    const file: any = {
      uri: localUri.startsWith('file://') ? localUri : `file://${localUri}`,
      type: 'image/jpeg',
      name: 'pet.jpg',
    }
    ;(form as any).append('file', file)
  }

  const r = await api.post('/uploads/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return r.data.url as string
}

export default function PetRow({
  value,
  onChange,
  onRemove,
}: {
  value: PetDraft
  onChange: (p: PetDraft) => void
  onRemove?: () => void
}) {
  const [showDate, setShowDate] = useState(false)
  const preview = value._local_uri || value.picture_uri

  async function pickPicture() {
    if (Platform.OS === 'web') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return
        const localUri = URL.createObjectURL(file)
        onChange({ ...value, _local_uri: localUri })
        const url = await upload(localUri)
        onChange({ ...value, picture_uri: url, _local_uri: localUri })
      }
      input.click()
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') return
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      })
      if (!res.canceled && res.assets?.[0]?.uri) {
        const localUri = res.assets[0].uri
        onChange({ ...value, _local_uri: localUri })
        const url = await upload(localUri)
        onChange({ ...value, picture_uri: url, _local_uri: localUri })
      }
    }
  }

  return (
    <View style={{ marginBottom: 16, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 12 }}>
      {/* Picture */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        {preview ? (
          <Image source={{ uri: preview }} style={{ width: 64, height: 64, borderRadius: 32 }} />
        ) : (
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#eee' }} />
        )}
        <Pill label="Picture" onPress={pickPicture} />
        {onRemove && <Pill label="Remove" onPress={onRemove} />}
      </View>

      {/* Basic fields */}
      <Field
        label="Name"
        value={value.name ?? ''}
        onChangeText={(v) => onChange({ ...value, name: v })}
        placeholder="Coco"
      />

      {/* ✅ Species (Dog/Cat) */}
      {Platform.OS === 'web' ? (
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, marginBottom: 6 }}>Species</label>
          <select
            value={value.species ?? ''}
            onChange={(e) => onChange({ ...value, species: (e.target.value as PetSpecies) || '' })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', width: '100%' }}
          >
            <option value="">— select —</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>
      ) : (
        <View style={{ marginBottom: 8 }}>
          <Picker
            selectedValue={value.species ?? ''}
            onValueChange={(v) => onChange({ ...value, species: v as PetSpecies })}
          >
            <Picker.Item label="— select —" value="" />
            <Picker.Item label="Dog" value="dog" />
            <Picker.Item label="Cat" value="cat" />
          </Picker>
        </View>
      )}

      <Field
        label="Breed"
        value={value.breed ?? ''}
        onChangeText={(v) => onChange({ ...value, breed: v })}
      />

      {/* DOB */}
      {Platform.OS === 'web' ? (
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, marginBottom: 6, display: 'block' }}>DOB</label>
          <input
            type="date"
            value={value.dob ?? ''}
            onChange={(e) => onChange({ ...value, dob: e.target.value || undefined })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', width: '100%' }}
          />
        </div>
      ) : (
        <View style={{ marginBottom: 8 }}>
          <Pressable
            onPress={() => setShowDate(true)}
            style={{ padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }}
          >
            <Text style={{ color: value.dob ? '#000' : '#999' }}>{value.dob || 'YYYY-MM-DD'}</Text>
          </Pressable>
          {showDate && (
            <DateTimePicker
              mode="date"
              value={value.dob ? new Date(value.dob) : new Date()}
              onChange={(_, d) => {
                setShowDate(false)
                if (d) onChange({ ...value, dob: yyyyMmDd(d) })
              }}
            />
          )}
        </View>
      )}

      {/* Gender */}
      {Platform.OS === 'web' ? (
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, marginBottom: 6 }}>Gender</label>
          <select
            value={value.gender ?? ''}
            onChange={(e) => onChange({ ...value, gender: e.target.value as any })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', width: '100%' }}
          >
            <option value="">— select —</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      ) : (
        <View style={{ marginBottom: 8 }}>
          <Picker selectedValue={value.gender ?? ''} onValueChange={(v) => onChange({ ...value, gender: v as any })}>
            <Picker.Item label="— select —" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Unknown" value="unknown" />
          </Picker>
        </View>
      )}

      {/* Medical & Profile fields */}
      <Field label="Microchip" value={value.microchip ?? ''} onChangeText={(v) => onChange({ ...value, microchip: v })} />
      <Field
        label="Blood Group"
        value={value.blood_group ?? ''}
        onChangeText={(v) => onChange({ ...value, blood_group: v })}
      />

      <Field
        label="Allergies (comma separated)"
        value={value.allergies ?? ''}
        onChangeText={(v) => onChange({ ...value, allergies: v })}
      />

      <Field
        label="Chronic Conditions (comma separated)"
        value={value.chronic_conditions ?? ''}
        onChangeText={(v) => onChange({ ...value, chronic_conditions: v })}
      />

      <Field
        label="Behaviour Notes"
        value={value.behavior_notes ?? ''}
        onChangeText={(v) => onChange({ ...value, behavior_notes: v })}
      />

      <Field
        label="Color / Markings"
        value={value.color_markings ?? ''}
        onChangeText={(v) => onChange({ ...value, color_markings: v })}
      />

      <Field
        label="Weight (kg)"
        value={String(value.weight_kg ?? '')}
        onChangeText={(v) => onChange({ ...value, weight_kg: parseFloat(v) || undefined })}
      />

      <Field
        label="Vaccine Status"
        value={value.vaccine_status ?? ''}
        onChangeText={(v) => onChange({ ...value, vaccine_status: v })}
      />
      <Field
        label="Rewards / Achievements"
        value={value.rewards ?? ''}
        onChangeText={(v) => onChange({ ...value, rewards: v })}
      />
    </View>
  )
}
