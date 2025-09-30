import React from 'react';
import { Screen, Tile } from '@/src/ui';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function WalkerHome(){
  return (
    <Screen title="PetCare – Walker" subtitle="Walks & availability">
      <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
        <Tile icon="walk-outline" label="My Walks" caption="Assigned / history" onPress={()=>router.push('/walker/walks')} />
        <Tile icon="calendar-outline" label="Availability" caption="Open times" onPress={()=>router.push('/walker/availability')} />
      </View>
    </Screen>
  );
}
