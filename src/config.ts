import Constants from 'expo-constants';
export const API_BASE =
  (Constants.expoConfig?.extra?.API_BASE as string | undefined) ??
  process.env.EXPO_PUBLIC_API_BASE ??
  'http://127.0.0.1:8001/api/v1';
