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
    eas: {
      projectId: '0d83f736-9e8b-483c-b9e7-cc7094cac7ef'   // <-- Required for EAS
    }
  },
  
  // 👇 Add this block
  android: {
    package: 'com.aixendrialab.petcare',   // <-- You may change domain prefix if you want
    versionCode: 1                         // required for Android builds
  },

  experiments: {
    typedRoutes: true
  }
};

export default config;
