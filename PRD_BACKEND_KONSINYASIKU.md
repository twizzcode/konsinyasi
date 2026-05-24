# PRD BACKEND — KONSINYASIKU

## 1. Nama Project

**KonsinyasiKu Backend API**

---

## 2. Deskripsi Project

KonsinyasiKu adalah aplikasi mobile untuk membantu pengelolaan sistem konsinyasi antara **pemilik toko**, **admin toko**, dan **penyuplai barang**.

Backend ini berfungsi sebagai pusat pengelolaan data toko, produk, supplier, stok, transaksi, laporan, user role, serta penyimpanan gambar produk.

Backend dibangun menggunakan:

- **Next.js API Route** sebagai REST API
- **Supabase PostgreSQL** sebagai database
- **Drizzle ORM** sebagai schema manager dan query builder
- **Supabase Storage** sebagai object storage
- **Clerk** sebagai opsi authentication jika frontend menggunakan Clerk
- **TypeScript** sebagai bahasa utama

Target client backend ini adalah **mobile app**, misalnya menggunakan:

- Expo
- React Native
- TypeScript
- NativeWind

---

## 3. Tech Stack

```txt
Backend Framework : Next.js API Route
Database          : Supabase PostgreSQL
ORM               : Drizzle ORM
Authentication    : Clerk Optional
Object Storage    : Supabase Storage
Language          : TypeScript
API Style         : REST API
Target Client     : Mobile App / Expo React Native
```

---

## 4. Tujuan Backend

Backend ini dibuat untuk:

1. Menyediakan API yang dapat digunakan oleh mobile app.
2. Mengelola data toko, produk, supplier, stok, dan transaksi.
3. Mendukung sistem multi-toko.
4. Mendukung role pengguna, yaitu owner, admin toko, dan supplier.
5. Menyediakan sistem upload gambar produk menggunakan Supabase Storage.
6. Menyimpan data secara relasional menggunakan PostgreSQL.
7. Menggunakan Drizzle ORM agar schema database lebih rapi, type-safe, dan mudah dikembangkan.
8. Menyiapkan integrasi autentikasi menggunakan Clerk.
9. Menyediakan laporan penjualan, laporan stok, dan laporan supplier.
10. Menjaga data transaksi dan stok tetap konsisten.

---

## 5. Konsep Sistem

### 5.1 Alur Umum Backend

```txt
Mobile App
↓
Next.js API Backend
↓
Drizzle ORM
↓
Supabase PostgreSQL
```

### 5.2 Alur Upload Gambar

```txt
Mobile App
↓
Next.js API Upload Endpoint
↓
Supabase Storage
↓
URL gambar disimpan ke Supabase PostgreSQL
```

### 5.3 Alur Authentication

```txt
Mobile App Login
↓
Clerk Auth
↓
Backend membaca userId dari Clerk
↓
Backend mencocokkan user dengan data toko dan role
```

### 5.4 Alur Development Awal Tanpa Clerk

Untuk development awal, backend boleh menggunakan header:

```txt
x-user-id: uuid-user
```

Tujuannya agar API tetap bisa dites menggunakan Postman, Thunder Client, atau mobile app sebelum auth Clerk benar-benar diintegrasikan.

---

## 6. Role Pengguna

### 6.1 Owner

Owner adalah pengguna yang membuat toko.

Hak akses owner:

1. Membuat toko.
2. Mengubah data toko.
3. Menghapus toko.
4. Menambahkan admin toko.
5. Menambahkan supplier.
6. Menambahkan produk.
7. Melihat semua produk.
8. Mengelola stok.
9. Membuat transaksi.
10. Melihat laporan penjualan.
11. Melihat laporan stok.
12. Melihat laporan supplier.
13. Mengelola member toko.

---

### 6.2 Admin Toko

Admin toko adalah pengguna yang membantu owner mengelola operasional toko.

Hak akses admin:

1. Melihat data toko tempat ia tergabung.
2. Menambahkan produk.
3. Mengubah produk.
4. Mengelola stok.
5. Membuat transaksi.
6. Melihat laporan penjualan.
7. Melihat data supplier.
8. Melihat laporan stok.

Admin tidak boleh:

1. Menghapus toko.
2. Mengubah owner toko.
3. Menghapus owner.
4. Mengubah role owner.
5. Mengelola member owner.

---

### 6.3 Supplier

Supplier adalah pengguna atau pihak yang menitipkan barang ke toko.

Hak akses supplier:

1. Melihat produk miliknya.
2. Melihat stok produk miliknya.
3. Melihat laporan penjualan produk miliknya.
4. Melihat estimasi pendapatan dari produk yang terjual.

Supplier tidak boleh:

1. Mengubah data toko.
2. Mengubah transaksi toko.
3. Melihat produk supplier lain.
4. Mengelola role user lain.
5. Mengelola stok secara langsung.
6. Menghapus produk.

---

## 7. Struktur Folder Backend

Gunakan struktur project seperti berikut:

```txt
konsinyasiku-backend/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── health/
│   │       │   └── route.ts
│   │       │
│   │       ├── users/
│   │       │   └── sync/
│   │       │       └── route.ts
│   │       │
│   │       ├── stores/
│   │       │   ├── route.ts
│   │       │   └── [storeId]/
│   │       │       └── route.ts
│   │       │
│   │       ├── store-members/
│   │       │   ├── route.ts
│   │       │   └── [memberId]/
│   │       │       └── route.ts
│   │       │
│   │       ├── suppliers/
│   │       │   ├── route.ts
│   │       │   └── [supplierId]/
│   │       │       └── route.ts
│   │       │
│   │       ├── products/
│   │       │   ├── route.ts
│   │       │   └── [productId]/
│   │       │       └── route.ts
│   │       │
│   │       ├── stock-movements/
│   │       │   └── route.ts
│   │       │
│   │       ├── transactions/
│   │       │   ├── route.ts
│   │       │   └── [transactionId]/
│   │       │       ├── route.ts
│   │       │       └── cancel/
│   │       │           └── route.ts
│   │       │
│   │       ├── reports/
│   │       │   ├── sales/
│   │       │   │   └── route.ts
│   │       │   ├── stock/
│   │       │   │   └── route.ts
│   │       │   └── supplier/
│   │       │       └── route.ts
│   │       │
│   │       └── upload/
│   │           └── route.ts
│   │
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── relations.ts
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── supabase.ts
│   │   ├── response.ts
│   │   └── validation.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── middleware.ts
│
├── drizzle/
│   └── migrations/
│
├── drizzle.config.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 8. Environment Variable

Buat file `.env.example`.

```env
DATABASE_URL=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=product-images

CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

APP_ENV=development
```

Keterangan:

1. `DATABASE_URL` digunakan Drizzle untuk koneksi ke Supabase PostgreSQL.
2. `NEXT_PUBLIC_SUPABASE_URL` digunakan untuk mengakses URL Supabase.
3. `SUPABASE_SERVICE_ROLE_KEY` digunakan untuk upload file ke Supabase Storage dari backend.
4. `SUPABASE_STORAGE_BUCKET` adalah nama bucket penyimpanan file produk.
5. `CLERK_SECRET_KEY` digunakan jika backend memakai Clerk.
6. Untuk tahap awal, auth bisa menggunakan `x-user-id` dari headers.

---

## 9. Database Design

Database menggunakan PostgreSQL dengan Drizzle ORM.

Tabel utama:

1. `users`
2. `stores`
3. `store_members`
4. `suppliers`
5. `products`
6. `stock_movements`
7. `transactions`
8. `transaction_items`

---

### 9.1 Tabel `users`

Menyimpan data user aplikasi.

Field:

```txt
id              uuid primary key
clerk_id        text unique nullable
name            text
email           text unique
phone           text nullable
avatar_url      text nullable
created_at      timestamp
updated_at      timestamp
```

Keterangan:

- `clerk_id` digunakan jika auth memakai Clerk.
- Jika belum menggunakan Clerk, user tetap bisa dibuat manual untuk testing.
- Email harus unik.

---

### 9.2 Tabel `stores`

Menyimpan data toko.

Field:

```txt
id              uuid primary key
owner_id        uuid references users(id)
name            text
description     text nullable
address         text nullable
phone           text nullable
logo_url        text nullable
created_at      timestamp
updated_at      timestamp
```

Relasi:

```txt
1 user owner bisa memiliki banyak stores
1 store memiliki banyak members
1 store memiliki banyak suppliers
1 store memiliki banyak products
1 store memiliki banyak stock_movements
1 store memiliki banyak transactions
```

---

### 9.3 Tabel `store_members`

Menyimpan anggota toko dan role-nya.

Field:

```txt
id              uuid primary key
store_id        uuid references stores(id)
user_id         uuid references users(id)
role            text
status          text
created_at      timestamp
updated_at      timestamp
```

Value `role`:

```txt
owner
admin
supplier
```

Value `status`:

```txt
active
inactive
pending
```

Keterangan:

- Tabel ini penting untuk sistem multi-toko.
- Satu user bisa tergabung di beberapa toko.
- Role user bisa berbeda di setiap toko.
- Kombinasi `store_id` dan `user_id` tidak boleh duplikat.

---

### 9.4 Tabel `suppliers`

Menyimpan data supplier atau penyuplai barang.

Field:

```txt
id              uuid primary key
store_id        uuid references stores(id)
user_id         uuid references users(id) nullable
name            text
phone           text nullable
email           text nullable
address         text nullable
notes           text nullable
created_at      timestamp
updated_at      timestamp
```

Keterangan:

- Supplier wajib terhubung dengan toko.
- Supplier bisa terhubung dengan akun user.
- Supplier juga bisa hanya berupa data manual tanpa akun login.

---

### 9.5 Tabel `products`

Menyimpan data produk konsinyasi.

Field:

```txt
id                  uuid primary key
store_id            uuid references stores(id)
supplier_id         uuid references suppliers(id)
name                text
description         text nullable
sku                 text nullable
image_url           text nullable
purchase_price      integer
selling_price       integer
stock               integer
minimum_stock       integer default 0
consignment_rate    integer nullable
status              text
created_at          timestamp
updated_at          timestamp
```

Value `status`:

```txt
active
inactive
out_of_stock
```

Keterangan:

- `purchase_price` adalah harga modal atau harga dari supplier.
- `selling_price` adalah harga jual di toko.
- `consignment_rate` opsional jika sistem bagi hasil menggunakan persentase.
- `stock` tidak boleh negatif.
- `selling_price` tidak boleh lebih kecil dari `purchase_price`.

---

### 9.6 Tabel `stock_movements`

Mencatat perubahan stok produk.

Field:

```txt
id              uuid primary key
store_id        uuid references stores(id)
product_id      uuid references products(id)
type            text
quantity        integer
previous_stock  integer
current_stock   integer
notes           text nullable
created_by      uuid references users(id)
created_at      timestamp
```

Value `type`:

```txt
in
out
adjustment
sale
return
```

Keterangan:

- Setiap perubahan stok harus dicatat.
- Ketika ada transaksi penjualan, stok berkurang dan otomatis membuat `stock_movements` dengan type `sale`.
- Ketika transaksi dibatalkan, stok dikembalikan dan membuat `stock_movements` dengan type `return`.

---

### 9.7 Tabel `transactions`

Menyimpan transaksi penjualan.

Field:

```txt
id              uuid primary key
store_id        uuid references stores(id)
invoice_number  text unique
customer_name   text nullable
total_amount    integer
paid_amount     integer
change_amount   integer
payment_method  text
status          text
created_by      uuid references users(id)
created_at      timestamp
updated_at      timestamp
```

Value `payment_method`:

```txt
cash
transfer
qris
other
```

Value `status`:

```txt
completed
cancelled
refunded
```

Keterangan:

- `invoice_number` harus unik.
- `total_amount` dihitung backend.
- `change_amount` dihitung backend.
- Frontend tidak boleh menentukan total transaksi secara final.

---

### 9.8 Tabel `transaction_items`

Menyimpan detail produk dalam transaksi.

Field:

```txt
id              uuid primary key
transaction_id  uuid references transactions(id)
product_id      uuid references products(id)
supplier_id     uuid references suppliers(id)
quantity        integer
unit_price      integer
subtotal        integer
created_at      timestamp
```

Keterangan:

- Satu transaksi bisa memiliki banyak item.
- Setiap item menyimpan `supplier_id` agar laporan supplier lebih mudah dibuat.
- `unit_price` diambil dari `products.selling_price`.
- `subtotal` dihitung dari `quantity * unit_price`.

---

## 10. Drizzle ORM Requirement

Backend wajib menggunakan Drizzle ORM.

File yang harus dibuat:

```txt
src/db/index.ts
src/db/schema.ts
src/db/relations.ts
drizzle.config.ts
```

---

### 10.1 `src/db/index.ts`

Fungsi:

1. Membuat koneksi database.
2. Export object `db`.
3. Digunakan oleh semua API route.
4. Menggunakan `DATABASE_URL` dari environment variable.

---

### 10.2 `src/db/schema.ts`

Fungsi:

1. Mendefinisikan semua tabel.
2. Mendefinisikan tipe field.
3. Mendefinisikan primary key dan foreign key.
4. Export semua schema tabel.

Tabel yang wajib ada:

```txt
users
stores
storeMembers
suppliers
products
stockMovements
transactions
transactionItems
```

---

### 10.3 `src/db/relations.ts`

Fungsi:

1. Mendefinisikan relasi antar tabel.
2. Memudahkan query relasional.
3. Menjaga struktur project agar rapi.

Relasi utama:

```txt
users → stores
users → store_members
stores → store_members
stores → suppliers
stores → products
stores → transactions
stores → stock_movements
suppliers → products
products → stock_movements
transactions → transaction_items
products → transaction_items
suppliers → transaction_items
```

---

### 10.4 `drizzle.config.ts`

Fungsi:

1. Mengatur lokasi schema Drizzle.
2. Mengatur output migration.
3. Menggunakan dialect PostgreSQL.
4. Mengambil koneksi database dari `.env`.

---

## 11. API Response Format

Semua API wajib menggunakan format response yang konsisten.

---

### 11.1 Success Response

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

---

### 11.2 Error Response

```json
{
  "success": false,
  "message": "Data tidak ditemukan",
  "error": "NOT_FOUND"
}
```

---

### 11.3 Pagination Response

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 12. Error Code

Gunakan error code konsisten:

```txt
BAD_REQUEST
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
INTERNAL_SERVER_ERROR
INSUFFICIENT_STOCK
INVALID_ROLE
DUPLICATE_DATA
INVALID_PAYMENT
INVALID_FILE_TYPE
FILE_TOO_LARGE
```

Contoh error:

```json
{
  "success": false,
  "message": "Stok produk tidak mencukupi",
  "error": "INSUFFICIENT_STOCK"
}
```

---

## 13. Helper Library Requirement

### 13.1 `src/lib/response.ts`

Buat helper untuk response sukses dan error.

Fungsi minimal:

```txt
successResponse()
errorResponse()
paginatedResponse()
```

Tujuan:

1. Agar semua API memiliki format response yang sama.
2. Mengurangi duplikasi kode.
3. Membuat API lebih mudah dites.

---

### 13.2 `src/lib/auth.ts`

Buat helper auth.

Fungsi minimal:

```txt
getCurrentUser()
requireAuth()
requireStoreAccess()
requireStoreRole()
```

Untuk development awal:

```txt
x-user-id: uuid-user
```

Untuk integrasi Clerk nanti:

```txt
clerkId → users.clerk_id → users.id
```

---

### 13.3 `src/lib/supabase.ts`

Buat konfigurasi Supabase Storage.

Fungsi minimal:

```txt
createSupabaseAdminClient()
uploadFileToStorage()
getPublicFileUrl()
```

---

### 13.4 `src/lib/validation.ts`

Buat helper validasi umum.

Validasi umum:

1. UUID valid.
2. Email valid.
3. Harga tidak negatif.
4. Stok tidak negatif.
5. Role valid.
6. Status valid.

---

## 14. API Endpoint Requirement

---

## 14.1 Health Check API

### `GET /api/health`

Fungsi:

Mengecek apakah backend berjalan.

Response:

```json
{
  "success": true,
  "message": "KonsinyasiKu Backend API is running",
  "data": {
    "status": "ok"
  }
}
```

---

## 15. User API

---

### 15.1 Create or Sync User

### `POST /api/users/sync`

Fungsi:

Menyimpan atau menyinkronkan user dari Clerk ke database lokal.

Request body:

```json
{
  "clerkId": "user_xxx",
  "name": "Twizz",
  "email": "twizz@example.com",
  "avatarUrl": "https://example.com/avatar.png"
}
```

Business rule:

1. Jika `clerkId` sudah ada, update data user.
2. Jika email sudah ada, update data user.
3. Jika user belum ada, buat user baru.
4. Email wajib valid.

Response:

```json
{
  "success": true,
  "message": "User berhasil disinkronkan",
  "data": {
    "id": "uuid",
    "clerkId": "user_xxx",
    "name": "Twizz",
    "email": "twizz@example.com"
  }
}
```

---

## 16. Store API

---

### 16.1 Get Stores

### `GET /api/stores`

Fungsi:

Mengambil daftar toko milik user atau toko tempat user tergabung.

Header:

```txt
x-user-id: uuid-user
```

Query optional:

```txt
?page=1&limit=10
```

Business rule:

1. User hanya dapat melihat toko tempat ia menjadi member.
2. Data toko yang dikembalikan mengikuti `store_members`.

Response:

```json
{
  "success": true,
  "message": "Daftar toko berhasil diambil",
  "data": []
}
```

---

### 16.2 Create Store

### `POST /api/stores`

Fungsi:

Membuat toko baru.

Header:

```txt
x-user-id: uuid-user
```

Request body:

```json
{
  "name": "Toko Barokah",
  "description": "Toko konsinyasi makanan ringan",
  "address": "Semarang",
  "phone": "08123456789"
}
```

Business rule:

1. User yang membuat toko otomatis menjadi owner.
2. Data toko masuk ke tabel `stores`.
3. Data membership masuk ke tabel `store_members` dengan role `owner`.
4. Status membership otomatis `active`.
5. Nama toko wajib diisi.

Response:

```json
{
  "success": true,
  "message": "Toko berhasil dibuat",
  "data": {
    "id": "uuid",
    "name": "Toko Barokah"
  }
}
```

---

### 16.3 Get Store Detail

### `GET /api/stores/[storeId]`

Fungsi:

Mengambil detail toko berdasarkan ID.

Business rule:

1. User hanya boleh melihat toko jika user adalah member dari toko tersebut.
2. Jika user bukan member, return `FORBIDDEN`.

---

### 16.4 Update Store

### `PATCH /api/stores/[storeId]`

Fungsi:

Mengubah data toko.

Hanya boleh dilakukan oleh:

```txt
owner
admin
```

Request body:

```json
{
  "name": "Toko Barokah Jaya",
  "description": "Toko konsinyasi makanan dan minuman",
  "address": "Semarang",
  "phone": "08123456789"
}
```

Business rule:

1. User harus memiliki role `owner` atau `admin`.
2. Field yang tidak dikirim tidak perlu diubah.
3. Update `updated_at`.

---

### 16.5 Delete Store

### `DELETE /api/stores/[storeId]`

Fungsi:

Menghapus toko.

Hanya boleh dilakukan oleh:

```txt
owner
```

Business rule:

1. Hanya owner yang boleh menghapus toko.
2. Untuk tahap awal, boleh hard delete.
3. Jika ingin lebih aman, gunakan soft delete pada pengembangan lanjut.

---

## 17. Store Member API

---

### 17.1 Get Store Members

### `GET /api/store-members?storeId=xxx`

Fungsi:

Mengambil daftar anggota toko.

Hanya boleh diakses oleh:

```txt
owner
admin
```

Business rule:

1. User harus menjadi owner atau admin toko.
2. Supplier tidak boleh melihat seluruh daftar member toko.

---

### 17.2 Add Store Member

### `POST /api/store-members`

Fungsi:

Menambahkan anggota toko.

Request body:

```json
{
  "storeId": "uuid",
  "userId": "uuid",
  "role": "admin"
}
```

Business rule:

1. Hanya owner yang boleh menambahkan member.
2. Role harus salah satu dari `owner`, `admin`, atau `supplier`.
3. Tidak boleh ada duplikasi user dalam toko yang sama.
4. Default status adalah `active`.

---

### 17.3 Update Member Role

### `PATCH /api/store-members/[memberId]`

Request body:

```json
{
  "role": "admin",
  "status": "active"
}
```

Business rule:

1. Hanya owner yang boleh update role member.
2. Owner utama tidak boleh diturunkan role-nya sembarangan.
3. Role harus valid.
4. Status harus valid.

---

### 17.4 Remove Store Member

### `DELETE /api/store-members/[memberId]`

Fungsi:

Menghapus member dari toko.

Business rule:

1. Owner tidak boleh dihapus kecuali toko dihapus.
2. Admin tidak boleh menghapus owner.
3. Supplier hanya bisa dihapus oleh owner/admin.
4. Hanya owner yang boleh menghapus member.

---

## 18. Supplier API

---

### 18.1 Get Suppliers

### `GET /api/suppliers?storeId=xxx`

Fungsi:

Mengambil daftar supplier pada toko tertentu.

Query optional:

```txt
?storeId=xxx&page=1&limit=10&search=nama
```

Business rule:

1. Owner dan admin bisa melihat semua supplier.
2. Supplier hanya bisa melihat data supplier miliknya sendiri jika terhubung dengan user.

---

### 18.2 Create Supplier

### `POST /api/suppliers`

Request body:

```json
{
  "storeId": "uuid",
  "name": "Supplier Snack Jaya",
  "phone": "08123456789",
  "email": "supplier@example.com",
  "address": "Semarang",
  "notes": "Supplier makanan ringan"
}
```

Business rule:

1. Supplier wajib terhubung ke satu toko.
2. Supplier boleh punya akun user, tetapi tidak wajib.
3. Supplier dapat dibuat secara manual oleh owner/admin.
4. Nama supplier wajib diisi.
5. Email jika diisi harus valid.

---

### 18.3 Get Supplier Detail

### `GET /api/suppliers/[supplierId]`

Fungsi:

Mengambil detail supplier.

Business rule:

1. Owner dan admin bisa melihat detail supplier.
2. Supplier hanya bisa melihat datanya sendiri.

---

### 18.4 Update Supplier

### `PATCH /api/suppliers/[supplierId]`

Request body:

```json
{
  "name": "Supplier Snack Makmur",
  "phone": "08123456789",
  "email": "supplier@example.com",
  "address": "Semarang",
  "notes": "Supplier aktif"
}
```

Business rule:

1. Hanya owner/admin yang boleh mengubah supplier.
2. Field yang tidak dikirim tidak perlu diubah.
3. Update `updated_at`.

---

### 18.5 Delete Supplier

### `DELETE /api/suppliers/[supplierId]`

Business rule:

1. Supplier tidak boleh dihapus jika masih memiliki produk aktif.
2. Jika ingin tetap menghapus, gunakan status inactive pada tahap lanjut.
3. Untuk MVP, return error jika supplier masih punya produk.

---

## 19. Product API

---

### 19.1 Get Products

### `GET /api/products?storeId=xxx`

Fungsi:

Mengambil daftar produk dalam toko.

Query optional:

```txt
?storeId=xxx&page=1&limit=10&search=nama&supplierId=xxx&status=active
```

Business rule:

1. Owner dan admin bisa melihat semua produk dalam toko.
2. Supplier hanya bisa melihat produk miliknya sendiri.
3. Produk bisa difilter berdasarkan supplier dan status.

Response:

```json
{
  "success": true,
  "message": "Daftar produk berhasil diambil",
  "data": []
}
```

---

### 19.2 Create Product

### `POST /api/products`

Request body:

```json
{
  "storeId": "uuid",
  "supplierId": "uuid",
  "name": "Keripik Pisang",
  "description": "Keripik pisang rasa original",
  "sku": "KP-001",
  "imageUrl": "https://storage.supabase.co/product.png",
  "purchasePrice": 7000,
  "sellingPrice": 10000,
  "stock": 50,
  "minimumStock": 5,
  "consignmentRate": 20
}
```

Business rule:

1. Produk wajib memiliki `storeId`.
2. Produk wajib memiliki `supplierId`.
3. Nama produk wajib diisi.
4. Harga jual tidak boleh lebih kecil dari harga modal.
5. Stok awal tidak boleh negatif.
6. Minimum stock tidak boleh negatif.
7. Saat produk dibuat dengan stok awal, buat juga record di `stock_movements` dengan type `in`.
8. Hanya owner/admin yang boleh membuat produk.

---

### 19.3 Get Product Detail

### `GET /api/products/[productId]`

Fungsi:

Mengambil detail produk.

Business rule:

1. Owner dan admin bisa melihat semua produk.
2. Supplier hanya bisa melihat produk miliknya sendiri.
3. Jika produk tidak ditemukan, return `NOT_FOUND`.

---

### 19.4 Update Product

### `PATCH /api/products/[productId]`

Request body:

```json
{
  "name": "Keripik Pisang Coklat",
  "description": "Keripik pisang rasa coklat",
  "sellingPrice": 12000,
  "minimumStock": 10,
  "status": "active"
}
```

Business rule:

1. Hanya owner/admin yang boleh update produk.
2. Harga jual tidak boleh lebih kecil dari harga modal.
3. Stock tidak diubah dari endpoint ini.
4. Perubahan stock harus melalui stock movement.

---

### 19.5 Delete Product

### `DELETE /api/products/[productId]`

Business rule:

1. Produk tidak langsung dihapus permanen.
2. Untuk tahap awal, ubah status menjadi `inactive`.
3. Produk yang sudah pernah masuk transaksi tidak boleh hard delete.
4. Hanya owner/admin yang boleh delete produk.

---

## 20. Stock Movement API

---

### 20.1 Get Stock Movements

### `GET /api/stock-movements?storeId=xxx`

Query optional:

```txt
?storeId=xxx&productId=xxx&type=in&page=1&limit=10
```

Fungsi:

Mengambil riwayat perubahan stok.

Business rule:

1. Owner/admin bisa melihat semua histori stok dalam toko.
2. Supplier hanya bisa melihat histori stok produk miliknya.

---

### 20.2 Create Stock Movement

### `POST /api/stock-movements`

Fungsi:

Menambahkan atau mengurangi stok secara manual.

Request body untuk stok masuk:

```json
{
  "storeId": "uuid",
  "productId": "uuid",
  "type": "in",
  "quantity": 20,
  "notes": "Restock dari supplier"
}
```

Request body untuk stok keluar:

```json
{
  "storeId": "uuid",
  "productId": "uuid",
  "type": "out",
  "quantity": 5,
  "notes": "Barang rusak"
}
```

Request body untuk adjustment:

```json
{
  "storeId": "uuid",
  "productId": "uuid",
  "type": "adjustment",
  "quantity": 45,
  "notes": "Penyesuaian stok fisik"
}
```

Business rule:

1. Type `in` akan menambah stok.
2. Type `out` akan mengurangi stok.
3. Type `adjustment` akan mengubah stok menjadi quantity yang dikirim.
4. Stok tidak boleh menjadi negatif.
5. Setiap perubahan stok harus membuat record di `stock_movements`.
6. Hanya owner/admin yang boleh membuat stock movement manual.
7. Type `sale` hanya dibuat otomatis oleh transaksi.
8. Type `return` hanya dibuat otomatis oleh pembatalan transaksi.

---

## 21. Transaction API

---

### 21.1 Get Transactions

### `GET /api/transactions?storeId=xxx`

Query optional:

```txt
?storeId=xxx&page=1&limit=10&startDate=2026-01-01&endDate=2026-01-31
```

Fungsi:

Mengambil daftar transaksi toko.

Business rule:

1. Owner/admin bisa melihat semua transaksi toko.
2. Supplier hanya bisa melihat transaksi yang mengandung produk miliknya jika dibutuhkan pada tahap lanjut.
3. Filter tanggal bersifat optional.

---

### 21.2 Create Transaction

### `POST /api/transactions`

Request body:

```json
{
  "storeId": "uuid",
  "customerName": "Pembeli Umum",
  "paymentMethod": "cash",
  "paidAmount": 50000,
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    },
    {
      "productId": "uuid",
      "quantity": 1
    }
  ]
}
```

Business rule:

1. Backend mengambil harga produk dari database, bukan dari frontend.
2. Backend menghitung subtotal setiap item.
3. Backend menghitung total transaksi.
4. Backend menghitung kembalian.
5. Jika `paidAmount` kurang dari total, transaksi ditolak.
6. Stok produk harus cukup.
7. Jika stok produk tidak cukup, transaksi ditolak.
8. Setelah transaksi berhasil:
   - Insert ke tabel `transactions`.
   - Insert ke tabel `transaction_items`.
   - Kurangi stok produk.
   - Buat record `stock_movements` dengan type `sale`.
9. Gunakan database transaction agar data aman.
10. Hanya owner/admin yang boleh membuat transaksi.

Response:

```json
{
  "success": true,
  "message": "Transaksi berhasil dibuat",
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-20260519-0001",
    "totalAmount": 30000,
    "paidAmount": 50000,
    "changeAmount": 20000
  }
}
```

---

### 21.3 Get Transaction Detail

### `GET /api/transactions/[transactionId]`

Fungsi:

Mengambil detail transaksi beserta item produk.

Business rule:

1. Owner/admin dapat melihat detail transaksi.
2. Supplier hanya bisa melihat transaksi yang mengandung produknya jika fitur ini diaktifkan.

---

### 21.4 Cancel Transaction

### `PATCH /api/transactions/[transactionId]/cancel`

Fungsi:

Membatalkan transaksi.

Business rule:

1. Hanya transaksi dengan status `completed` yang bisa dibatalkan.
2. Status transaksi berubah menjadi `cancelled`.
3. Stok produk dikembalikan.
4. Buat record `stock_movements` dengan type `return`.
5. Gunakan database transaction.
6. Hanya owner/admin yang boleh membatalkan transaksi.

---

## 22. Upload API

---

### 22.1 Upload Product Image

### `POST /api/upload`

Fungsi:

Mengupload gambar ke Supabase Storage.

Request:

```txt
multipart/form-data
file: image
folder: products
```

Validasi:

1. File wajib berupa gambar.
2. Format yang diizinkan:
   - jpg
   - jpeg
   - png
   - webp
3. Ukuran maksimal file: 2 MB.
4. Nama file dibuat unik menggunakan UUID atau timestamp.
5. Hanya owner/admin yang boleh upload gambar produk.

Response:

```json
{
  "success": true,
  "message": "File berhasil diupload",
  "data": {
    "url": "https://supabase.co/storage/..."
  }
}
```

Business rule:

1. File diupload ke bucket Supabase Storage.
2. API mengembalikan public URL.
3. URL gambar nantinya disimpan di `products.image_url`.

---

## 23. Report API

---

### 23.1 Sales Report

### `GET /api/reports/sales?storeId=xxx`

Query optional:

```txt
?storeId=xxx&startDate=2026-01-01&endDate=2026-01-31
```

Fungsi:

Mengambil laporan penjualan toko.

Data yang dikembalikan:

```json
{
  "totalSales": 1000000,
  "totalTransactions": 50,
  "totalItemsSold": 200,
  "averageTransaction": 20000
}
```

Business rule:

1. Hanya owner/admin yang boleh melihat laporan penjualan toko.
2. Data dihitung dari transaksi dengan status `completed`.
3. Transaksi cancelled tidak dihitung.

---

### 23.2 Stock Report

### `GET /api/reports/stock?storeId=xxx`

Fungsi:

Mengambil laporan stok produk.

Data yang dikembalikan:

```json
{
  "totalProducts": 100,
  "lowStockProducts": 10,
  "outOfStockProducts": 5
}
```

Business rule:

1. Hanya owner/admin yang boleh melihat laporan stok keseluruhan.
2. Produk inactive bisa dikecualikan dari perhitungan.
3. Low stock dihitung jika `stock <= minimum_stock`.

---

### 23.3 Supplier Report

### `GET /api/reports/supplier?storeId=xxx&supplierId=xxx`

Fungsi:

Mengambil laporan penjualan berdasarkan supplier.

Data yang dikembalikan:

```json
{
  "supplierId": "uuid",
  "supplierName": "Supplier Snack Jaya",
  "totalProductsSold": 120,
  "totalRevenue": 1200000,
  "estimatedSupplierIncome": 900000,
  "estimatedStoreProfit": 300000
}
```

Business rule:

1. Owner/admin bisa melihat laporan semua supplier.
2. Supplier hanya bisa melihat laporan miliknya sendiri.
3. Data dihitung dari `transaction_items`.
4. Transaksi cancelled tidak dihitung.
5. Estimasi pendapatan supplier dihitung dari purchase price atau aturan konsinyasi.

---

## 24. Authentication Requirement

Auth menggunakan Clerk secara optional, tergantung frontend.

---

### 24.1 Jika Clerk Digunakan

Backend harus:

1. Membaca user dari Clerk.
2. Mengambil `clerkId`.
3. Mencocokkan `clerkId` dengan tabel `users`.
4. Menolak request jika user belum login.
5. Mengecek role user pada tabel `store_members`.

---

### 24.2 Jika Clerk Belum Digunakan

Untuk development awal, buat helper auth sementara:

```txt
x-user-id: uuid-user
```

Backend membaca user dari header `x-user-id`.

Ini berguna agar API tetap bisa dites menggunakan Postman atau Thunder Client sebelum frontend auth selesai.

---

## 25. Authorization Requirement

Buat helper:

```txt
requireAuth()
requireStoreAccess(storeId)
requireStoreRole(storeId, allowedRoles)
```

Contoh role check:

```txt
requireStoreRole(storeId, ["owner", "admin"])
```

Aturan akses:

| Fitur | Owner | Admin | Supplier |
|---|---:|---:|---:|
| Buat toko | Ya | Tidak | Tidak |
| Edit toko | Ya | Ya | Tidak |
| Hapus toko | Ya | Tidak | Tidak |
| Tambah member | Ya | Tidak | Tidak |
| Lihat member | Ya | Ya | Tidak |
| Tambah supplier | Ya | Ya | Tidak |
| Edit supplier | Ya | Ya | Tidak |
| Hapus supplier | Ya | Ya | Tidak |
| Tambah produk | Ya | Ya | Tidak |
| Edit produk | Ya | Ya | Tidak |
| Hapus produk | Ya | Ya | Tidak |
| Lihat produk sendiri | Ya | Ya | Ya |
| Buat stok manual | Ya | Ya | Tidak |
| Buat transaksi | Ya | Ya | Tidak |
| Cancel transaksi | Ya | Ya | Tidak |
| Lihat laporan toko | Ya | Ya | Tidak |
| Lihat laporan supplier sendiri | Ya | Ya | Ya |

---

## 26. Validation Requirement

Gunakan validasi request body menggunakan Zod.

Validasi wajib:

1. Email harus valid.
2. Harga tidak boleh negatif.
3. Stok tidak boleh negatif.
4. Nama toko wajib diisi.
5. Nama produk wajib diisi.
6. Produk wajib punya supplier.
7. Transaksi wajib punya minimal 1 item.
8. Quantity transaksi minimal 1.
9. Payment method harus valid.
10. Role harus valid.
11. Status harus valid.
12. UUID harus valid.
13. File upload harus gambar.
14. Ukuran file maksimal 2 MB.

---

## 27. Business Logic Penting

---

### 27.1 Multi Store

1. Satu user bisa punya banyak toko.
2. Satu user bisa menjadi admin di toko lain.
3. Satu user bisa menjadi supplier di toko lain.
4. Data produk, transaksi, supplier, dan stok wajib selalu terkait dengan `storeId`.
5. Semua request yang membawa `storeId` harus dicek aksesnya.

---

### 27.2 Produk Konsinyasi

1. Produk wajib punya supplier.
2. Produk bisa dimiliki supplier yang berbeda dalam satu toko.
3. Laporan supplier dihitung dari produk yang terjual.
4. Pendapatan supplier dapat dihitung dari harga modal atau persentase konsinyasi.
5. Produk yang sudah pernah masuk transaksi tidak boleh dihapus permanen.

---

### 27.3 Stok

1. Stok hanya boleh berubah melalui:
   - create product dengan stok awal
   - stock movement manual
   - transaksi
   - cancel transaksi
2. Semua perubahan stok harus masuk ke `stock_movements`.
3. Stok tidak boleh negatif.
4. Stok produk harus dicek sebelum transaksi dibuat.

---

### 27.4 Transaksi

1. Harga produk diambil dari database.
2. Frontend tidak boleh menentukan harga transaksi secara langsung.
3. Stok harus dicek sebelum transaksi dibuat.
4. Jika stok tidak cukup, transaksi gagal.
5. Setelah transaksi sukses, stok otomatis berkurang.
6. Semua perubahan stok harus tercatat.
7. Gunakan database transaction agar data konsisten.

---

### 27.5 Upload Gambar

1. File diupload ke Supabase Storage.
2. URL file disimpan di tabel `products.image_url`.
3. Hanya owner/admin yang boleh upload gambar produk.
4. File harus berupa gambar.
5. File maksimal 2 MB.

---

## 28. Development Phase

---

### Phase 1 — Setup Backend Dasar

Target:

1. Setup Next.js.
2. Setup TypeScript.
3. Setup Drizzle ORM.
4. Setup koneksi Supabase PostgreSQL.
5. Setup schema database.
6. Setup migration.
7. Setup health check endpoint.

Output:

```txt
GET /api/health berhasil berjalan.
Database berhasil terkoneksi.
Schema Drizzle berhasil dibuat.
```

---

### Phase 2 — Store & User Management

Target:

1. Membuat tabel users.
2. Membuat tabel stores.
3. Membuat tabel store_members.
4. Membuat endpoint create store.
5. Membuat endpoint get stores.
6. Membuat sistem role sederhana.

Output:

```txt
User dapat membuat toko.
User otomatis menjadi owner toko.
User dapat melihat daftar toko miliknya.
```

---

### Phase 3 — Supplier & Product Management

Target:

1. Membuat tabel suppliers.
2. Membuat tabel products.
3. Membuat CRUD supplier.
4. Membuat CRUD product.
5. Membuat upload gambar produk.
6. Membuat integrasi Supabase Storage.

Output:

```txt
Owner/admin dapat menambahkan supplier.
Owner/admin dapat menambahkan produk.
Produk dapat memiliki gambar.
```

---

### Phase 4 — Stock Management

Target:

1. Membuat tabel stock_movements.
2. Membuat endpoint stok masuk.
3. Membuat endpoint stok keluar.
4. Membuat endpoint adjustment stok.
5. Membuat histori stok.

Output:

```txt
Stok produk dapat bertambah/berkurang.
Semua perubahan stok tercatat.
```

---

### Phase 5 — Transaction Management

Target:

1. Membuat tabel transactions.
2. Membuat tabel transaction_items.
3. Membuat endpoint create transaction.
4. Mengurangi stok otomatis saat transaksi.
5. Membuat invoice number otomatis.
6. Membuat detail transaksi.
7. Membuat cancel transaksi.

Output:

```txt
Transaksi berhasil dibuat.
Stok otomatis berkurang.
Riwayat transaksi tersimpan.
Transaksi dapat dibatalkan dan stok dikembalikan.
```

---

### Phase 6 — Report

Target:

1. Laporan penjualan.
2. Laporan stok.
3. Laporan supplier.
4. Filter berdasarkan tanggal.

Output:

```txt
Owner/admin dapat melihat laporan toko.
Supplier dapat melihat laporan produk miliknya.
```

---

### Phase 7 — Clerk Auth Integration

Target:

1. Integrasi Clerk di backend.
2. Sinkronisasi Clerk user ke tabel users.
3. Mengganti auth development `x-user-id` menjadi Clerk session.
4. Tetap mempertahankan helper auth agar mudah dikelola.

Output:

```txt
User login dari Clerk dapat dikenali backend.
Role user tetap dicek melalui store_members.
```

---

## 29. Acceptance Criteria

Backend dianggap selesai untuk MVP jika:

1. API health check berjalan.
2. Database Supabase berhasil terkoneksi.
3. Drizzle schema berhasil dibuat.
4. Migration berhasil dijalankan.
5. User dapat dibuat atau disinkronkan.
6. User dapat membuat toko.
7. User otomatis menjadi owner toko.
8. User dapat melihat toko miliknya.
9. Owner dapat menambahkan admin atau supplier.
10. Owner/admin dapat membuat supplier.
11. Owner/admin dapat membuat produk.
12. Produk dapat memiliki gambar dari Supabase Storage.
13. Owner/admin dapat menambah dan mengurangi stok.
14. Semua perubahan stok tercatat di `stock_movements`.
15. Owner/admin dapat membuat transaksi.
16. Transaksi otomatis mengurangi stok.
17. Transaksi dapat dibatalkan.
18. Cancel transaksi otomatis mengembalikan stok.
19. Laporan penjualan dapat ditampilkan.
20. Laporan stok dapat ditampilkan.
21. Laporan supplier dapat ditampilkan.
22. API response konsisten.
23. Error handling berjalan dengan baik.
24. Role access berjalan sesuai aturan.
25. API dapat digunakan oleh mobile app.

---

## 30. Checklist Progress Backend

```txt
[ ] Setup Next.js backend
[ ] Setup TypeScript
[ ] Setup Supabase PostgreSQL
[ ] Setup Drizzle ORM
[ ] Setup drizzle.config.ts
[ ] Setup src/db/index.ts
[ ] Setup src/db/schema.ts
[ ] Setup src/db/relations.ts
[ ] Setup migration Drizzle
[ ] Setup helper response
[ ] Setup helper auth x-user-id
[ ] Setup helper Supabase Storage
[ ] Setup helper validation
[ ] Buat endpoint health check
[ ] Buat endpoint users sync
[ ] Buat endpoint stores
[ ] Buat endpoint store members
[ ] Buat endpoint suppliers
[ ] Buat endpoint products
[ ] Buat endpoint stock movements
[ ] Buat endpoint transactions
[ ] Buat endpoint cancel transaction
[ ] Buat endpoint upload image
[ ] Buat endpoint sales report
[ ] Buat endpoint stock report
[ ] Buat endpoint supplier report
[ ] Testing API menggunakan Postman/Thunder Client
[ ] Integrasi ke mobile app
[ ] Integrasi Clerk auth
```

---

## 31. Prompt Utama untuk Vibe Coding

Gunakan prompt ini untuk membuat backend secara lengkap:

```txt
Buatkan backend REST API untuk aplikasi mobile KonsinyasiKu menggunakan Next.js API Route, TypeScript, Supabase PostgreSQL, Drizzle ORM, dan Supabase Storage.

Project ini adalah aplikasi mobile untuk pengelolaan konsinyasi antara owner toko, admin toko, dan supplier.

Backend harus mendukung:
1. Multi-store
2. Multi-role
3. Produk konsinyasi
4. Manajemen stok
5. Transaksi penjualan
6. Laporan penjualan
7. Laporan stok
8. Laporan supplier
9. Upload gambar produk

Gunakan struktur folder:
- src/app/api untuk semua endpoint
- src/db/index.ts untuk koneksi database
- src/db/schema.ts untuk schema Drizzle
- src/db/relations.ts untuk relasi tabel
- src/lib/auth.ts untuk helper authentication
- src/lib/response.ts untuk helper response JSON
- src/lib/supabase.ts untuk konfigurasi Supabase Storage
- src/lib/validation.ts untuk validasi umum
- drizzle.config.ts untuk konfigurasi Drizzle

Gunakan tabel:
- users
- stores
- store_members
- suppliers
- products
- stock_movements
- transactions
- transaction_items

Gunakan role:
- owner
- admin
- supplier

Gunakan status:
- active
- inactive
- pending
- completed
- cancelled
- refunded
- out_of_stock

Buat API endpoint:
- GET /api/health
- POST /api/users/sync
- GET /api/stores
- POST /api/stores
- GET /api/stores/[storeId]
- PATCH /api/stores/[storeId]
- DELETE /api/stores/[storeId]
- GET /api/store-members
- POST /api/store-members
- PATCH /api/store-members/[memberId]
- DELETE /api/store-members/[memberId]
- GET /api/suppliers
- POST /api/suppliers
- GET /api/suppliers/[supplierId]
- PATCH /api/suppliers/[supplierId]
- DELETE /api/suppliers/[supplierId]
- GET /api/products
- POST /api/products
- GET /api/products/[productId]
- PATCH /api/products/[productId]
- DELETE /api/products/[productId]
- GET /api/stock-movements
- POST /api/stock-movements
- GET /api/transactions
- POST /api/transactions
- GET /api/transactions/[transactionId]
- PATCH /api/transactions/[transactionId]/cancel
- POST /api/upload
- GET /api/reports/sales
- GET /api/reports/stock
- GET /api/reports/supplier

Gunakan response format konsisten:
{
  "success": true,
  "message": "message",
  "data": {}
}

Untuk error:
{
  "success": false,
  "message": "message",
  "error": "ERROR_CODE"
}

Gunakan Zod untuk validasi request body.

Untuk auth development awal, gunakan x-user-id dari headers.
Nanti siapkan helper agar mudah diganti ke Clerk.

Business rule penting:
1. User yang membuat toko otomatis menjadi owner.
2. Semua produk wajib terkait dengan storeId dan supplierId.
3. Produk tidak boleh punya stok negatif.
4. Harga jual tidak boleh lebih kecil dari harga modal.
5. Setiap perubahan stok wajib masuk ke stock_movements.
6. Saat transaksi dibuat, backend mengambil harga produk dari database.
7. Jika stok tidak cukup, transaksi harus gagal.
8. Jika transaksi berhasil, stok produk otomatis berkurang.
9. Gunakan database transaction untuk create transaction agar data aman.
10. Supplier hanya boleh melihat produk dan laporan miliknya.
11. Owner dan admin boleh mengelola produk, stok, supplier, dan transaksi.
12. Hanya owner yang boleh menghapus toko dan mengelola member.
13. Upload gambar menggunakan Supabase Storage.
14. File upload hanya menerima jpg, jpeg, png, webp maksimal 2MB.
15. Semua endpoint harus menggunakan helper response yang konsisten.

Buatkan kode secara bertahap mulai dari:
1. Setup Drizzle
2. Schema database
3. Helper response
4. Helper auth
5. Helper Supabase Storage
6. Endpoint health check
7. Endpoint users sync
8. Endpoint stores
9. Endpoint store members
10. Endpoint suppliers
11. Endpoint products
12. Endpoint stock movements
13. Endpoint transactions
14. Endpoint upload
15. Endpoint reports
```

---

## 32. Prompt Implementasi Bertahap

Jika AI coding error karena prompt terlalu panjang, gunakan prompt bertahap berikut.

---

### Prompt 1 — Setup Project dan Drizzle

```txt
Buat setup awal backend KonsinyasiKu menggunakan Next.js App Router API, TypeScript, Supabase PostgreSQL, dan Drizzle ORM.

Buat file:
- drizzle.config.ts
- src/db/index.ts
- src/db/schema.ts
- src/db/relations.ts
- src/lib/response.ts
- src/app/api/health/route.ts

Buat schema Drizzle untuk tabel:
- users
- stores
- store_members
- suppliers
- products
- stock_movements
- transactions
- transaction_items

Gunakan UUID primary key, timestamp created_at dan updated_at, serta foreign key yang sesuai.

Gunakan response format:
{
  "success": true,
  "message": "message",
  "data": {}
}

Untuk error:
{
  "success": false,
  "message": "message",
  "error": "ERROR_CODE"
}
```

---

### Prompt 2 — Auth Helper Development

```txt
Lanjutkan backend KonsinyasiKu dengan membuat helper auth development.

Buat file:
- src/lib/auth.ts

Untuk development awal, gunakan x-user-id dari headers.

Buat fungsi:
- getCurrentUser()
- requireAuth()
- requireStoreAccess(storeId)
- requireStoreRole(storeId, allowedRoles)

Auth ini nanti harus mudah diganti ke Clerk.
Role dicek dari tabel store_members.
```

---

### Prompt 3 — Store API

```txt
Lanjutkan backend KonsinyasiKu dengan membuat API stores.

Buat endpoint:
- GET /api/stores
- POST /api/stores
- GET /api/stores/[storeId]
- PATCH /api/stores/[storeId]
- DELETE /api/stores/[storeId]

Gunakan Drizzle ORM.
Gunakan x-user-id dari headers sebagai auth development.
Saat user membuat toko, otomatis buat store_members dengan role owner.
Hanya owner yang boleh delete store.
Owner dan admin boleh update store.
```

---

### Prompt 4 — Store Member API

```txt
Lanjutkan backend KonsinyasiKu dengan membuat API store members.

Buat endpoint:
- GET /api/store-members?storeId=xxx
- POST /api/store-members
- PATCH /api/store-members/[memberId]
- DELETE /api/store-members/[memberId]

Business rule:
- Hanya owner yang boleh menambah member.
- Hanya owner yang boleh mengubah role member.
- Hanya owner yang boleh menghapus member.
- Owner tidak boleh dihapus dari toko.
- Tidak boleh ada duplikasi user di toko yang sama.
```

---

### Prompt 5 — Supplier dan Product API

```txt
Lanjutkan backend KonsinyasiKu dengan membuat API suppliers dan products.

Buat endpoint CRUD suppliers:
- GET /api/suppliers
- POST /api/suppliers
- GET /api/suppliers/[supplierId]
- PATCH /api/suppliers/[supplierId]
- DELETE /api/suppliers/[supplierId]

Buat endpoint CRUD products:
- GET /api/products
- POST /api/products
- GET /api/products/[productId]
- PATCH /api/products/[productId]
- DELETE /api/products/[productId]

Business rule:
- Produk wajib memiliki storeId dan supplierId.
- Harga jual tidak boleh lebih kecil dari harga modal.
- Stok awal tidak boleh negatif.
- Saat produk dibuat dengan stok awal, buat stock_movements type in.
- Product delete tidak hard delete, ubah status menjadi inactive.
```

---

### Prompt 6 — Stock Movement API

```txt
Lanjutkan backend KonsinyasiKu dengan membuat API stock movements.

Buat endpoint:
- GET /api/stock-movements
- POST /api/stock-movements

Type stock movement:
- in
- out
- adjustment
- sale
- return

Business rule:
- in menambah stok
- out mengurangi stok
- adjustment mengubah stok sesuai quantity
- stok tidak boleh negatif
- semua perubahan stok harus tercatat
- type sale hanya untuk transaksi
- type return hanya untuk cancel transaksi
```

---

### Prompt 7 — Transaction API

```txt
Lanjutkan backend KonsinyasiKu dengan membuat API transactions.

Buat endpoint:
- GET /api/transactions
- POST /api/transactions
- GET /api/transactions/[transactionId]
- PATCH /api/transactions/[transactionId]/cancel

Business rule:
- Backend mengambil harga produk dari database.
- Cek stok sebelum transaksi.
- Jika stok tidak cukup, transaksi gagal.
- Jika paidAmount kurang dari totalAmount, transaksi gagal.
- Jika transaksi berhasil, insert transactions, transaction_items, kurangi stok produk, dan buat stock_movements type sale.
- Gunakan database transaction.
- Buat invoice number otomatis.
- Cancel transaction harus mengembalikan stok dan membuat stock_movements type return.
```

---

### Prompt 8 — Upload dan Report

```txt
Lanjutkan backend KonsinyasiKu dengan membuat upload API dan report API.

Buat:
- POST /api/upload menggunakan Supabase Storage
- GET /api/reports/sales
- GET /api/reports/stock
- GET /api/reports/supplier

Upload rule:
- Hanya menerima file jpg, jpeg, png, webp
- Maksimal 2MB
- Simpan ke bucket product-images
- Return public URL

Report sales:
- total penjualan
- jumlah transaksi
- total item terjual
- average transaction

Report stock:
- total produk
- low stock
- out of stock

Report supplier:
- total produk terjual
- total revenue
- estimasi pendapatan supplier
- estimasi profit toko
```

---

## 33. Catatan Penting untuk Vibe Code

Bagian yang paling rawan error:

1. Database transaction saat membuat transaksi.
2. Relasi Drizzle antar tabel.
3. Auth Clerk jika langsung dipasang dari awal.
4. Upload file dari mobile ke Supabase Storage.
5. Role access antara owner, admin, dan supplier.
6. Perhitungan stok saat transaksi.
7. Cancel transaksi dan pengembalian stok.
8. Report supplier dari `transaction_items`.

Saran pengerjaan:

```txt
Jangan langsung buat semua fitur sekaligus.

Mulai dari:
1. Drizzle schema
2. Health check
3. Auth helper x-user-id
4. Store API
5. Store member API
6. Supplier API
7. Product API
8. Stock API
9. Transaction API
10. Upload API
11. Report API
12. Clerk auth
```

Untuk awal development, auth lebih aman pakai:

```txt
x-user-id
```

Setelah backend stabil, baru integrasikan ke Clerk.

---

## 34. Output Akhir yang Diharapkan

Setelah backend selesai, project harus memiliki:

```txt
1. Struktur folder backend rapi
2. Drizzle schema lengkap
3. Migration database
4. API health check
5. API user sync
6. API store
7. API store member
8. API supplier
9. API product
10. API stock movement
11. API transaction
12. API upload image
13. API report
14. Helper auth
15. Helper response
16. Helper Supabase Storage
17. Validasi request menggunakan Zod
18. Error handling konsisten
19. Role access berjalan
20. Siap diintegrasikan ke mobile app
```

---

## 35. Lampiran Progress yang Bisa Discreenshot

Untuk kebutuhan laporan progress backend, lampirkan screenshot berikut:

| No | Screenshot | Keterangan |
|---|---|---|
| 1 | Struktur folder backend di VS Code | Bukti struktur project sudah dibuat |
| 2 | File `drizzle.config.ts` | Bukti konfigurasi Drizzle |
| 3 | File `src/db/schema.ts` | Bukti schema database |
| 4 | File `src/db/relations.ts` | Bukti relasi database |
| 5 | Dashboard Supabase Database | Bukti database dibuat |
| 6 | Daftar tabel Supabase | Bukti tabel tersedia |
| 7 | Endpoint `/api/health` | Bukti backend berjalan |
| 8 | Response API di Thunder Client/Postman | Bukti endpoint bisa dites |
| 9 | Bucket Supabase Storage | Bukti object storage tersedia |
| 10 | Endpoint upload image | Bukti upload file disiapkan |

---

# END OF PRD