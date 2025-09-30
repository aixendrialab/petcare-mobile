// jest.setup.ts
import '@testing-library/jest-native/extend-expect';
import type React from 'react';

// jest.setup.ts — add near the top
;(global as any).setImmediate ||= ((cb: any, ...args: any[]) => setTimeout(cb, 0, ...args));

// 1) Mock reanimated (unit tests don't need the real thing)
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  MediaTypeOptions: { Images: 'images' },
}));

// 2) Mock expo-router (router + Link passthrough)
jest.mock('expo-router', () => {
  const router = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  };
  const useRouter = () => router;
  const useLocalSearchParams = () => ({});
  const Link = ({ children }: { children?: React.ReactNode }) =>
    (children as React.ReactElement) ?? null;

  // Optional: minimal Stack mock so <Stack> doesn’t crash in tests
  const Stack = ({ children }: { children?: React.ReactNode }) =>
    (children as React.ReactElement) ?? null;

  return { router, useRouter, useLocalSearchParams, Link, Stack };
});

// 3) Mock axios instance (api) – tests will stub per call
jest.mock('@/src/api', () => ({
  api: {
    defaults: { baseURL: 'http://127.0.0.1:8001' },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

// 4) confirm() helper — default to "yes"
jest.mock('@/src/ui/confirm', () => ({
  confirm: jest.fn().mockResolvedValue(true),
}));

// 5) normalizePhone — simple mock (keep or remove if you want real util)
type PhoneNorm = { e164: string; pretty: string };
jest.mock('@/src/utils/phone', () => ({
  normalizePhone: (raw?: string, cc: string = '+91'): PhoneNorm => {
    const s = String(raw ?? '');
    const digits = s.replace(/\D+/g, '');
    if (!digits) return { e164: '', pretty: '' };
    const withCC = s.startsWith('+') ? s : `${cc}${digits.replace(/^0+/, '')}`;
    return { e164: withCC, pretty: withCC };
  },
}));

// 6) useAuth — define state INSIDE the mock factory (no out-of-scope refs)
jest.mock('@/src/auth', () => {
  const state = {
    user: undefined as any,
    roles: [] as any[],
    active: undefined as any,
    fetchMe: jest.fn(),
    setActiveContext: jest.fn(),
    logout: jest.fn(),
  };
  const useAuth = jest.fn(() => state);

  // Export a handle so tests can mutate the auth state:
  //   const authMod = require('@/src/auth') as any;
  //   Object.assign(authMod.__mockAuthState, { user: {…}, active: { role: 'parent' } });
  return {
    useAuth,
    __mockAuthState: state,
  };
});
