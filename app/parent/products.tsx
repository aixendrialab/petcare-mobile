// app/parent/products.tsx
import React, { useEffect, useState } from 'react';
import { Screen, Card, Field, Btn } from '@/src/ui';
import { api } from '@/src/api';
import { Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

type Product = { id: number; name: string; price: number; category?: string };
const cats = ['Food', 'Treats', 'Toys', 'Health', 'Grooming', 'Accessories'];

export default function Products() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('');
  const [items, setItems] = useState<Product[]>([]);

  const search = async () => {
    try {
      const { data } = await api.get('/products', {
        params: { category: cat || undefined, q: q || undefined },
      });
      setItems(Array.isArray(data) ? (data as Product[]) : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => { void search(); }, []);

  const add = async (p: Product) => {
    await api.post('/cart/items', { product_id: p.id, qty: 1 });
    alert('Added to cart');
  };

  return (
    <Screen title="Shop 🛍 Product Discovery" subtitle="Search or pick a category" onBack={() => router.back()}>
      <Field
        placeholder="Search (e.g., joint support, hypoallergenic)"
        value={q}
        onChangeText={setQ}
        trailing={
          <TouchableOpacity onPress={search}>
            <Text>Go</Text>
          </TouchableOpacity>
        }
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6 }}>
        {cats.map(c => (
          <TouchableOpacity
            key={c}
            onPress={() => { setCat(c); setTimeout(search, 0); }}
            style={{
              paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1,
              borderColor: c === cat ? '#111' : '#e5e7eb', margin: 4, backgroundColor: c === cat ? '#fff' : '#f8fafc',
            }}
          >
            <Text style={{ color: c === cat ? '#111' : '#111' }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {items.map(p => (
        <Card key={p.id} title={p.name} subtitle={p.category}>
          <Btn title={`Add ₹${p.price}`} onPress={() => add(p)} />
        </Card>
      ))}
    </Screen>
  );
}
