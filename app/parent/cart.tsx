import React, {useEffect, useState} from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { API_BASE } from '@/src/config';
import { Text } from 'react-native';

export default function Cart(){
  const [cart, setCart] = useState<any>(); const [items, setItems] = useState<any[]>([]);
  const load = async ()=>{
    const c = await (await fetch(`${API_BASE}/cart`)).json(); setCart(c);
    const it = await (await fetch(`${API_BASE}/cart/items?cart_id=${c.id}`)).json(); setItems(it);
  };
  useEffect(()=>{ load(); }, []);
  const add = async()=>{
    await fetch(`${API_BASE}/cart/items`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({cart_id:cart.id, product_id:1, qty:1})}); load();
  };
  const checkout = async()=>{
    const amount = items.reduce((s,i)=> s + (i.product_id===1?1199:299)*i.qty, 0);
    const ord = await (await fetch(`${API_BASE}/orders?user_id=1&cart_id=${cart.id}&amount=${amount}`, {method:'POST'})).json();
    alert(`Order #${ord.id} created for ₹${amount}`);
  };
  return (
    <Screen>
      <Btn title="Add Kibble" onPress={add} />
      {items.map(i => <Card key={i.id} title={`Item #${i.id}`}><Text>product {i.product_id} x {i.qty}</Text></Card>)}
      <Btn title="Checkout" onPress={checkout} />
    </Screen>
  );
}
