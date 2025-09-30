// app/settings/index.tsx
import React from 'react'
import { Alert, Platform } from 'react-native'
import { Screen, Card, Btn } from '@/src/ui'
import { useRouter } from 'expo-router'
import { useAuth } from '@/src/auth'
import RoleSwitcherButton from '@/src/components/RoleSwitcherButton'

export default function SettingsIndex() {
  const router = useRouter()
  const { active, logout } = useAuth()
  const doLogout = () => {
    const go = () => logout()
    if (Platform.OS === 'web') {
      // web confirm
      if (confirm('Log out of PetCare?')) go()
    } else {
      Alert.alert('Log out', 'Log out of PetCare?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: go },
      ])
    }
  }

  return (
    <Screen title="Settings" subtitle="Account & Pets">
      <Card title="Your profile">
        <Btn title="Edit Profile" onPress={() => router.push('/settings/edit')} />
      </Card>

      <RoleSwitcherButton />

      <Card title="Account">
        <Btn title="Log out" variant="danger" onPress={doLogout} />
      </Card>
    </Screen>
  )
}
