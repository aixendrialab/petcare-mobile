// src/components/RoleSwitcherButton.tsx
import React, { useMemo, useState } from 'react'
import { Modal, Pressable, View, Text, FlatList, Platform } from 'react-native'
import { useAuth } from '@/src/auth'
import { Href, useRouter } from 'expo-router'

type RoleItem = { role: string }

export default function RoleSwitcherButton() {
  const { roles, active, setActiveContext, fetchMe } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  type RoleParam = Parameters<typeof setActiveContext>[0]

  const items: RoleItem[] = useMemo(
    () => (roles ?? []).map((r: any) => ({ role: String(r.role) })),
    [roles]
  )

  //const canSwitch = (items?.length || 0) > 1
  //if (!canSwitch) return null

  async function choose(role: RoleParam) {
    try {
      setOpen(false)
      if (role === (active?.role as RoleParam)) return
      await setActiveContext(role)
      await fetchMe()
      // 👇 Redirect to the active role’s home immediately
      router.replace((`/${role}/home`) as Href)
    } catch (e) {
      console.error('switch role failed', e)
    }
  }

  function toRoleLabel(role?: unknown) {
    if (role == null) return 'Role'
    const s = typeof role === 'string' ? role : String((role as any).toString?.() ?? role)
    if (!s) return 'Role'
    const clean = s.replace(/_/g, ' ').toLowerCase()
    return clean.charAt(0).toUpperCase() + clean.slice(1)
  }

  const roleLabel = toRoleLabel(active?.role)

  return (
    <>
      <Pressable
        testID="switch-role-button"
        onPress={() => setOpen(true)}
        style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#eee' }}
        accessibilityLabel={`Switch ${roleLabel}`}
      >
        <Text>Switch {roleLabel}</Text>
      </Pressable>

      <Modal
        visible={open}
        animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => setOpen(false)}>
          <View
            style={{
              marginTop: 'auto',
              backgroundColor: '#fff',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
              maxHeight: '60%',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Switch role</Text>

            <FlatList
              data={items}
              keyExtractor={(it) => it.role}
              renderItem={({ item }) => {
                const selected = item.role === active?.role
                return (
                  <Pressable
                    onPress={() => choose(item.role as RoleParam)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      borderRadius: 8,
                      backgroundColor: selected ? '#f0f0f0' : 'transparent',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    accessibilityLabel={`Switch to ${item.role}`}
                  >
                    <Text style={{ fontSize: 15 }}>{toRoleLabel(item.role)}</Text>
                    {selected && <Text style={{ opacity: 0.6 }}>current</Text>}
                  </Pressable>
                )
              }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />

            {/* NEW: Add new role */}
            <Pressable
              testID="add-new-role"
              onPress={() => {
                setOpen(false)
                // MUST match your file path: app/roles/addNewRole.tsx -> "/roles/addNewRole"
                router.push('/roles/addNewRole' as Href)
              }}
              accessibilityLabel="Add new role"
              style={{ marginTop: 12, alignSelf: 'flex-start', padding: 10 }}
            >
              <Text style={{ color: '#007aff' }}>+ Add new role</Text>
            </Pressable>
            <Pressable onPress={() => setOpen(false)} style={{ marginTop: 4, alignSelf: 'center', padding: 10 }}>
              <Text style={{ color: '#555' }}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
