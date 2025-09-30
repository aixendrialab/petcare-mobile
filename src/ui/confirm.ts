// src/ui/confirm.ts
import { Alert, Platform } from 'react-native';

export function confirm(message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    return Promise.resolve(window.confirm(message));
  }
  return new Promise((resolve) => {
    Alert.alert('Confirm', message, [
      { text: 'Edit', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Yes, send OTP', style: 'default', onPress: () => resolve(true) },
    ]);
  });
}
