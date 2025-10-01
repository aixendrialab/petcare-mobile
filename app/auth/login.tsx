// app/auth/login.tsx
import React, { useEffect, useState } from 'react';
import { Screen, Field, Btn, Card } from '@/src/ui';
import { router } from 'expo-router';
import { api } from '@/src/api';
import { normalizeToE164, prettyForDialog } from '@/src/utils/phone';
import { confirm } from '@/src/ui/confirm'; // tiny helper we added

export default function Login() {
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false); // <- component owns the state

  useEffect(() => {
    console.log('API baseURL =', api.defaults.baseURL);
  }, []);

async function onSend() {
  if (sending) return;

  const e164 = normalizeToE164(phone);
  if (!e164) {
    alert('Please enter a valid mobile number.');
    return;
  }

  const ok = await confirm(`Send OTP to:\n\n${prettyForDialog(e164)}`);
  if (!ok) return;

  setSending(true);
  try {
    await api.post('/auth/otp/request', { phone: e164 });
    router.push({ pathname: '/auth/verify', params: { phone: e164 } } as any);
  } catch (e: any) {
    alert(e?.response?.data?.detail || 'Failed to send OTP. Please try again.');
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
          autoCapitalize="none"
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
