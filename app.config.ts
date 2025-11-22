import 'dotenv/config';
import type { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'PetCare',
  slug: 'petcare',
  scheme: 'petcare',
  plugins: [
    'expo-router',
    'expo-font',
  ],
extra: {
  API_BASE: process.env.EXPO_PUBLIC_API_BASE,
},
  experiments: { typedRoutes: true },
};
export default config;
