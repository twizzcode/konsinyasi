import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { env } from '@/lib/env';

export const authClient = createAuthClient({
  baseURL: env.authBaseUrl ?? 'http://localhost:3005',
  plugins: [
    expoClient({
      scheme: env.mobileScheme,
      storagePrefix: 'konsinyasiku',
      storage: SecureStore,
    }),
  ],
});
