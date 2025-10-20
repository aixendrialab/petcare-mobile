import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ColorLegend() {
  const Item = ({ color, label }: { color: string; label: string }) => (
    <View style={styles.item}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
  return (
    <View style={styles.row}>
      <Item color="#22c55e" label="Available" />
      <Item color="#ef4444" label="Booked" />
      <Item color="#a855f7" label="Break" />
      <Item color="#9ca3af" label="Blocked" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginVertical: 8 },
  item: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 999, marginRight: 6 },
  label: { fontSize: 12, color: '#555' }
});
