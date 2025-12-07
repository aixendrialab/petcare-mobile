import React from 'react';
import { Screen, Tile } from '@/src/ui';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/auth';

export default function VetHome() {
  const { user } = useAuth();
  const name = user?.name?.trim();
  const greeting = name && name.length > 0 ? `Welcome, ${name}` : 'Welcome';

  return (
    <Screen title="PetCare – Veterinarian" subtitle="Manage your practice">
      {/* Greeting */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '800' }}>
          {greeting} 👋
        </Text>
      </View>

      {/* Tiles */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* New: Check-in (front desk view) */}
        <Tile
          icon="log-in-outline"
          label="Check-in"
          caption="Front desk"
          onPress={() => router.push('/vet/checkin')}
        />

        <Tile
          icon="calendar-outline"
          label="Schedule"
          caption="Open & booked"
          onPress={() => router.push('/vet/schedule')}
        />
        <Tile
          title="Queue"
          label="Arrived / In-consult"
          onPress={() => router.push('/vet/queue')}
        />
        <Tile
          icon="medkit-outline"
          label="Consult"
          caption="Diagnosis & Rx"
          onPress={() => router.push('/vet/consult')}
        />
        <Tile icon="videocam-outline" label="Tele-visit" caption="Start room" />
        <Tile icon="people-outline" label="Staff" caption="Assistants" />
        <Tile icon="calendar" label="Roster" caption="Providers" />
        <Tile icon="clipboard-outline" label="Care Plans" caption="Follow-ups" />
        <Tile icon="flask-outline" label="Labs" caption="Orders & results" />
        <Tile
          icon="cube-outline"
          label="Inventory"
          caption="Stock & PO"
        />
        <Tile
          icon="receipt-outline"
          label="Invoices"
          caption="Billing"
          onPress={() => router.push('/vet/invoices')}
        />
        <Tile icon="cash-outline" label="Day Close" caption="Reconciliation" />
      </View>
    </Screen>
  );
}
