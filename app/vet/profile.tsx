import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, ActivityIndicator, Switch as RNSwitch, Platform } from 'react-native'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { api } from '@/src/api'
import { Screen, Card, Field, Btn } from '@/src/ui'
import { useAuth } from '@/src/auth'
import { useVetStore } from '@/src/state/vet'

// coercion helpers (same behavior, centralized)
type VetIntKey = 'experience_years' | 'fee_in_clinic' | 'fee_video' | 'slot_minutes'
const VET_INT_KEYS = new Set<VetIntKey>(['experience_years','fee_in_clinic','fee_video','slot_minutes'])
const toInt = (v:any, d=0)=>{ const n = parseInt(String(v ?? '').trim(),10); return Number.isFinite(n)?n:d }
const toFloatOrNull = (v:any)=>{ const s=String(v??'').trim(); if(!s) return null; const n=parseFloat(s); return Number.isFinite(n)?n:null }

function LabeledSwitch({ label, value, onValueChange }:{
  label:string; value:boolean; onValueChange:(v:boolean)=>void
}) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical:6 }}>
      <Text>{label}</Text>
      <RNSwitch value={value} onValueChange={onValueChange} />
    </View>
  )
}

type Mode = 'create' | 'edit'

export default function VetProfileScreen({ mode = 'create' }: { mode?: Mode }) {
  const router = useRouter()
  const { user, fetchMe, setActiveContext } = useAuth()  // roles/active/user come from /me :contentReference[oaicite:3]{index=3}

  // Zustand store
  const {
    userName, email, phoneReadOnly,
    profile, specialtiesText,
    baseUserName, baseEmail, baseVetJson,
    setAccount, setProfile, setSpecialtiesText, resetFromServer
  } = useVetStore()

  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving]  = useState(false)

  // preload on EDIT: one GET, then seed store
  useEffect(() => {
    if (mode !== 'edit') {
      // seed from auth (create mode)
      resetFromServer({
        userName: user?.name ?? '',
        email: user?.email ?? '',
        phoneReadOnly: user?.phone ?? '',
        profile: { ...profile, specialties: profile.specialties ?? [] },
      })
      return
    }
    (async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/users/vet/profile') // GET /api/v1/users/vet/profile (prefix is in FastAPI) :contentReference[oaicite:4]{index=4}
        const p = data?.profile ?? {}
        const locs = Array.isArray(data?.locations) ? data.locations : []
        const merged = {
          legal_name: p.legal_name ?? '',
          display_name: p.display_name ?? '',
          business_email: p.business_email ?? '',
          billing_email: p.billing_email ?? '',
          billing_address: p.billing_address ?? '',
          gstin: p.gstin ?? '',
          pan: p.pan ?? '',
          qualifications: p.qualifications ?? '',
          license_no: p.license_no ?? '',
          experience_years: p.experience_years ?? 0,
          specialties: Array.isArray(p.specialties) ? p.specialties : [],
          visit_in_clinic: !!p.visit_in_clinic,
          visit_video: !!p.visit_video,
          fee_in_clinic: p.fee_in_clinic ?? 0,
          fee_video: p.fee_video ?? 0,
          slot_minutes: p.slot_minutes ?? 15,
          locations: locs,
        }
        resetFromServer({
          userName: user?.name ?? '',
          email: user?.email ?? '',
          phoneReadOnly: user?.phone ?? '',
          profile: merged,
        })
      } catch (e) {
        console.error('[vet/profile] preload error:', e)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // field helpers (keep JSX simple)
  function update<K extends keyof typeof profile>(key: K, raw: any) {
    setProfile({
      [key]: VET_INT_KEYS.has(key as VetIntKey)
        ? (key === 'slot_minutes'
            ? Math.max(5, Math.min(120, toInt(raw)))
            : toInt(raw))
        : raw,
    } as any)
  }
  function upsertLocation(idx: number, patch: Partial<typeof profile.locations[number] & Record<'lat'|'lng', any>>) {
    const locs = [...profile.locations]
    const cur  = { ...(locs[idx] ?? {}) }
    if ('lat' in patch)  cur.lat = toFloatOrNull(patch.lat)
    if ('lng' in patch)  cur.lng = toFloatOrNull(patch.lng)
    Object.entries(patch).forEach(([k,v])=>{
      if (k !== 'lat' && k !== 'lng') (cur as any)[k] = v
    })
    locs[idx] = cur
    setProfile({ locations: locs })
  }
  function addLocation() {
    setProfile({
      locations: [
        ...profile.locations,
        { name:'', line1:'', line2:'', city:'', lat:null, lng:null, hours:'', is_primary: profile.locations.length===0 },
      ]
    })
  }
  function removeLocation(idx:number){
    const next = profile.locations.filter((_,i)=>i!==idx)
    if (next.length && !next.some(l=>l.is_primary)) next[0].is_primary = true
    setProfile({ locations: next })
  }
  function setPrimary(idx:number){
    setProfile({ locations: profile.locations.map((l,i)=>({ ...l, is_primary: i===idx })) })
  }

  // dirtiness (to avoid any no-op PUT; you asked to keep calls minimum)
  const isAccountDirty =
    (userName.trim() !== baseUserName.trim()) ||
    (email.trim()    !== baseEmail.trim())
  const buildVetPayload = () => {
    const specialties = specialtiesText.split(',').map(s=>s.trim()).filter(Boolean)
    return { ...profile, specialties }
  }
  const isVetDirty = () => JSON.stringify(buildVetPayload()) !== baseVetJson

  async function save() {
    if (saving) return
    const vetPayload = buildVetPayload()
    // If absolutely nothing changed, skip any calls.
    if (!isAccountDirty && JSON.stringify(vetPayload) === baseVetJson) {
      return router.back()
    }

    setSaving(true)
    try {
      // ONE CALL: extend body to include account fields (name/email)
      // Server will upsert user and vet in one go (see backend patch below).
      await api.put('/users/vet/register', {
        name: userName.trim(),
        email: email.trim(),
        ...vetPayload,
      })

      // reflect server truth and route
      await fetchMe()                     // /me refresh (roles/active/user) :contentReference[oaicite:5]{index=5}
      if (mode === 'create') {
        await setActiveContext('vet')     // POST /me/active + refresh :contentReference[oaicite:6]{index=6}
        router.replace('/vet/home' as any)
      } else {
        router.back()
      }
    } catch (e:any) {
      console.error('[vet/profile] save error:', e)
      alert(e?.response?.data?.detail || e?.message || 'Failed to save vet profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Screen title={mode==='create'?'Onboarding':'Edit Profile'} subtitle="Vet">
        <View style={{ padding:24, alignItems:'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop:12, color:'#666' }}>Loading profile…</Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen
      title={mode==='create'?'Onboarding':'Edit Profile'}
      subtitle="Vet"
      footer={<Btn title={saving ? 'Saving…' : (mode==='create'?'Save & Continue':'Save')} onPress={save} disabled={saving} />}
    >
      <Card title="Account">
        <Field label="Full name" value={userName} onChangeText={(v)=>setAccount({ userName: v })} />
        <Field label="Email" value={email} onChangeText={(v)=>setAccount({ email: v })} keyboardType="email-address" />
        <View style={{ marginTop:8 }}>
          <Text style={{ opacity:0.6 }}>Mobile</Text>
          <Text style={{ fontSize:16 }}>{phoneReadOnly || '—'}</Text>
        </View>
      </Card>

      <Card title="Business identity">
        <Field label="Legal name" value={profile.legal_name ?? ''} onChangeText={(v)=>update('legal_name', v)} />
        <Field label="Display name" value={profile.display_name ?? ''} onChangeText={(v)=>update('display_name', v)} />
        <Field label="Business email" value={profile.business_email ?? ''} onChangeText={(v)=>update('business_email', v)} keyboardType="email-address" />
        <Field label="Billing email" value={profile.billing_email ?? ''} onChangeText={(v)=>update('billing_email', v)} keyboardType="email-address" />
        <Field label="Billing address" value={profile.billing_address ?? ''} onChangeText={(v)=>update('billing_address', v)} />
        <Field label="GSTIN" value={profile.gstin ?? ''} onChangeText={(v)=>update('gstin', v)} />
        <Field label="PAN" value={profile.pan ?? ''} onChangeText={(v)=>update('pan', v)} />
      </Card>

      <Card title="Professional details">
        <Field label="Qualifications" value={profile.qualifications ?? ''} onChangeText={(v)=>update('qualifications', v)} />
        <Field label="License number" value={profile.license_no ?? ''} onChangeText={(v)=>update('license_no', v)} />
        <Field label="Experience (years)" value={String(profile.experience_years ?? 0)} onChangeText={(v)=>update('experience_years', v)} keyboardType="numeric" />
        <Field label="Specialties (comma-separated)" value={specialtiesText} onChangeText={setSpecialtiesText} placeholder="dermatology, surgery" />
      </Card>

      <Card title="Consultation settings">
        <LabeledSwitch label="In-clinic visits" value={profile.visit_in_clinic} onValueChange={(v)=>setProfile({ visit_in_clinic: v })} />
        <LabeledSwitch label="Video visits" value={profile.visit_video} onValueChange={(v)=>setProfile({ visit_video: v })} />
        <Field label="Fee (in-clinic)" value={String(profile.fee_in_clinic ?? 0)} onChangeText={(v)=>update('fee_in_clinic', v)} keyboardType="numeric" />
        <Field label="Fee (video)" value={String(profile.fee_video ?? 0)} onChangeText={(v)=>update('fee_video', v)} keyboardType="numeric" />
        <Field label="Slot minutes" value={String(profile.slot_minutes)} onChangeText={(v)=>update('slot_minutes', v)} keyboardType="numeric" />
      </Card>

      <Card title="Locations">
        {profile.locations.map((loc, idx) => (
          <View key={idx} style={{ borderWidth:1, borderColor:'#eee', borderRadius:8, padding:12, marginBottom:12 }}>
            <Field label="Name" value={loc.name ?? ''} onChangeText={(v)=>upsertLocation(idx, { name: v })} />
            <Field label="Address line 1" value={loc.line1 ?? ''} onChangeText={(v)=>upsertLocation(idx, { line1: v })} />
            <Field label="Address line 2" value={loc.line2 ?? ''} onChangeText={(v)=>upsertLocation(idx, { line2: v })} />
            <Field label="City" value={loc.city ?? ''} onChangeText={(v)=>upsertLocation(idx, { city: v })} />
            <View style={{ flexDirection:'row', gap:8 }}>
              <Field label="Latitude"  value={loc.lat?.toString() ?? ''} onChangeText={(v)=>upsertLocation(idx, { lat: v })} keyboardType="numeric" />
              <Field label="Longitude" value={loc.lng?.toString() ?? ''} onChangeText={(v)=>upsertLocation(idx, { lng: v })} keyboardType="numeric" />
            </View>
            <Field label="Hours" value={loc.hours ?? ''} onChangeText={(v)=>upsertLocation(idx, { hours: v })} />
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:6 }}>
              <LabeledSwitch label="Primary" value={!!loc.is_primary} onValueChange={()=>setPrimary(idx)} />
              <View style={{ flexDirection:'row', gap:8 }}>
                <Btn title="Use my location" onPress={async () => {
                  try {
                    const { status } = await Location.requestForegroundPermissionsAsync()
                    if (status !== 'granted') { alert('Location permission denied'); return }
                    const loc = await Location.getCurrentPositionAsync({})
                    upsertLocation(idx, { lat: loc.coords.latitude, lng: loc.coords.longitude })
                  } catch (e: any) { alert(e?.message || 'Could not get location') }
                }} />
                <Btn title="Remove" onPress={()=>removeLocation(idx)} />
              </View>
            </View>
          </View>
        ))}
        <Btn title="Add location" onPress={addLocation} />
      </Card>
    </Screen>
  )
}
