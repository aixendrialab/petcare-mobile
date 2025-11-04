// app/auth/verify.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/auth';

export default function Verify() {
  const { phone } = useLocalSearchParams<{ phone: string }>(); // comes from /auth/verify?phone=...  :contentReference[oaicite:2]{index=2}
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');

  // Debug helper: turn any thrown value into a readable string
  function explainError(err: unknown): string {
    try {
      // axios-style
      // @ts-ignore
      if (err?.response) {
        // @ts-ignore
        const { status, data } = err.response;
        return `axios ${status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`;
      }
      // fetch-style: someone might have thrown a Response
      if (err instanceof Response) {
        return `fetch ${err.status}: (see console for body)`;
      }
      if (err instanceof Error) return `${err.name}: ${err.message}`;
      return String(err);
    } catch {
      return 'Unknown error';
    }
  }

  async function onVerify() {
    const p = String(phone || '').trim();
    const code = otp.trim();

    // Loud pre-flight info
    alert(`DEBUG: about to verify\nphone: ${p}\notp: ${code}`);

    try {
      const t0 = Date.now();
      const result = await verifyOtp(p, code); // original flow  :contentReference[oaicite:3]{index=3}
      const ms = Date.now() - t0;
      console.log('verifyOtp OK', { ms, result });
    } catch (e: any) {
      console.error('verifyOtp FAILED', e);

      // Try to read body if a Response was thrown (fetch-style)
      if (e instanceof Response) {
        const text = await e.text().catch(() => '<failed to read body>');
        alert(`DEBUG: verify FAILED\nstatus: ${e.status}\nbody: ${text}`);
        return;
      }

      // Fallback for axios/Error/unknown
      alert(`DEBUG: verify FAILED\n${explainError(e)}`);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Verify OTP</Text>

      <TextInput
        placeholder="OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <Pressable
        onPress={onVerify}
        style={{ backgroundColor: 'black', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>Verify</Text>
      </Pressable>
    </View>
  );
}
