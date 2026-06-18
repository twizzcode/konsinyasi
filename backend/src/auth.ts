import { expo } from '@better-auth/expo';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import { db } from './db';
import * as schema from './db/schema';

const scheme = process.env.MOBILE_APP_SCHEME ?? 'konsinyasiku';
const isDevelopment = process.env.NODE_ENV !== 'production';
const expoTrustedOrigins = isDevelopment
  ? [
    'exp://',
    'exp://**',
    'exp://192.168.*.*:*/**',
    'exp://10.0.*.*:*/**',
    'exp://172.16.*.*:*/**',
    'exp://172.17.*.*:*/**',
    'exp://172.18.*.*:*/**',
    'exp://172.19.*.*:*/**',
    'exp://172.20.*.*:*/**',
    'exp://172.21.*.*:*/**',
    'exp://172.22.*.*:*/**',
    'exp://172.23.*.*:*/**',
    'exp://172.24.*.*:*/**',
    'exp://172.25.*.*:*/**',
    'exp://172.26.*.*:*/**',
    'exp://172.27.*.*:*/**',
    'exp://172.28.*.*:*/**',
    'exp://172.29.*.*:*/**',
    'exp://172.30.*.*:*/**',
    'exp://172.31.*.*:*/**',
  ]
  : [];

const trustedOrigins = [
  `${scheme}://`,
  ...expoTrustedOrigins,
  ...(process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3005',
  trustedOrigins,
  user: {
    additionalFields: {
      accountType: {
        type: 'string',
        required: true,
      },
      businessName: {
        type: 'string',
        required: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (currentUser, context) => {
          const body = context?.body as { accountType?: string; businessName?: string } | undefined;
          const accountType = body?.accountType === 'supplier' ? 'supplier' : 'store';
          const businessName = typeof body?.businessName === 'string' && body.businessName.trim().length > 0
            ? body.businessName.trim()
            : currentUser.name;

          return {
            data: {
              ...currentUser,
              accountType,
              businessName,
            },
          };
        },
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [expo(), bearer()],
});
