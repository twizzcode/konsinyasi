const readOptionalEnv = (key: string) => {
  const value = process.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const readRequiredEnv = (key: string) => {
  const value = readOptionalEnv(key);
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const env = {
  supabaseUrl: readOptionalEnv('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: readOptionalEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  storageBucket: readOptionalEnv('EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET') ?? 'product-images',
  authBaseUrl: readOptionalEnv('EXPO_PUBLIC_AUTH_BASE_URL'),
  mobileScheme: readOptionalEnv('EXPO_PUBLIC_MOBILE_SCHEME') ?? 'konsinyasiku',
};

export const envStatus = {
  supabaseReady: Boolean(env.supabaseUrl && env.supabaseAnonKey),
  authReady: Boolean(env.authBaseUrl),
};

export const requireSupabaseEnv = () => ({
  supabaseUrl: readRequiredEnv('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: readRequiredEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
});
