import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, FlatList } from 'react-native';
import { BreakWindow, SlotSetting } from '../types'
import CalendarDayPicker from './CalendarDayPicker';
import { LocalSlotSetting } from '../types';

type Props = {
  initial?: Partial<LocalSlotSetting>;
  onCancel: () => void;
  onSave: (setting: Omit<LocalSlotSetting, 'id'>) => void;
  onPreview: (dateISO: string, setting: Omit<LocalSlotSetting, 'id'>) => void;
};
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function SlotSettingForm({ initial = {}, onCancel, onSave, onPreview }: Props) {
  const [locationId] = React.useState(initial.locationId!);
  const [effectiveDate, setEffectiveDate] = React.useState(initial.effectiveDate || new Date().toISOString().slice(0,10));
  const [windowStart, setWindowStart] = React.useState(initial.windowStart || '09:00');
  const [windowEnd, setWindowEnd] = React.useState(initial.windowEnd || '17:00');
  const [slotMinutes, setSlotMinutes] = React.useState(String(initial.slotMinutes ?? 30));
  const [gapMinutes, setGapMinutes] = React.useState(String(initial.gapMinutes ?? 0));
  const [perSlotCapacity, setPerSlotCapacity] = React.useState(String(initial.perSlotCapacity ?? 1));
  const [breaks, setBreaks] = React.useState<BreakWindow[]>(initial.breaks ?? [{ start: '13:00', end: '13:30' }]);
  const [blockWindows, setBlockWindows] = React.useState<BreakWindow[]>(initial.blockWindows ?? []);
  const [visibleToParents, setVisibleToParents] = React.useState(!!initial.visibleToParents);
  const [daysOfWeek, setDaysOfWeek] = React.useState<number[]>(initial.daysOfWeek ?? [1,2,3,4,5]);
  const [previewDate, setPreviewDate] = React.useState(new Date().toISOString().slice(0,10));

  function toggleDow(i: number) {
    setDaysOfWeek(prev => prev.includes(i) ? prev.filter(x=>x!==i) : prev.concat(i).sort());
  }

  function addBreak() { setBreaks(prev => prev.concat({ start: '10:00', end: '10:30' })); }
  function addBlock() { setBlockWindows(prev => prev.concat({ start: '12:00', end: '12:30' })); }

  function save() {
    const payload = {
      locationId,
      effectiveDate,
      windowStart,
      windowEnd,
      slotMinutes: Number(slotMinutes),
      gapMinutes: Number(gapMinutes),
      perSlotCapacity: Number(perSlotCapacity),
      breaks,
      blockWindows,
      visibleToParents,
      daysOfWeek
    } as Omit<LocalSlotSetting,'id'>;
    onSave(payload);
  }

  function preview() {
    const payload = {
      locationId,
      effectiveDate,
      windowStart,
      windowEnd,
      slotMinutes: Number(slotMinutes),
      gapMinutes: Number(gapMinutes),
      perSlotCapacity: Number(perSlotCapacity),
      breaks,
      blockWindows,
      visibleToParents,
      daysOfWeek
    } as Omit<LocalSlotSetting,'id'>;
    onPreview(previewDate, payload);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slot Setting</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Effective Date</Text>
        <CalendarDayPicker value={effectiveDate} onChange={setEffectiveDate} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Window (Start–End)</Text>
        <View style={styles.rowHorizontal}>
          <TextInput value={windowStart} onChangeText={setWindowStart} placeholder="HH:mm" style={styles.input} />
          <Text style={{marginHorizontal:6}}>–</Text>
          <TextInput value={windowEnd} onChangeText={setWindowEnd} placeholder="HH:mm" style={styles.input} />
        </View>
      </View>

      <View style={styles.rowHorizontal}>
        <View style={{flex:1}}>
          <Text style={styles.label}>Slot Minutes</Text>
          <TextInput value={slotMinutes} onChangeText={setSlotMinutes} keyboardType="numeric" style={styles.input} />
        </View>
        <View style={{width:10}}/>
        <View style={{flex:1}}>
          <Text style={styles.label}>Gap Minutes</Text>
          <TextInput value={gapMinutes} onChangeText={setGapMinutes} keyboardType="numeric" style={styles.input} />
        </View>
      </View>

      <View style={styles.rowHorizontal}>
        <View style={{flex:1}}>
          <Text style={styles.label}>Per-slot Capacity</Text>
          <TextInput value={perSlotCapacity} onChangeText={setPerSlotCapacity} keyboardType="numeric" style={styles.input} />
        </View>
        <View style={{width:10}}/>
        <View style={{flex:1, alignItems:'flex-start'}}>
          <Text style={styles.label}>Visible to Parents</Text>
          <Switch value={visibleToParents} onValueChange={setVisibleToParents} />
        </View>
      </View>

      <Text style={[styles.label, {marginTop:8}]}>Days of Week</Text>
      <View style={styles.dowRow}>
        {DOW.map((d, i) => (
          <TouchableOpacity key={d} style={[styles.dowBtn, daysOfWeek.includes(i) && styles.dowBtnOn]} onPress={()=>toggleDow(i)}>
            <Text style={[styles.dowTxt, daysOfWeek.includes(i) && styles.dowTxtOn]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Breaks</Text>
        <FlatList
          data={breaks}
          keyExtractor={(_,i) => 'b'+i}
          renderItem={({item, index}) => (
            <View style={styles.rowHorizontal}>
              <TextInput value={item.start} onChangeText={(v)=>{
                const n=[...breaks]; n[index]={...n[index], start:v}; setBreaks(n);
              }} placeholder="HH:mm" style={[styles.input,{flex:1}]} />
              <Text style={{marginHorizontal:6}}>–</Text>
              <TextInput value={item.end} onChangeText={(v)=>{
                const n=[...breaks]; n[index]={...n[index], end:v}; setBreaks(n);
              }} placeholder="HH:mm" style={[styles.input,{flex:1}]} />
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={addBreak} style={styles.smallBtn}><Text style={styles.smallBtnTxt}>+ Add Break</Text></TouchableOpacity>
          }
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Blocked Windows</Text>
        <FlatList
          data={blockWindows}
          keyExtractor={(_,i) => 'w'+i}
          renderItem={({item, index}) => (
            <View style={styles.rowHorizontal}>
              <TextInput value={item.start} onChangeText={(v)=>{
                const n=[...blockWindows]; n[index]={...n[index], start:v}; setBlockWindows(n);
              }} placeholder="HH:mm" style={[styles.input,{flex:1}]} />
              <Text style={{marginHorizontal:6}}>–</Text>
              <TextInput value={item.end} onChangeText={(v)=>{
                const n=[...blockWindows]; n[index]={...n[index], end:v}; setBlockWindows(n);
              }} placeholder="HH:mm" style={[styles.input,{flex:1}]} />
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={addBlock} style={styles.smallBtn}><Text style={styles.smallBtnTxt}>+ Add Block</Text></TouchableOpacity>
          }
        />
      </View>

      <View style={{marginTop:12}}>
        <Text style={styles.label}>Preview Date</Text>
        <CalendarDayPicker value={previewDate} onChange={setPreviewDate} />
      </View>

      <View style={styles.ctaRow}>
        <TouchableOpacity onPress={onCancel} style={[styles.cta, styles.secondary]}><Text>Cancel</Text></TouchableOpacity>
        <TouchableOpacity onPress={preview} style={[styles.cta, styles.neutral]}><Text>Preview</Text></TouchableOpacity>
        <TouchableOpacity onPress={save} style={[styles.cta, styles.primary]}><Text style={{color:'#fff'}}>Save</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor:'#fff', borderRadius:12, padding:12, borderWidth:1, borderColor:'#eee' },
  title: { fontSize:16, fontWeight:'700', marginBottom:8 },
  label: { fontSize:12, color:'#555', marginBottom:6 },
  row: { marginVertical:6 },
  rowHorizontal: { flexDirection:'row', alignItems:'center' },
  input: { borderWidth:1, borderColor:'#ddd', paddingHorizontal:10, paddingVertical:8, borderRadius:10, minWidth:90 },
  dowRow: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  dowBtn: { borderWidth:1, borderColor:'#ddd', borderRadius:999, paddingHorizontal:10, paddingVertical:6, margin:4 },
  dowBtnOn: { backgroundColor:'#e9f2ff', borderColor:'#8bb4ff' },
  dowTxt: { fontSize:12, color:'#444' },
  dowTxtOn: { fontWeight:'700', color:'#0b61ff' },
  smallBtn: { alignSelf:'flex-start', backgroundColor:'#f4f4f5', paddingHorizontal:12, paddingVertical:6, borderRadius:10, marginTop:8 },
  smallBtnTxt: { fontWeight:'700' },
  ctaRow: { flexDirection:'row', justifyContent:'space-between', marginTop:12 },
  cta: { flex:1, alignItems:'center', paddingVertical:10, borderRadius:12, marginHorizontal:4, borderWidth:1, borderColor:'#e5e7eb' },
  primary: { backgroundColor:'#0b61ff', borderColor:'#0b61ff' },
  neutral: { backgroundColor:'#f3f4f6' },
  secondary: { backgroundColor:'#fff' }
});
