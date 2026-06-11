import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store is native-only; on web fall back to localStorage so the
// app also runs in the browser (used for quick verification/dev).
const KEY = 'onetachka_token';

export async function readToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return globalThis.localStorage?.getItem(KEY) ?? null;
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(KEY);
}

export async function writeToken(token: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (token) globalThis.localStorage?.setItem(KEY, token);
      else globalThis.localStorage?.removeItem(KEY);
    } catch {
      /* ignore */
    }
    return;
  }
  if (token) await SecureStore.setItemAsync(KEY, token);
  else await SecureStore.deleteItemAsync(KEY);
}
