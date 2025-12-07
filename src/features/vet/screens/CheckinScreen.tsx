import React, { useEffect, useState } from 'react';
import { View, Text as RNText, ScrollView, Platform } from 'react-native';
import { Screen, Card, Btn, Field, Text } from '@/src/ui';
import { api } from '@/src/api';
import { useRouter } from 'expo-router';
import {
  fetchVetCheckinAppointments,
  vetCheckinAppointment,
} from '../api';
import { VetCheckinAppt } from '../types';

type VetLocation = { id: number; name: string };

export default function VetCheckinScreen() {
  const [locations, setLocations] = useState<VetLocation[]>([]);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [date, setDate] = useState(() => new Date());
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState<VetCheckinAppt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isoDate = date.toISOString().slice(0, 10);

  // Load vet locations (same as schedule)
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get<VetLocation[]>('/vet/locations');
        const list = r.data || [];
        setLocations(list);
        if (!locationId && list.length) {
          setLocationId(list[0].id);
        }
      } catch {
        setLocations([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load appointments for check-in
  const reload = async () => {
    if (!locationId) return;
    setLoading(true);
    try {
      const list = await fetchVetCheckinAppointments({
        date: isoDate,
        location_id: locationId,
        search,
      });
      setAppointments(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!locationId) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, isoDate]);

  const onCheckin = async (appt: VetCheckinAppt) => {
    try {
      await vetCheckinAppointment(appt.id);
      await reload();
    } catch (err: any) {
      alert(
        err?.response?.data?.detail ||
          'Unable to check-in this appointment',
      );
    }
  };

  const stateLabel = (a: VetCheckinAppt) => {
    if (a.calendar_state === 'ARRIVED') return 'ARRIVED';
    if (a.calendar_state === 'IN_CONSULT') return 'IN CONSULT';
    if (a.calendar_state === 'COMPLETED') return 'COMPLETED';
    return a.calendar_state || 'BOOKED';
  };

  const stateColor = (a: VetCheckinAppt) => {
    switch (a.calendar_state) {
      case 'ARRIVED':
        return '#16a34a';
      case 'IN_CONSULT':
        return '#6366f1';
      case 'COMPLETED':
        return '#6b7280';
      default:
        return '#0f766e'; // BOOKED / default
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Screen
      title="Check-in"
      subtitle="Front desk – arrivals"
      onBack={() => router.back()}
    >
      {/* Controls: date + clinic + search */}
      <Card style={{ padding: 12, marginHorizontal: 12, marginBottom: 12 }}>
        <RNText style={{ fontWeight: '600', marginBottom: 8 }}>
          Select date & clinic
        </RNText>

        {/* Date picker */}
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={isoDate}
            onChange={(e) => {
              const d = new Date(e.target.value);
              if (!Number.isNaN(d.getTime())) {
                setDate(d);
              }
            }}
            style={{
              padding: 8,
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              marginBottom: 8,
            }}
          />
        ) : (
          <RNText style={{ marginBottom: 8 }}>{isoDate}</RNText>
        )}

        {/* Clinic pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {locations.map((loc) => (
            <View
              key={loc.id}
              style={{ marginRight: 8, marginTop: 8 }}
            >
              <Btn
                title={loc.name}
                variant={locationId === loc.id ? 'primary' : 'secondary'}
                onPress={() => setLocationId(loc.id)}
              />
            </View>
          ))}
        </ScrollView>

        {/* Search (pet / owner / booking id) */}
        <View style={{ marginTop: 12 }}>
          <Field
            label="Search"
            placeholder="Pet, owner or booking ID"
            value={search}
            onChangeText={setSearch}
            right={undefined}
          />
          <View style={{ marginTop: 8, flexDirection: 'row' }}>
            <Btn title="Search" onPress={reload} />
            <View style={{ width: 8 }} />
            <Btn
              title="Clear"
              variant="secondary"
              onPress={() => {
                setSearch('');
                reload();
              }}
            />
          </View>
        </View>
      </Card>

      {/* Appointment list */}
      <ScrollView style={{ paddingHorizontal: 12 }}>
        <Card title="Today’s appointments">
          {loading ? (
            <Text>Loading…</Text>
          ) : appointments.length === 0 ? (
            <Text>No appointments for this selection.</Text>
          ) : (
            appointments.map((a) => (
              <View
                key={a.id}
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#e4e7ff',
                }}
              >
                <Text style={{ fontWeight: '700', marginBottom: 2 }}>
                  {formatTime(a.start_ts)} • {a.pet_name}
                </Text>
                <Text style={{ fontSize: 12, color: '#555' }}>
                  Owner: {a.parent_name}
                </Text>
                <Text style={{ fontSize: 12, color: '#555' }}>
                  Clinic: {a.location_name || '—'}
                </Text>
                <Text style={{ fontSize: 12, color: '#555' }}>
                  Mode:{' '}
                  {a.mode === 'video' ? 'Video consult' : 'In-clinic'}
                </Text>
                <Text style={{ fontSize: 12, color: '#555' }}>
                  Booking ID: {a.slot_id}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 6,
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 999,
                      backgroundColor: stateColor(a),
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 11,
                        fontWeight: '700',
                      }}
                    >
                      {stateLabel(a)}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {a.calendar_state === 'BOOKED' && (
                    <Btn
                      title="Check-in"
                      onPress={() => onCheckin(a)}
                    />
                  )}
                  {a.calendar_state === 'ARRIVED' && (
                    <Text style={{ marginTop: 4 }}>
                      Already checked-in – visible in Queue.
                    </Text>
                  )}
                  {a.calendar_state === 'IN_CONSULT' && (
                    <Text style={{ marginTop: 4 }}>
                      In consultation.
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}
