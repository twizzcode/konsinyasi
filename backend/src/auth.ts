import { expo } from '@better-auth/expo';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { db } from './db';
import * as schema from './db/schema';

const scheme = process.env.MOBILE_APP_SCHEME ?? 'konsinyasiku';
const trustedOrigins = [
  `${scheme}://`,
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
  plugins: [expo()],
});
