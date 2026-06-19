# KonsinyasiKu

Struktur project sekarang dipisah jadi:

- `frontend/`: aplikasi Expo React Native
- `backend/`: auth/API server dengan `Better Auth + Drizzle + Supabase Postgres`
- `docs/`: catatan migrasi dan dokumentasi internal

## Menjalankan project

Install dependency per app:

```bash
cd frontend && npm install
cd ../backend && npm install
```

Atau tetap dari root untuk script umum:

```bash
npm run start
npm run backend:dev
```

## Script root

- `npm run start`: jalankan Expo app dari `frontend/`
- `npm run android`: buka Expo Android
- `npm run ios`: buka Expo iOS
- `npm run web`: buka Expo Web
- `npm run backend:dev`: jalankan backend auth/API
- `npm run typecheck`: cek TypeScript frontend dan backend
- `npm run db:generate`: generate migration Drizzle
- `npm run db:migrate`: jalankan migration Drizzle

## Environment

- Salin `frontend/.env.example` menjadi `frontend/.env`
- Salin `backend/.env.example` menjadi `backend/.env`

Nilai penting:

- Frontend: `EXPO_PUBLIC_AUTH_BASE_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Backend: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`

Catatan development dengan Expo Go:

- Jika app dibuka dari HP via scan QR, jangan pakai `localhost` atau `10.0.2.2` untuk backend auth.
- Isi `EXPO_PUBLIC_AUTH_BASE_URL` dan `BETTER_AUTH_URL` dengan IP LAN mesin yang menjalankan backend, misalnya `http://192.168.1.10:3005`.
- `10.0.2.2` hanya untuk Android emulator, bukan device fisik.

## Status saat ini

- Login dan register email/password di frontend sudah tersambung ke Better Auth.
- Guard session untuk area tab sudah aktif.
- Data bisnis selain auth masih banyak yang memakai mock state.
