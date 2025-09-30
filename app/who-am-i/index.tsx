// app/who-am-i/index.tsx
import React, { useMemo } from 'react'
import { View, Pressable, Text, FlatList } from 'react-native'
import { router, type Href } from 'expo-router'
import { Role, useAuth } from '@/src/auth'
import { ALL_ROLES } from '../roles/roles'

type Item = { role: Role }

export function WhoAmIBase({ missingOnly = false }: { missingOnly?: boolean }) {
  const { roles = [], setActiveContext } = useAuth()

  const existing = useMemo(
    () => new Set(roles.map((r: any) => String(r.role).toLowerCase())),
    [roles]
  )

  const items: Item[] = useMemo(() => {
    const base = missingOnly
      ? ALL_ROLES.filter((r) => !existing.has(r))
      : ALL_ROLES
    return base.map((r) => ({ role: r }))
  }, [missingOnly, existing])

  // Dynamic route builder with a typed cast for Expo Router
  const profileHref = (role: Role): Href => `/${role}/profile` as Href

  async function pick(role: Role) {
    await setActiveContext(role)
    router.replace(profileHref(role))
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.role}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => pick(item.role)}
            style={{ padding: 16, borderWidth: 1, borderRadius: 12, marginBottom: 12 }}
            accessibilityLabel={`Choose ${item.role}`}
          >
            <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.role.toUpperCase()}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>You already have all available roles.</Text>}
      />
    </View>
  )
}

export default function WhoAmIScreen() {
  return <WhoAmIBase />
}
