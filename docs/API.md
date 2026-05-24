# Dokumentasi API KonsinyasiKu Backend

Dokumen ini menjelaskan endpoint API Next.js yang tersedia di project ini, format request/response, autentikasi, storage Supabase, dan environment variable yang dibutuhkan.

## Ringkasan

- Base URL local: `http://localhost:3000`
- Base URL production: `https://konsinyasi.vercel.app`
- Prefix API Next.js: `/api`
- Contoh endpoint: `GET /api/stores`
- Storage file memakai Supabase Storage
- Database memakai PostgreSQL via `DATABASE_URL`

## Environment Variables

Gunakan file `.env.local` atau `.env` untuk development. Contoh nilai tersedia di [.env.example](/home/twizzcode/programming/konsiyasi/backend/.env.example:1).

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | Ya | Koneksi PostgreSQL untuk Drizzle dan seluruh route yang mengakses database. |
| `NEXT_PUBLIC_SUPABASE_URL` | Ya untuk upload/storage | Base URL project Supabase, format: `https://<project-ref>.supabase.co`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya untuk upload/storage | Secret key backend untuk upload ke Supabase Storage. Jangan expose ke frontend. |
| `SUPABASE_STORAGE_BUCKET` | Ya | Nama bucket storage. Default di kode: `product-images`. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Opsional saat ini | Disiapkan untuk integrasi Clerk di client. |
| `CLERK_SECRET_KEY` | Opsional saat ini | Disiapkan untuk integrasi Clerk di server. |
| `APP_ENV` | Opsional | Penanda environment, contoh `development`. |

## Next API vs Supabase

- API aplikasi ini adalah endpoint Next.js di `/api/...`
- URL API aplikasi bukan `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL` hanya untuk base URL project Supabase

Contoh:

- API app: `http://localhost:3000/api/upload`
- Supabase project URL: `https://<project-ref>.supabase.co`

## Autentikasi

Sebagian besar endpoint membutuhkan user yang sudah sinkron ke tabel `users`.

Header yang dikenali:

- `x-user-id: <uuid-user>`
- `x-clerk-id: <clerk-user-id>`

Aturan auth:

- Jika kedua header kosong, endpoint yang butuh auth akan membalas `401 UNAUTHORIZED`
- Jika user tidak punya akses ke toko terkait, endpoint akan membalas `403 FORBIDDEN`
- Role toko yang dipakai: `owner`, `admin`, `supplier`

## Format Response

### Success

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": {}
}
```

### Success dengan pagination

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Pesan error",
  "error": "VALIDATION_ERROR"
}
```

## Error Code Umum

- `BAD_REQUEST`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `INVALID_ROLE`
- `DUPLICATE_DATA`
- `INSUFFICIENT_STOCK`
- `INVALID_PAYMENT`
- `INTERNAL_SERVER_ERROR`

## Pagination

Endpoint list mendukung query berikut:

- `page`: default `1`
- `limit`: default `10`
- `limit` maksimal: `100`

## Enum yang Dipakai

- `role`: `owner`, `admin`, `supplier`
- `memberStatus`: `active`, `inactive`, `pending`
- `productStatus`: `active`, `inactive`, `out_of_stock`
- `stockMovementType`: `in`, `out`, `adjustment`, `sale`, `return`
- `paymentMethod`: `cash`, `transfer`, `qris`, `other`

## Storage Supabase

Storage dipakai oleh endpoint upload:

- Route: `POST /api/upload`
- Bucket default: `product-images`
- File yang diizinkan: `image/jpeg`, `image/png`, `image/webp`
- Maksimum ukuran file: `2 MB`
- Folder default: `products`

Flow upload:

1. Client mengirim `multipart/form-data` ke `/api/upload`
2. Server validasi auth, role toko, tipe file, dan ukuran file
3. Server upload ke Supabase Storage memakai `SUPABASE_SERVICE_ROLE_KEY`
4. Server mengembalikan `path` dan `url` public file

Public URL file dibentuk melalui `Supabase Storage getPublicUrl`, sehingga file di bucket perlu dapat diakses sesuai konfigurasi bucket atau policy.

Contoh response upload:

```json
{
  "success": true,
  "message": "File berhasil diupload",
  "data": {
    "path": "products/550e8400-e29b-41d4-a716-446655440000.webp",
    "url": "https://<project-ref>.supabase.co/storage/v1/object/public/product-images/products/550e8400-e29b-41d4-a716-446655440000.webp"
  }
}
```

## Endpoint API

### 1. Health Check

#### `GET /api/health`

- Auth: tidak perlu
- Fungsi: cek service hidup

### 2. User Sync

#### `POST /api/users/sync`

- Auth: tidak wajib
- Fungsi: membuat atau memperbarui user lokal berdasarkan email atau `clerkId`

Body:

```json
{
  "clerkId": "user_123",
  "name": "Budi",
  "email": "budi@example.com",
  "phone": "08123456789",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

Catatan:

- `name` dan `email` wajib
- `avatarUrl` harus URL valid bila diisi
- Bila user sudah ada, data akan di-update

### 3. Stores

#### `GET /api/stores`

- Auth: wajib
- Role: semua member aktif
- Query: `page`, `limit`
- Fungsi: daftar toko yang dimiliki atau diikuti user

#### `POST /api/stores`

- Auth: wajib
- Role: user login
- Fungsi: membuat toko baru dan otomatis menambahkan creator sebagai `owner`

Body:

```json
{
  "name": "Toko A",
  "description": "Toko konsinyasi pusat",
  "address": "Jl. Mawar No. 1",
  "phone": "08123456789"
}
```

#### `GET /api/stores/:storeId`

- Auth: wajib
- Role: member toko
- Fungsi: detail toko

#### `PATCH /api/stores/:storeId`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: update data toko

Body:

```json
{
  "name": "Toko A Baru",
  "description": "Deskripsi baru",
  "address": "Alamat baru",
  "phone": "08123456789",
  "logoUrl": "https://example.com/logo.png"
}
```

#### `DELETE /api/stores/:storeId`

- Auth: wajib
- Role: `owner`
- Fungsi: hapus toko

### 4. Store Members

#### `GET /api/store-members?storeId=<storeId>`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: daftar member toko beserta data user

#### `POST /api/store-members`

- Auth: wajib
- Role: `owner`
- Fungsi: menambahkan user yang sudah ada ke toko

Body:

```json
{
  "storeId": "uuid",
  "userId": "uuid",
  "role": "admin"
}
```

#### `PATCH /api/store-members/:memberId`

- Auth: wajib
- Role: `owner`
- Fungsi: ubah role atau status member

Body:

```json
{
  "role": "supplier",
  "status": "active"
}
```

Catatan:

- Owner utama toko tidak boleh diturunkan role-nya

#### `DELETE /api/store-members/:memberId`

- Auth: wajib
- Role: `owner`
- Fungsi: hapus member dari toko

Catatan:

- Owner tidak boleh dihapus dari toko

### 5. Suppliers

#### `GET /api/suppliers?storeId=<storeId>&page=1&limit=10&search=...`

- Auth: wajib
- Role: semua member aktif
- Fungsi: daftar supplier pada toko

Catatan:

- Jika role user adalah `supplier`, hasil otomatis dibatasi ke supplier miliknya sendiri

#### `POST /api/suppliers`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: membuat supplier

Body:

```json
{
  "storeId": "uuid",
  "userId": "uuid-opsional",
  "name": "Supplier A",
  "phone": "08123456789",
  "email": "supplier@example.com",
  "address": "Bandung",
  "notes": "Khusus produk frozen"
}
```

Catatan:

- Jika `userId` diisi, server juga mencoba menambahkan user tersebut sebagai `store_member` dengan role `supplier`

#### `GET /api/suppliers/:supplierId`

- Auth: wajib
- Role: member toko terkait
- Fungsi: detail supplier

Catatan:

- User dengan role `supplier` hanya boleh melihat supplier miliknya sendiri

#### `PATCH /api/suppliers/:supplierId`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: update supplier

#### `DELETE /api/suppliers/:supplierId`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: hapus supplier

Catatan:

- Supplier tidak bisa dihapus jika masih punya produk aktif

### 6. Products

#### `GET /api/products?storeId=<storeId>&page=1&limit=10&search=...&supplierId=...&status=...`

- Auth: wajib
- Role: semua member aktif
- Fungsi: daftar produk toko

Filter:

- `search`: cari nama produk
- `supplierId`: filter supplier
- `status`: `active`, `inactive`, `out_of_stock`

Catatan:

- Jika role user `supplier`, hasil otomatis dibatasi ke produk supplier miliknya

#### `POST /api/products`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: membuat produk

Body:

```json
{
  "storeId": "uuid",
  "supplierId": "uuid",
  "name": "Keripik Pisang",
  "description": "Kemasan 250 gram",
  "sku": "KP-250",
  "imageUrl": "https://example.com/product.jpg",
  "purchasePrice": 10000,
  "sellingPrice": 15000,
  "stock": 20,
  "minimumStock": 5,
  "consignmentRate": 20,
  "status": "active"
}
```

Aturan:

- `sellingPrice` tidak boleh lebih kecil dari `purchasePrice`
- Jika `stock > 0`, server otomatis membuat stock movement awal bertipe `in`

#### `GET /api/products/:productId`

- Auth: wajib
- Role: member toko terkait
- Fungsi: detail produk

Catatan:

- Role `supplier` hanya boleh melihat produk miliknya sendiri

#### `PATCH /api/products/:productId`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: update produk

Body:

```json
{
  "name": "Keripik Pisang Coklat",
  "purchasePrice": 12000,
  "sellingPrice": 17000,
  "minimumStock": 8,
  "status": "active"
}
```

#### `DELETE /api/products/:productId`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: menonaktifkan produk

Catatan:

- Saat ini route ini tidak hard-delete
- Produk akan diubah menjadi `inactive`

### 7. Stock Movements

#### `GET /api/stock-movements?storeId=<storeId>&page=1&limit=10&productId=...&type=...`

- Auth: wajib
- Role: semua member aktif
- Fungsi: riwayat perubahan stok

Filter:

- `productId`
- `type`: `in`, `out`, `adjustment`, `sale`, `return`

Catatan:

- Jika role user `supplier`, hasil dibatasi ke produk supplier miliknya

#### `POST /api/stock-movements`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: tambah stok, kurangi stok manual, atau adjustment

Body:

```json
{
  "storeId": "uuid",
  "productId": "uuid",
  "type": "in",
  "quantity": 10,
  "notes": "Restok mingguan"
}
```

Aturan:

- `type = in`: stok akhir = stok lama + quantity
- `type = out`: stok akhir = stok lama - quantity
- `type = adjustment`: stok akhir = quantity
- Jika stok akhir menjadi `0`, status produk jadi `out_of_stock`
- Jika stok akhir negatif, request gagal dengan `409 INSUFFICIENT_STOCK`

### 8. Transactions

#### `GET /api/transactions?storeId=<storeId>&page=1&limit=10&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

- Auth: wajib
- Role: semua member aktif
- Fungsi: daftar transaksi

#### `POST /api/transactions`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: membuat transaksi penjualan

Body:

```json
{
  "storeId": "uuid",
  "customerName": "Rina",
  "paymentMethod": "cash",
  "paidAmount": 50000,
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

Aturan:

- Minimal 1 item
- Produk harus aktif
- Stok produk harus cukup
- `paidAmount` tidak boleh kurang dari total transaksi
- Server otomatis membuat `invoiceNumber`
- Server otomatis menyimpan `transaction_items`
- Server otomatis mengurangi stok produk
- Server otomatis membuat `stock_movements` bertipe `sale`

#### `GET /api/transactions/:transactionId`

- Auth: wajib
- Role: member toko terkait
- Fungsi: detail transaksi beserta item

#### `PATCH /api/transactions/:transactionId/cancel`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: membatalkan transaksi completed

Aturan:

- Hanya transaksi dengan status `completed` yang bisa dibatalkan
- Server otomatis mengembalikan stok
- Server otomatis membuat `stock_movements` bertipe `return`
- Status transaksi diubah menjadi `cancelled`

### 9. Reports

#### `GET /api/reports/sales?storeId=<storeId>&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: ringkasan penjualan

Response data:

```json
{
  "totalSales": 250000,
  "totalTransactions": 15,
  "totalItemsSold": 42,
  "averageTransaction": 16667
}
```

#### `GET /api/reports/stock?storeId=<storeId>`

- Auth: wajib
- Role: `owner`, `admin`
- Fungsi: ringkasan stok aktif

Response data:

```json
{
  "totalProducts": 12,
  "lowStockProducts": 3,
  "outOfStockProducts": 1
}
```

#### `GET /api/reports/supplier?storeId=<storeId>&supplierId=<supplierId>&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

- Auth: wajib
- Role: member toko aktif
- Fungsi: laporan performa supplier

Perilaku:

- Jika `supplierId` diisi, hasil hanya untuk supplier itu
- Jika user login ber-role `supplier`, dia hanya bisa melihat laporannya sendiri

Response data ketika `supplierId` diisi:

```json
{
  "supplierId": "uuid",
  "supplierName": "Supplier A",
  "totalProductsSold": 20,
  "totalRevenue": 400000,
  "estimatedSupplierIncome": 280000,
  "estimatedStoreProfit": 120000
}
```

### 10. Upload

#### `POST /api/upload`

- Auth: wajib
- Role: `owner`, `admin`
- Content-Type: `multipart/form-data`
- Fungsi: upload gambar ke Supabase Storage

Form data:

- `storeId`: `uuid` wajib
- `file`: file gambar wajib
- `folder`: opsional, default `products`

Contoh curl:

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "x-user-id: <user-id>" \
  -F "storeId=<store-id>" \
  -F "folder=products" \
  -F "file=@/path/to/image.webp"
```

Aturan:

- Hanya menerima `jpeg`, `png`, `webp`
- Maksimum `2 MB`
- Response berisi `path` dan `url` public file

## Catatan Implementasi

- Semua route API berada di `src/app/api/**/route.ts`
- Semua response dibungkus helper `successResponse`, `paginatedResponse`, dan `errorResponse`
- Validasi request memakai Zod
- Query pagination dibatasi sampai `limit=100`
- Route database akan gagal bila `DATABASE_URL` belum diatur
