import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { Screen, Field, Btn } from '@/src/ui'
import { fetchVetProfile, saveVetProfile } from '../api'
import { VetProfile, VetLocation } from '../types'
import { useNavigation } from '@react-navigation/native'
import ValidatedField from '@/src/components/ValidatedField'
import { FormValidationProvider, useValidation } from '@/src/components/FormValidationContext'
import { isEmail } from '@/src/ui/validators'

function Section({ title, expanded, onToggle, children }: any) {
  return (
    <View style={{ marginVertical: 8 }}>
      <TouchableOpacity onPress={onToggle} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>{title}</Text>
        <Text style={{ color: '#888' }}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && <View style={{ marginTop: 8 }}>{children}</View>}
    </View>
  )
}

export default function VetProfileScreen() {
  return (
    <FormValidationProvider>
      <VetProfileScreenInner />
    </FormValidationProvider>
  );
}

function VetProfileScreenInner() {
  const [profile, setProfile] = useState<VetProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigation = useNavigation()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    account: true,
    business: false,
    professional: false,
    consult: false,
    locations: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { validateForm } = useValidation();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchVetProfile()
        setProfile({
          ...data,
          locations: data.locations ?? []
        })
      } catch (e) {
        console.error('[VetProfileScreen] fetch failed', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function update<K extends keyof VetProfile>(key: K, value: VetProfile[K]) {
    setProfile(prev => prev ? { ...prev, [key]: value } : prev)
  }

  function updateLoc(idx: number, patch: Partial<VetLocation>) {
    if (!profile) return
    const next = [...profile.locations]
    next[idx] = { ...next[idx], ...patch }
    setProfile({ ...profile, locations: next })
  }

  function addLocation() {
    if (!profile) return
    setProfile({
      ...profile,
      locations: [
        ...profile.locations,
        { name: '', line1: '', city: '', lat: null, lng: null, hours: '', is_primary: profile.locations.length === 0 }
      ]
    })
  }

  function removeLocation(idx: number) {
    if (!profile) return
    const next = profile.locations.filter((_, i) => i !== idx)
    if (next.length && !next.some(l => l.is_primary)) next[0].is_primary = true
    setProfile({ ...profile, locations: next })
  }

  async function save() {
    if (!profile) return
    // run validation
    if (!validateForm()) {
      alert("Please fix required fields");
      return;
    }
    setSaving(true)
    try {
      // convert specialties to array if typed as string
      const payload = {
        ...profile,
        specialties: typeof profile.specialties === 'string'
          ? profile.specialties.split(',').map(s => s.trim()).filter(Boolean)
          : profile.specialties
      }
      await saveVetProfile(payload)
      alert('Saved successfully!')
      navigation.goBack()
    } catch (e) {
      console.error('Save error', e)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <Screen title="Edit Profile">
        <View style={{ padding: 24, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 12, color: '#666' }}>Loading profile…</Text>
        </View>
      </Screen>
    )

  if (!profile) return null

  return (
      <Screen
        title="Edit Profile"
        footer={<Btn title={saving ? 'Saving…' : 'Save'} onPress={save} disabled={saving} />}
      >
        <ScrollView style={{ paddingHorizontal: 8 }}>
          {/* ------------------ Account ------------------ */}
          <Section
            title="Account"
            expanded={expanded.account}
            onToggle={() => setExpanded(e => ({ ...e, account: !e.account }))}
          >
            <ValidatedField
              label="Full name"
              required
              value={profile.name ?? ''}
              onChangeText={(v) => update("name", v)}
              error={errors.name}
            />

            <ValidatedField
              name="email"
              label="Email"
              required
              validate={isEmail("Please enter a valid email")}
              value={profile.email ?? ""}
              onChangeText={(v) => update("email", v)}
            />

          </Section>

          {/* ------------------ Business ------------------ */}
          <Section
            title="Business Identity & Billing"
            expanded={expanded.business}
            onToggle={() => setExpanded(e => ({ ...e, business: !e.business }))}
          >
            <Field label="Legal name" value={profile.legal_name ?? ''} onChangeText={v => update('legal_name', v)} />
            <Field label="Display name" value={profile.display_name ?? ''} onChangeText={v => update('display_name', v)} />
            <Field label="Business email" value={profile.business_email ?? ''} onChangeText={v => update('business_email', v)} keyboardType="email-address" />
            <Field label="Billing email" value={profile.billing_email ?? ''} onChangeText={v => update('billing_email', v)} keyboardType="email-address" />
            <Field label="Billing address" value={profile.billing_address ?? ''} onChangeText={v => update('billing_address', v)} />
            <Field label="GSTIN" value={profile.gstin ?? ''} onChangeText={v => update('gstin', v)} />
            <Field label="PAN" value={profile.pan ?? ''} onChangeText={v => update('pan', v)} />
          </Section>

          {/* ------------------ Professional ------------------ */}
          <Section
            title="Professional Info"
            expanded={expanded.professional}
            onToggle={() => setExpanded(e => ({ ...e, professional: !e.professional }))}
          >
            <Field label="Qualifications" value={profile.qualifications ?? ''} onChangeText={v => update('qualifications', v)} />
            <Field label="License number" value={profile.license_no ?? ''} onChangeText={v => update('license_no', v)} />
            <Field label="Experience (years)" value={String(profile.experience_years ?? 0)} onChangeText={v => update('experience_years', Number(v))} keyboardType="numeric" />
            <Field
              label="Specialties (comma-separated)"
              value={Array.isArray(profile.specialties) ? profile.specialties.join(', ') : (profile.specialties ?? '')}
              onChangeText={v => update('specialties', v)}
              placeholder="dermatology, surgery, cardiology"
            />
          </Section>

          {/* ------------------ Consultation ------------------ */}
          <Section
            title="Consultation Settings"
            expanded={expanded.consult}
            onToggle={() => setExpanded(e => ({ ...e, consult: !e.consult }))}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 6 }}>
              <Text>In-clinic visits</Text>
              <Switch value={profile.visit_in_clinic} onValueChange={v => update('visit_in_clinic', v)} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 6 }}>
              <Text>Video visits</Text>
              <Switch value={profile.visit_video} onValueChange={v => update('visit_video', v)} />
            </View>
            <Field label="Fee (In-clinic)" value={String(profile.fee_in_clinic ?? 0)} onChangeText={v => update('fee_in_clinic', Number(v))} keyboardType="numeric" />
            <Field label="Fee (Video)" value={String(profile.fee_video ?? 0)} onChangeText={v => update('fee_video', Number(v))} keyboardType="numeric" />
            <Field label="Slot minutes" value={String(profile.slot_minutes ?? 15)} onChangeText={v => update('slot_minutes', Number(v))} keyboardType="numeric" />
          </Section>

          {/* ------------------ Locations ------------------ */}
          <Section
            title="Locations"
            expanded={expanded.locations}
            onToggle={() => setExpanded(e => ({ ...e, locations: !e.locations }))}
          >
            {profile.locations.map((loc, i) => (
              <View key={i} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginBottom: 8 }}>
                <Field label="Name" value={loc.name} onChangeText={v => updateLoc(i, { name: v })} />
                <Field label="City" value={loc.city ?? ''} onChangeText={v => updateLoc(i, { city: v })} />
                <Field label="Hours" value={loc.hours ?? ''} onChangeText={v => updateLoc(i, { hours: v })} />
                <Btn title="Remove" onPress={() => removeLocation(i)} />
              </View>
            ))}
            <Btn title="+ Add Location" onPress={addLocation} />
          </Section>
        </ScrollView>
      </Screen>
  )
}
