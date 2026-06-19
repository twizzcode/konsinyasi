import Constants from 'expo-constants';
import { Platform } from 'react-native';

const readHostFromUri = (value?: string | null) => {
  if (!value) return undefined;

  const normalized = value.replace(/^[a-z]+:\/\//i, '').split('/')[0]?.trim();
  if (!normalized) return undefined;

  const host = normalized.split(':')[0]?.trim();
  return host || undefined;
};

export const getAuthBaseUrl = () => {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_AUTH_BASE_URL?.trim();
  if (configuredBaseUrl) return configuredBaseUrl.replace(/\/$/, '');

  if (typeof __DEV__ === 'undefined' || !__DEV__) return undefined;
  if (Platform.OS === 'web') return 'http://localhost:3005';

  const host =
    readHostFromUri(Constants.expoConfig?.hostUri) ??
    readHostFromUri(Constants.expoGoConfig?.debuggerHost);

  return host ? `http://${host}:3005` : undefined;
};

export const isAuthReady = () => Boolean(getAuthBaseUrl());
