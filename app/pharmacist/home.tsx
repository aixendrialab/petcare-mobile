import React from 'react';
import { Screen, Tile } from '@/src/ui';
import { View } from 'react-native';
import { router } from 'expo-router';
export default function PharmacistHome(){
  return (
    <Screen title="Pharmacist" subtitle="eRx & Rx orders">
      <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
        <Tile icon="document-text-outline" label="eRx Queue" caption="Incoming" onPress={()=>router.push('/pharmacist/erx')} />
        <Tile icon="cart-outline" label="Orders" caption="Pack & ship" onPress={()=>router.push('/pharmacist/orders')} />
      </View>
    </Screen>
  );
}
