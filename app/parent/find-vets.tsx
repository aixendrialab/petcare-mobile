import React, { useState } from 'react'
import {
  View, Text, FlatList, Pressable, ActivityIndicator,
  Platform, ScrollView,
} from 'react-native'
import * as Location from 'expo-location'
import { api } from '@/src/api'
import { Screen, Btn, Card } from '@/src/ui'

type VetResult = {
  user_id: number
  name: string | null
  display_name: string | null
  specialties: string[]
  visit_in_clinic: boolean
  visit_video: boolean
  fee_in_clinic: number
  fee_video: number
  location_id: number
  location_name: string | null
  line1: string | null
  city: string | null
  lat: number
  lng: number
  hours: string | null
  distance_km: number
}

function MapEmbed({ lat, lng, vets }: { lat: number; lng: number; vets: VetResult[] }) {
  if (Platform.OS !== 'web') return null
  const markers = vets
    .map(v => `${v.lat},${v.lng},${encodeURIComponent(v.display_name || v.name || 'Vet')}`)
    .join('|')
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.1}%2C${lat - 0.1}%2C${lng + 0.1}%2C${lat + 0.1}&layer=mapnik&marker=${lat}%2C${lng}`
  return (
    <View style={{ height: 240, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      {/* @ts-ignore iframe is web-only */}
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="Nearby vets map"
      />
    </View>
  )
}

export default function FindVets() {
  const [loading, setLoading] = useState(false)
  const [vets, setVets] = useState<VetResult[]>([])
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function locate() {
    setError(null)
    setLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setError('Location permission denied. Please enable it in your device settings.')
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = loc.coords
      setUserLat(latitude)
      setUserLng(longitude)
      await search(latitude, longitude)
    } catch (e: any) {
      setError(e?.message || 'Could not get location')
    } finally {
      setLoading(false)
    }
  }

  async function search(lat: number, lng: number) {
    const { data } = await api.get('/vets/nearby', { params: { lat, lng, radius_km: 10 } })
    setVets(data.vets || [])
  }

  return (
    <Screen title="Find a Vet" subtitle="Vets near you">
      <Btn title={loading ? 'Locating…' : 'Use my location'} onPress={locate} disabled={loading} />

      {loading && (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8, opacity: 0.6 }}>Finding vets near you…</Text>
        </View>
      )}

      {!!error && (
        <Text style={{ color: '#c00', marginTop: 12 }}>{error}</Text>
      )}

      {!loading && userLat && vets.length === 0 && (
        <Text style={{ opacity: 0.6, marginTop: 16, textAlign: 'center' }}>
          No vets found within 10 km. Try expanding the search area.
        </Text>
      )}

      {userLat && userLng && vets.length > 0 && (
        <>
          <MapEmbed lat={userLat} lng={userLng} vets={vets} />
          <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>
            {vets.length} vet{vets.length !== 1 ? 's' : ''} found nearby
          </Text>
          <FlatList
            data={vets}
            keyExtractor={(v) => String(v.location_id)}
            scrollEnabled={false}
            renderItem={({ item: v }) => (
              <Card>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>
                  {v.display_name || v.name || 'Unnamed Clinic'}
                </Text>
                {v.city && (
                  <Text style={{ opacity: 0.6, marginTop: 2 }}>
                    {[v.line1, v.city].filter(Boolean).join(', ')}
                  </Text>
                )}
                <Text style={{ marginTop: 4, color: '#4f46e5', fontWeight: '600' }}>
                  {v.distance_km.toFixed(1)} km away
                </Text>

                {(v.specialties?.length > 0) && (
                  <Text style={{ marginTop: 4, opacity: 0.7 }}>
                    {v.specialties.join(' · ')}
                  </Text>
                )}

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
                  {v.visit_in_clinic && (
                    <Text style={{ fontSize: 13 }}>🏥 In-clinic ₹{v.fee_in_clinic}</Text>
                  )}
                  {v.visit_video && (
                    <Text style={{ fontSize: 13 }}>📹 Video ₹{v.fee_video}</Text>
                  )}
                </View>

                {v.hours && (
                  <Text style={{ marginTop: 4, opacity: 0.6, fontSize: 12 }}>🕐 {v.hours}</Text>
                )}
              </Card>
            )}
          />
        </>
      )}
    </Screen>
  )
}
