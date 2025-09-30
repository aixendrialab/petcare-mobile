import React from 'react';
import { Screen, Tile } from '@/src/ui';
import { View } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <Screen title="Who am I?" subtitle="Choose your role">
      <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
        <Link href="/parent/home" asChild><Tile icon="person-outline" label="Pet Parent" caption="Care & shop" /></Link>
        <Link href="/vet/home" asChild><Tile icon="medkit-outline" label="Veterinarian/Clinic" caption="Practice tools" /></Link>
        <Link href="/walker/home" asChild><Tile icon="walk-outline" label="Walker" caption="Walks & availability" /></Link>
        <Link href="/hostel/home" asChild><Tile icon="bed-outline" label="Hostel/Daycare" caption="Stays & reports" /></Link>
        <Link href="/vendor/home" asChild><Tile icon="pricetag-outline" label="Vendor/Shop" caption="Catalog & orders" /></Link>
        <Link href="/nutritionist/home" asChild><Tile icon="leaf-outline" label="Nutritionist" caption="Diet & plans" /></Link>
        <Link href="/pharmacist/home" asChild><Tile icon="medkit-outline" label="Pharmacist" caption="eRx & orders" /></Link>
      </View>
    </Screen>
  );
}
