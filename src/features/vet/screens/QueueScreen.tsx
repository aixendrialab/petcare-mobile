import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Screen, Card, Tile, Avatar, Text } from '@/src/ui'
import { fetchVetQueue, fetchVetRecentConsults } from '../api'
import { useRouter } from 'expo-router'
import { VetQueueItem, VetRecentConsult } from '../types'

export default function VetQueueScreen() {
  const [queue, setQueue] = useState<VetQueueItem[]>([])
  const [recent, setRecent] = useState<VetRecentConsult[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        const [q, r] = await Promise.all([
          fetchVetQueue(),
          fetchVetRecentConsults(),
        ])
        setQueue(q)
        setRecent(r)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const arrived = queue.filter(q => q.state === 'ARRIVED')
  const inConsult = queue.filter(q => q.state === 'IN_CONSULT')

  return (
    <Screen title="Queue & Recent Visits">
      <Card title="Arrived / Waiting">
        {arrived.length === 0 ? (
          <Text>No pets waiting right now.</Text>
        ) : (
          arrived.map(item => (
            <Tile
              key={item.appointment_id}
              title={item.pet_name}
              label={item.owner_name}
              subtitle={item.location_name ?? ''}
              caption={new Date(item.start_ts).toLocaleTimeString()}
              onPress={() =>
                router.push({
                  pathname: '/vet/consult',
                  params: {
                    appointment_id: String(item.appointment_id),
                    pet_id: String(item.pet_id),
                  },
                })
              }
            />
          ))
        )}
      </Card>

      <Card title="In Consultation">
        {inConsult.length === 0 ? (
          <Text>No ongoing consults.</Text>
        ) : (
          inConsult.map(item => (
            <Tile
              key={item.appointment_id}
              title={item.pet_name}
              label={item.owner_name}
              subtitle={`In consult – ${item.location_name ?? ''}`}
              caption={new Date(item.start_ts).toLocaleTimeString()}
            />
          ))
        )}
      </Card>

      <Card title="Recently Seen Pets">
        {recent.length === 0 ? (
          <Text>No recent consults yet.</Text>
        ) : (
          recent.map(r => (
            <Tile
              key={r.consult_id}
              title={r.pet_name}
              subtitle={r.diagnosis || 'Consult completed'}
              caption={new Date(r.date).toLocaleString()}
              onPress={() =>
                router.push({
                  pathname: '/vet/consult/past',
                  params: { consult_id: String(r.consult_id) },
                })
              }
            />
          ))
        )}
      </Card>
    </Screen>
  )
}
