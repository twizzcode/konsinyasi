import { env } from '@/lib/env';

const getApiBaseUrl = () => {
  if (!env.authBaseUrl) {
    throw new Error('EXPO_PUBLIC_AUTH_BASE_URL is required');
  }

  return env.authBaseUrl.replace(/\/$/, '');
};

export async function apiGet<T>(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`);

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export async function apiDelete<T>(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}
