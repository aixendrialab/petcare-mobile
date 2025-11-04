// app/auth/login.tsx
import React, { useEffect, useState } from 'react';
import { Screen, Field, Btn, Card } from '@/src/ui';
import { router } from 'expo-router';
import { api } from '@/src/api';
import { normalizePhone } from '@/src/utils/phone';
import { confirm } from '@/src/ui/confirm'; // tiny helper we added

export default function Login() {
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false); // <- component owns the state

  useEffect(() => {
    console.log('API baseURL =', api.defaults.baseURL);
  }, []);

  async function onSend() {
    if (sending) return; // guard against double taps

    const { e164, pretty } = normalizePhone(phone, 'IN'); // choose your default cc
    if (!e164) {
      alert('Please enter a valid mobile number.');
      return;
    }

    const ok = await confirm(`Send OTP to:\n\n${pretty}`);
    if (!ok) return;

    setSending(true);
    try {
      console.log('[login] sending OTP to', e164);
      await api.post('/auth/otp/request', { phone: e164 });
      // navigate to verify with the normalized phone
      router.push({ pathname: '/auth/verify', params: { phone: e164 } } as any);
    } catch (e: any) {
      console.error('[login] OTP request failed', e);
      alert(e?.response?.data?.detail || 'Failed to send OTP. Please try again.' + e);
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen title="PetCare   Sign in">
      <Card title="Enter your mobile">
        <Field
         placeholder="Mobile number"
         value={phone}
         onChangeText={sending ? () => {} : setPhone}
         keyboardType="phone-pad"
        />
        <Btn
          title={sending ? 'Sending…' : 'Send OTP'}
          onPress={onSend}
          disabled={sending}
        />
      </Card>
    </Screen>
  );
}
