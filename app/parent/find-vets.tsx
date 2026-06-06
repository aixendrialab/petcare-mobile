import React, { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, TextInput, Pressable,
  ActivityIndicator, Platform,
} from 'react-native'
import * as Location from 'expo-location'
import { api } from '@/src/api'
import { Screen, Btn, Card } from '@/src/ui'

type Vet = {
  user_id: number
  name: string | null
  display_name: string | null
  specialties: string[]
  visit_in_clinic: boolean
  visit_video: boolean
  fee_in_clinic: number
  fee_video: number
  location_id: number | null
  location_name: string | null
  line1: string | null
  city: string | null
  lat: number | null
  lng: number | null
  hours: string | null
  distance_km?: number
}

// ── Leaflet map via inline HTML in an iframe (no npm packages, completely free) ──
function VetMap({ vets, center }: { vets: Vet[]; center: { lat: number; lng: number } | null }) {
  if (Platform.OS !== 'web') return null

  const markers = vets.filter(v => v.lat && v.lng)
  const mapCenter = center ?? { lat: 20.5937, lng: 78.9629 }
  const zoom = center ? 12 : 5

  const markersJs = markers
    .map(v => {
      const title = (v.display_name || v.name || 'Vet').replace(/'/g, "\\'")
      const addr = [v.line1, v.city].filter(Boolean).join(', ').replace(/'/g, "\\'")
      return `L.marker([${v.lat},${v.lng}]).addTo(map).bindPopup('<b>${title}</b><br>${addr}');`
    })
    .join('\n')

  const userMarker = center
    ? `L.circleMarker([${center.lat},${center.lng}],{radius:8,color:'#4f46e5',fillColor:'#4f46e5',fillOpacity:0.9}).addTo(map).bindPopup('You are here');`
    : ''

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>body{margin:0}#map{width:100%;height:100vh}</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map').setView([${mapCenter.lat},${mapCenter.lng}],${zoom});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  ${markersJs}
  ${userMarker}
</script>
</body>
</html>`

  return (
    <View style={{ height: 380, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
      {/* @ts-ignore – iframe is web-only */}
      <iframe srcDoc={html} width="100%" height="100%" style={{ border: 'none' }} title="Vet map" />
    </View>
  )
}

// ── Single vet card ──
function VetCard({ v }: { v: Vet }) {
  return (
    <Card>
      <Text style={{ fontWeight: '700', fontSize: 15 }}>
        {v.display_name || v.name || 'Unnamed Clinic'}
      </Text>

      {(v.line1 || v.city) && (
        <Text style={{ opacity: 0.6, marginTop: 2, fontSize: 13 }}>
          {[v.line1, v.city].filter(Boolean).join(', ')}
        </Text>
      )}

      {v.specialties?.length > 0 && (
        <Text style={{ marginTop: 4, opacity: 0.7, fontSize: 13 }}>
          {v.specialties.join(' · ')}
        </Text>
      )}

      <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
        {v.visit_in_clinic && (
          <Text style={{ fontSize: 13 }}>🏥 ₹{v.fee_in_clinic}</Text>
        )}
        {v.visit_video && (
          <Text style={{ fontSize: 13 }}>📹 ₹{v.fee_video}</Text>
        )}
        {v.distance_km != null && (
          <Text style={{ fontSize: 13, color: '#4f46e5', fontWeight: '600' }}>
            {v.distance_km.toFixed(1)} km
          </Text>
        )}
      </View>

      {v.hours && (
        <Text style={{ marginTop: 4, opacity: 0.5, fontSize: 12 }}>🕐 {v.hours}</Text>
      )}
    </Card>
  )
}

export default function FindVets() {
  const [allVets, setAllVets]       = useState<Vet[]>([])
  const [query, setQuery]           = useState('')
  const [loadingList, setLoadingList] = useState(true)
  const [locating, setLocating]     = useState(false)
  const [center, setCenter]         = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyVets, setNearbyVets] = useState<Vet[]>([])
  const [locError, setLocError]     = useState<string | null>(null)

  // Load all vets on mount
  useEffect(() => {
    api.get('/vets')
      .then(r => setAllVets(r.data.vets || []))
      .catch(() => setAllVets([]))
      .finally(() => setLoadingList(false))
  }, [])

  // Filter list by search query
  const filtered = allVets.filter(v => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      v.display_name?.toLowerCase().includes(q) ||
      v.name?.toLowerCase().includes(q) ||
      v.city?.toLowerCase().includes(q) ||
      v.specialties?.some(s => s.toLowerCase().includes(q))
    )
  })

  // Map shows nearby vets if location is set, otherwise all vets
  const mapVets = center ? nearbyVets : allVets

  async function useMyLocation() {
    setLocError(null)
    setLocating(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocError('Location permission denied. Please enable it in your settings.')
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = loc.coords
      setCenter({ lat: latitude, lng: longitude })
      const { data } = await api.get('/vets/nearby', {
        params: { lat: latitude, lng: longitude, radius_km: 10 },
      })
      setNearbyVets(data.vets || [])
    } catch (e: any) {
      setLocError(e?.message || 'Could not get location')
    } finally {
      setLocating(false)
    }
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>

      {/* ── All vets list ── */}
      <Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 12 }}>
        All Vets
      </Text>

      <TextInput
        placeholder="Search by name, city or specialty…"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
          padding: 10, fontSize: 14, marginBottom: 12, backgroundColor: '#fff',
        }}
      />

      {loadingList ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : filtered.length === 0 ? (
        <Text style={{ opacity: 0.5, textAlign: 'center', marginTop: 16 }}>
          {query ? 'No vets match your search.' : 'No vets registered yet.'}
        </Text>
      ) : (
        filtered.map((v, i) => <VetCard key={`${v.user_id}-${v.location_id ?? i}`} v={v} />)
      )}

      {/* ── Map section ── */}
      <View style={{ marginTop: 28, marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 4 }}>
          Search on Map
        </Text>
        <Text style={{ opacity: 0.6, fontSize: 13, marginBottom: 12 }}>
          Share your location to see vets near you highlighted on the map.
        </Text>

        <Btn
          title={locating ? 'Getting location…' : center ? 'Refresh my location' : 'Use my location'}
          onPress={useMyLocation}
          disabled={locating}
        />

        {!!locError && (
          <Text style={{ color: '#dc2626', marginTop: 8, fontSize: 13 }}>{locError}</Text>
        )}

        {center && nearbyVets.length === 0 && !locating && (
          <Text style={{ opacity: 0.6, marginTop: 8, fontSize: 13 }}>
            No vets found within 10 km of your location.
          </Text>
        )}

        {center && nearbyVets.length > 0 && (
          <Text style={{ marginTop: 8, fontWeight: '600', color: '#4f46e5' }}>
            {nearbyVets.length} vet{nearbyVets.length !== 1 ? 's' : ''} within 10 km
          </Text>
        )}
      </View>

      <VetMap vets={mapVets} center={center} />

    </ScrollView>
  )
}
