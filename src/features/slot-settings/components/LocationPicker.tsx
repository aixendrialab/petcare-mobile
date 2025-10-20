import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Location } from '../types';

type Props = {
  locations: Location[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
};

export default function LocationPicker({ locations, selectedId, onSelect }: Props) {
  return (
    <View>
      <Text style={styles.title}>Pick Location</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => String(item.id)}  
        renderItem={({ item }) => {
          const sel = item.id === selectedId;
          return (
            <TouchableOpacity style={[styles.row, sel && styles.rowSelected]} onPress={() => onSelect(item.id)}>
              <Text style={[styles.name, sel && styles.nameSelected]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No locations found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  row: { padding: 12, borderRadius: 12, backgroundColor: '#f7f7f7', marginBottom: 8 },
  rowSelected: { backgroundColor: '#e6f0ff', borderWidth: 1, borderColor: '#8bb4ff' },
  name: { fontSize: 14 },
  nameSelected: { fontWeight: '700', color: '#0b61ff' },
  empty: { color: '#777' }
});
