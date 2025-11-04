import React from 'react'
import { Screen, Card, CardContent, Btn } from '@/src/ui'
import { useAuth } from '@/src/auth'
import { useRouter, Href, Link } from 'expo-router'

export default function VetSettingsScreen() {
  const { logout } = useAuth()
  const router = useRouter()

  return (
    <Screen title="Settings">
      <Card>
        <CardContent>
          <Link href="/vet/profile?mode=edit" asChild>
            <Btn title="Edit Profile" />
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Btn
            title="Slot Settings"
            onPress={() => router.push('/slots/settings' as Href)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Btn title="Log out" onPress={logout} />
        </CardContent>
      </Card>
    </Screen>
  )
}
