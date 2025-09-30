// app/auth/verify.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/auth';

export default function Verify() {
  // phone comes from the URL (/auth/verify?phone=XXXXXXXXXX)
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');

  async function onVerify() {
    try {
      // Let AuthProvider handle token save + state;
      // _layout will take care of navigation after auth.
      await verifyOtp(String(phone || ''), otp.trim());
    } catch (e: any) {
      alert(e?.message || 'Verification failed');
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Verify OTP</Text>

      {/* No phone input here — only OTP */}
      <TextInput
        placeholder="OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
        }}
      />

      <Pressable
        onPress={onVerify}
        style={{
          backgroundColor: 'black',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>Verify</Text>
      </Pressable>
    </View>
  );
}
