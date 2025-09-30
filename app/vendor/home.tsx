import React from 'react';
import { Screen, Tile } from '@/src/ui';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function VendorHome(){
  return (
    <Screen title="Vendor / Shop" subtitle="Products • Catalog • Orders • Delivery">
      <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
        <Tile icon="pricetag-outline" label="Products" onPress={()=>router.push('/vendor/products')} />
        <Tile icon="cloud-upload-outline" label="Catalog Upload" onPress={()=>router.push('/vendor/upload')} />
        <Tile icon="cart-outline" label="Orders" onPress={()=>router.push('/vendor/orders')} />
        <Tile icon="bicycle-outline" label="Deliveries" onPress={()=>router.push('/vendor/delivery')} />
      </View>
    </Screen>
  );
}
