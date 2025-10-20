import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Lightweight monthly calendar (no deps).
 * Props:
 *  - value: ISO 'YYYY-MM-DD'
 *  - onChange: (iso) => void
 */
type Props = {
  value: string;
  onChange: (nextISO: string) => void;
};

function toISO(d: Date) {
  return d.toISOString().slice(0,10);
}

export default function CalendarDayPicker({ value, onChange }: Props) {
  const selected = new Date(value + 'T00:00:00');
  const [year, setYear] = React.useState(selected.getFullYear());
  const [month, setMonth] = React.useState(selected.getMonth()); // 0..11

  React.useEffect(() => {
    const d = new Date(value + 'T00:00:00');
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }, [value]);

  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0..6
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const grid: (number|null)[] = Array(startWeekday).fill(null).concat(
    Array.from({length: daysInMonth}, (_,i) => i+1)
  );
  while (grid.length % 7 !== 0) grid.push(null);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear()===d2.getFullYear() && d1.getMonth()===d2.getMonth() && d1.getDate()===d2.getDate();

  const selDate = new Date(value + 'T00:00:00');

  function changeMonth(delta: number) {
    let m = month + delta, y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m); setYear(y);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}><Text>{'<'}</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>
          {new Date(year, month, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}><Text>{'>'}</Text></TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <Text key={d} style={styles.weekHeaderText}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((day, idx) => {
          if (day === null) return <View key={idx} style={styles.cell} />;
          const d = new Date(year, month, day);
          const isSelected = isSameDay(d, selDate);
          return (
            <TouchableOpacity key={idx} style={[styles.cell, isSelected && styles.cellSelected]}
              onPress={() => onChange(toISO(d))}>
              <Text style={[styles.cellText, isSelected && styles.cellTextSelected]}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 8, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  navBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f2f2f2' },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  weekHeaderText: { width: 36, textAlign: 'center', fontSize: 12, color: '#666' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 2 },
  cellSelected: { backgroundColor: '#eef6ff', borderWidth: 1, borderColor: '#3282ff' },
  cellText: { fontSize: 14 },
  cellTextSelected: { color: '#0b61ff', fontWeight: '700' }
});
