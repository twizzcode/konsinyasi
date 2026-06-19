import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

const SESSION_TOKEN_KEY = 'konsinyasiku_session_token';

const sessionTokenPlugin = {
  id: 'konsinyasiku-session-token',
  name: 'KonsinyasiKu Session Token',
  async init(url: string, options?: Record<string, any>) {
    const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
    if (!token) {
      return { url, options };
    }

    return {
      url,
      options: {
        ...options,
        headers: {
          ...(options?.headers ?? {}),
          authorization: `Bearer ${token}`,
        },
      },
    };
  },
  hooks: {
    async onSuccess(context: { request: Request; data?: { token?: string } }) {
      if (context.data?.token) {
        await SecureStore.setItemAsync(SESSION_TOKEN_KEY, context.data.token);
        return;
      }

      if (context.request.url.includes('/sign-out')) {
        await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
      }
    },
  },
} as const;

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_AUTH_BASE_URL?.trim(),
  plugins: [
    sessionTokenPlugin,
    expoClient({
      scheme: process.env.EXPO_PUBLIC_MOBILE_SCHEME?.trim() || 'konsinyasiku',
      storagePrefix: 'konsinyasiku',
      storage: SecureStore,
    }),
  ],
});
