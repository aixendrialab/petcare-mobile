// app/(parent)/home.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { api } from '@/src/api'
import { useAuth } from '@/src/auth'

type Pet = { id:number; name:string; breed?:string; picture_uri?:string }
type Appt = { id:number; at:string; vet?:string; location?:string }
type Rx = { id:number; drug:string; status:string }
type Order = { id:number; status:string; total:number }

function QuickAction({
  label, onPress, subtitle,
}: { label:string; subtitle?:string; onPress:()=>void }) {
  return (
    <Pressable onPress={onPress}
      style={{padding:14, borderWidth:1, borderColor:'#e3e3e3', borderRadius:14, marginRight:12, minWidth:140}}>
      <Text style={{fontWeight:'700'}}>{label}</Text>
      {!!subtitle && <Text style={{opacity:0.6, marginTop:4}}>{subtitle}</Text>}
    </Pressable>
  )
}

export default function ParentHome() {  
  const router = useRouter()
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([])
  const [appts, setAppts] = useState<Appt[]>([])
  const [vaccinesDue, setVaccinesDue] = useState<any[]>([])
  const [rx, setRx] = useState<Rx[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.get('/me/pets').then(r=>setPets(r.data.pets||[])).catch(()=>setPets([]))

    // Wire these when Lot D endpoints are in place; harmless if 404/empty:
    api.get('/appointments?mine=1&status=confirmed')
      .then(r => setAppts(r.data.items||[]))
      .catch(() => setAppts([]))

    api.get('/vaccines/due?mine=1')
      .then(r => setVaccinesDue(r.data.items||[]))
      .catch(() => setVaccinesDue([]))

    api.get('/erx?mine=1')
      .then(r => setRx(r.data.items||[]))
      .catch(() => setRx([]))

    api.get('/orders?mine=1&limit=5')
      .then(r => setOrders(r.data.items||[]))
      .catch(() => setOrders([]))
  }, [])

  const name = user?.name?.trim()
  const greeting = name && name.length > 0 ? `Welcome, ${name}` : 'Welcome'

  return (
    <ScrollView style={{flex:1}} contentContainerStyle={{padding:16, paddingBottom:28}}>

      {/* Greeting + Pets */}
      <View style={{marginBottom:16}}>
        <Text style={{fontSize:22, fontWeight:'800'}}>
          Welcome {greeting} 👋
        </Text>
        {!!user?.phone && <Text style={{opacity:0.6}}>{user.phone}</Text>}

        <FlatList
          data={pets}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(p)=>String(p.id)}
          style={{marginTop:12}}
          renderItem={({item}) => (
            <View style={{marginRight:12, alignItems:'center'}}>
              {item.picture_uri
                ? <Image source={{uri:item.picture_uri}} style={{width:64, height:64, borderRadius:32}} />
                : <View style={{width:64, height:64, borderRadius:32, backgroundColor:'#eee'}} />
              }
              <Text style={{marginTop:6, fontWeight:'600'}}>{item.name}</Text>
              <Text style={{opacity:0.6, fontSize:12}}>{item.breed ?? '—'}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{opacity:0.7}}>Add your first pet from Profile → Pets</Text>}
        />
      </View>

      {/* Quick Actions */}
      <Text style={{fontSize:18, fontWeight:'700', marginBottom:8}}>What would you like to do?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
        <QuickAction label="Book a Vet" subtitle="In-clinic or video"
          onPress={()=>router.push('/parent/find-vets' as any)} />
        <QuickAction label="Televisit" subtitle="Start a consult"
          onPress={()=>router.push('/(parent)/televisit' as any)} />
        <QuickAction label="Upload Report" subtitle="PDF / Images"
          onPress={()=>router.push('/(parent)/reports' as any)} />
        <QuickAction label="Refill Meds" subtitle="e-Rx & orders"
          onPress={()=>router.push('/(parent)/prescriptions' as any)} />
        <QuickAction label="Order Food" subtitle="Nutrition plans"
          onPress={()=>router.push('/(parent)/cart' as any)} />
      </ScrollView>

      {/* Upcoming Appointments */}
      <Section
        title="Upcoming Appointments"
        onSeeAll={()=>router.push('/(parent)/appointments' as any)}
      >
        {appts.length === 0
          ? <Empty text="No upcoming visits. Book a slot now →" onAction={()=>router.push('/(parent)/appointments' as any)} />
          : appts.slice(0,3).map(a => (
            <Row key={a.id} primary={a.vet ?? 'Scheduled visit'} secondary={a.at} tertiary={a.location} />
          ))
        }
      </Section>

      {/* Vaccines Due */}
      <Section
        title="Vaccines Due"
        onSeeAll={()=>router.push('/(parent)/vaccines' as any)}
      >
        {vaccinesDue.length === 0
          ? <Empty text="All caught up. We’ll remind you when due." />
          : vaccinesDue.slice(0,3).map(v => (
            <Row key={v.id} primary={v.vaccine_name} secondary={`Due ${v.due_on}`} />
          ))
        }
      </Section>

      {/* Prescriptions */}
      <Section title="Prescriptions" onSeeAll={()=>router.push('/(parent)/prescriptions' as any)}>
        {rx.length === 0
          ? <Empty text="No prescriptions yet." />
          : rx.slice(0,3).map(r => <Row key={r.id} primary={r.drug} secondary={r.status} />)
        }
      </Section>

      {/* Orders & Cart */}
      <Section title="Recent Orders" onSeeAll={()=>router.push('/(parent)/orders' as any)}>
        {orders.length === 0
          ? <Empty text="Your cart is empty. Browse products →" onAction={()=>router.push('/(parent)/cart' as any)} />
          : orders.slice(0,3).map(o => <Row key={o.id} primary={`Order #${o.id}`} secondary={o.status} />)
        }
      </Section>

      {/* Rewards & Events */}
      <Section title="Rewards & Achievements" onSeeAll={()=>router.push('/(parent)/rewards' as any)}>
        <Empty text="Earn points by completing care actions." />
      </Section>

      <Section title="Events Near You" onSeeAll={()=>router.push('/(parent)/events' as any)}>
        <Empty text="No upcoming events. Check back soon!" />
      </Section>
    </ScrollView>
  )
}

function Section({title, children, onSeeAll}:{title:string; children:React.ReactNode; onSeeAll?:()=>void}) {
  return (
    <View style={{marginTop:8, marginBottom:14}}>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <Text style={{fontSize:16, fontWeight:'700'}}>{title}</Text>
        {onSeeAll && <Pressable onPress={onSeeAll}><Text style={{opacity:0.7}}>See all</Text></Pressable>}
      </View>
      <View style={{gap:10}}>{children}</View>
    </View>
  )
}
function Row({primary, secondary, tertiary}:{primary:string; secondary?:string; tertiary?:string}) {
  return (
    <View style={{padding:12, borderWidth:1, borderColor:'#eee', borderRadius:12}}>
      <Text style={{fontWeight:'700'}}>{primary}</Text>
      {!!secondary && <Text style={{opacity:0.7}}>{secondary}</Text>}
      {!!tertiary && <Text style={{opacity:0.6}}>{tertiary}</Text>}
    </View>
  )
}
function Empty({text, onAction}:{text:string; onAction?:()=>void}) {
  return (
    <Pressable onPress={onAction} disabled={!onAction}
      style={{padding:12, borderWidth:1, borderStyle:'dashed', borderColor:'#e5e5e5', borderRadius:12}}>
      <Text style={{opacity:0.7}}>{text}</Text>
    </Pressable>
  )
}
