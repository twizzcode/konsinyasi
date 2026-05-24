# KonsinyasiKu Backend

Backend API untuk aplikasi konsinyasi berbasis Next.js App Router, Drizzle ORM, PostgreSQL, dan Supabase Storage.

## Stack

- Next.js `16`
- React `19`
- Drizzle ORM
- PostgreSQL
- Supabase Storage
- Zod

## Menjalankan Project

1. Copy env dari [.env.example](/home/twizzcode/programming/konsiyasi/backend/.env.example:1)
2. Isi semua variable yang dibutuhkan
3. Install dependency
4. Jalankan server development

```bash
bun install
bun dev
```

Server local akan berjalan di `http://localhost:3000`.

## Environment Variable

Variable yang dipakai project ini:

```env
DATABASE_URL=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=product-images

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

APP_ENV=development
```

Keterangan singkat:

- `DATABASE_URL`: koneksi database PostgreSQL
- `NEXT_PUBLIC_SUPABASE_URL`: base URL project Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: key backend untuk upload storage
- `SUPABASE_STORAGE_BUCKET`: bucket upload gambar
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dan `CLERK_SECRET_KEY`: disiapkan untuk integrasi Clerk

## Base URL API

API aplikasi ini adalah API Next.js dengan prefix `/api`.

Contoh:

- Health check: `GET /api/health`
- Upload file: `POST /api/upload`
- Daftar toko: `GET /api/stores`

## Autentikasi

Saat ini route yang butuh autentikasi membaca salah satu header berikut:

- `x-user-id`
- `x-clerk-id`

User tersebut harus sudah ada di tabel `users`. Sinkronisasi user lokal bisa dilakukan lewat endpoint `POST /api/users/sync`.

## Dokumentasi Lengkap

Dokumentasi endpoint, query parameter, body request, role akses, response, dan storage tersedia di:

- [docs/API.md](/home/twizzcode/programming/konsiyasi/backend/docs/API.md:1)

## Script

```bash
bun dev
bun build
bun start
bun lint
bun run db:generate
bun run db:migrate
bun run db:push
```
