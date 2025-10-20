import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LocalSlotSetting } from '../types';

type Props = {
  settings: LocalSlotSetting[];
  onAdd: () => void;
  onEdit: (setting: LocalSlotSetting) => void;
  onDelete: (setting: LocalSlotSetting) => void;
  onPreview: (setting: LocalSlotSetting) => void; // 👈 new prop
};

export default function SlotSettingsList({ settings, onAdd, onEdit, onDelete, onPreview }: Props) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Slot Settings</Text>
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {settings.length === 0 ? (
        <Text style={styles.empty}>No slot settings. Tap “Add” to create one.</Text>
      ) : (
        settings.map((s) => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              Effective {s.effectiveDate ?? '—'} • {s.windowStart}–{s.windowEnd} • {s.slotMinutes}m
            </Text>
            <Text style={styles.cardSub}>
              Breaks: {s.breaks?.length ?? 0} • Blocks: {s.blockWindows?.length ?? 0} • Cap: {s.perSlotCapacity}
            </Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => onEdit(s)} style={styles.btn}>
                <Text style={styles.btnTxt}>Edit</Text>
              </TouchableOpacity>

              {/* 👇 NEW Preview button */}
              <TouchableOpacity onPress={() => onPreview(s)} style={[styles.btn, styles.info]}>
                <Text style={[styles.btnTxt, styles.infoTxt]}>Preview</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onDelete(s)} style={[styles.btn, styles.danger]}>
                <Text style={[styles.btnTxt, styles.btnDangerTxt]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: '700' },
  addBtn: {
    backgroundColor: '#0b61ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  empty: { color: '#777' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardSub: { color: '#666', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  btn: {
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnTxt: { fontWeight: '600' },
  info: { backgroundColor: '#dbeafe' },
  infoTxt: { color: '#1d4ed8' },
  danger: { backgroundColor: '#fee2e2' },
  btnDangerTxt: { color: '#b91c1c' },
});
