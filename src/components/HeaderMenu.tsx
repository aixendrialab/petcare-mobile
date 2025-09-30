// src/components/HeaderMenu.tsx
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useAuth } from '@/src/auth';
import RoleSwitcherButton from '@/src/components/RoleSwitcherButton';
import { router } from 'expo-router';

export default function HeaderMenu() {
  const { state, logout } = useAuth();

  // When logged out (guest), render nothing — no “Logout” in header.
  if (state.status !== 'authed') return <View />;

  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Pressable onPress={() => router.push('/settings/edit')} hitSlop={8}>
        <Text style={{ opacity: 0.8 }}>Logout</Text>
      </Pressable>
      <RoleSwitcherButton />
      <Pressable onPress={logout} hitSlop={8}>
        <Text style={{ opacity: 0.8 }}>Logout</Text>
      </Pressable>
    </View>
  );
}
