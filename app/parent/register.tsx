import React, { useState } from 'react';
import { Screen, Field, Btn } from '@/src/ui';
import { api } from '@/src/api';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function ParentRegister(){
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const sendOtp = async () => {
    if(!phone) return;
    await api.post('/auth/otp/request', { phone });
    alert('OTP sent');
  };

  const next = async () => {
    const res = await api.post('/parents', { name, phone, email }).then(r=>r.data);
    alert(`Welcome, ${res.name ?? name}!`);
    router.back();
  };

  return (
    <Screen title="PetCare – Pet Parent" subtitle="Create your account" onBack={()=>router.back()}>
      <Field placeholder="Parent name" value={name} onChangeText={setName} icon="person-outline" />
      <Field
        placeholder="Mobile"
        value={phone}
        onChangeText={setPhone}
        icon="call-outline"
        keyboardType="phone-pad"
        trailing={
          <TouchableOpacity onPress={sendOtp} style={{ backgroundColor:'#eef2ff', paddingVertical:8, paddingHorizontal:10, borderRadius:10 }}>
            <Text>Send OTP</Text>
          </TouchableOpacity>
        }
      />
      <Field placeholder="Email" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" />
      <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:12 }}>
        <Btn title="Back" variant="secondary" onPress={()=>router.back()} />
        <Btn title="Next" onPress={next} />
      </View>
    </Screen>
  );
}
