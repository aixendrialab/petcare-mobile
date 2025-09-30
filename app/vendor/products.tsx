import React,{useEffect,useState} from 'react';
import { Screen, Card, Field, Btn } from '@/src/ui';
import { api, asArray } from '@/src/api';
import { Text } from 'react-native';
import { router } from 'expo-router';

type Product={ id:number; name:string; price:number; category?:string };

export default function VendorProducts(){
  const [items,setItems]=useState<Product[]>([]);
  const [name,setName]=useState(''); const [price,setPrice]=useState('');

  const load=async()=>{
    try { 
        const j = await api.get<Product[] | Product>('/products').then(r => r.data);
        setItems(asArray<Product>(j, []));
    }
    catch { setItems([]); }
  };
  useEffect(()=>{ load(); }, []);

  const add=async()=>{
    try { await api.post('/products',{ name, price:Number(price||0) }); setName(''); setPrice(''); }
    finally { load(); }
  };

  return (
    <Screen title="Vendor – Products" onBack={()=>router.back()}>
      <Card title="Add product">
        <Field placeholder="Name" value={name} onChangeText={setName} icon="pricetag-outline" />
        <Field placeholder="Price" value={price} onChangeText={setPrice} icon="cash-outline" keyboardType="numeric" />
        <Btn title="Add" onPress={add} />
      </Card>
      {items.map(p=>(
        <Card key={p.id} title={p.name}><Text>₹ {p.price}</Text></Card>
      ))}
    </Screen>
  );
}
