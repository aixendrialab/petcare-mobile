import { useAuth } from '@/src/auth'
import ParentProfile from '@/app/parent/profile'
import VetProfile from '@/app/vet/profile'
import { Screen } from '@/src/ui'

export default function SettingsEdit() {
  const { active } = useAuth()               // active?: { role: 'parent' | 'vet' | ... }
  const isVet = active?.role === 'vet'       // <- compare strings

  return (
    <Screen title="Edit Profile" subtitle={isVet ? 'Vet' : 'Parent'}>
      {isVet ? <VetProfile mode="edit" /> : <ParentProfile mode="edit" />}
    </Screen>
  )
}
