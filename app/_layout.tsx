// app/_layout.tsx
import React, { useEffect } from 'react'
import { Pressable, Text } from 'react-native'
import { Stack, usePathname, useRouter, Link } from 'expo-router'
import { AuthProvider, useAuth } from '@/src/auth'
// import HeaderMenu from '@/src/components/HeaderMenu' // keep if you use /settings

function Gate({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  const router = useRouter()
  const pathname = usePathname() || ''
  const top = pathname.split('/')[1] || '' // '', 'auth', 'who-am-i', '<role>'

  useEffect(() => {
    // 1) Guests can only be on /auth/*
    if (state.status === 'guest') {
      if (top !== 'auth') router.replace('/auth/login' as any)
      return
    }

    // 2) Authed but no active role → must pick one
    const activeRole = state.active?.role
    if (!activeRole) {
      if (top !== 'who-am-i') router.replace('/who-am-i' as any)
      return
    }

    // 3) Authed + active: profile gate

    // 4) Profile complete → if sitting on /auth, /who-am-i or root, send to home
    if (top === 'auth' || top === 'who-am-i' || top === '') {
      if (pathname !== `/${activeRole}/home`) {
        router.replace(`/${activeRole}/home` as any)
      }
    }
  }, [
    state.status,
    state.active?.role,
    state.user?.name,
    state.user?.email,
    pathname,
    top,
    router,
  ])

  return <>{children}</>
}

// NEW: context-aware header action
function HeaderRight() {
  const { state, logout } = useAuth()

  if (state.status !== 'authed') return null

  const activeRole = state.active?.role
  const inFunnel = !activeRole

  if (inFunnel) {
    // Show Logout during the who-am-i / profile funnel
    return (
      <Pressable
        onPress={logout}
        hitSlop={10}
        accessibilityLabel="Log out"
        style={{ paddingHorizontal: 12 }}
      >
        <Text style={{ fontSize: 16 }}>Logout</Text>
      </Pressable>
    )
  }

  // After funnel complete, show Settings gear
  return (
    <Link href="/settings" asChild>
      <Pressable hitSlop={10} accessibilityLabel="Open settings" style={{ paddingHorizontal: 12 }}>
        <Text style={{ fontSize: 18 }}>⚙️</Text>
      </Pressable>
    </Link>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate>
        <Stack
          screenOptions={{
            headerTitle: 'PetCare',
            headerRight: () => <HeaderRight />,
          }}
        />
      </Gate>
    </AuthProvider>
  )
}
