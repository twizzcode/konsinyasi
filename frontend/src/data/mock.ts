import type { AppUser, NotificationItem, Product, Supplier, Transaction } from '@/types';

export const initialSuppliers: Supplier[] = [
  { id: 'S001', name: 'Bu Siti', phone: '0812-3456-7890', address: 'Jl. Melati No. 12', itemCount: 2, balance: 384000 },
  { id: 'S002', name: 'Pak Ahmad', phone: '0813-9876-5432', address: 'Jl. Kenanga No. 8', itemCount: 1, balance: 216000 },
  { id: 'S003', name: 'Bu Yuli', phone: '0857-2222-1111', address: 'Jl. Mawar No. 21', itemCount: 1, balance: 168000 },
  { id: 'S004', name: 'Pak Budi', phone: '0821-5566-7788', address: 'Jl. Anggrek No. 4', itemCount: 1, balance: 92000 },
];

export const initialProducts: Product[] = [
  { id: 'P001', name: 'Minyak Goreng 1L', supplierId: 'S001', supplierName: 'Bu Siti', price: 15000, supplierPrice: 12000, supplierPercent: 80, storePercent: 20, stock: 25, minStock: 10, category: 'Kebutuhan Pokok' },
  { id: 'P002', name: 'Gula Pasir 1kg', supplierId: 'S002', supplierName: 'Pak Ahmad', price: 18000, supplierPrice: 14400, supplierPercent: 80, storePercent: 20, stock: 8, minStock: 10, category: 'Kebutuhan Pokok' },
  { id: 'P003', name: 'Mie Instan', supplierId: 'S003', supplierName: 'Bu Yuli', price: 3500, supplierPrice: 2800, supplierPercent: 80, storePercent: 20, stock: 42, minStock: 15, category: 'Makanan' },
  { id: 'P004', name: 'Tepung Terigu 1kg', supplierId: 'S001', supplierName: 'Bu Siti', price: 12000, supplierPrice: 9600, supplierPercent: 80, storePercent: 20, stock: 5, minStock: 8, category: 'Kebutuhan Pokok' },
  { id: 'P005', name: 'Kopi Bubuk 200g', supplierId: 'S004', supplierName: 'Pak Budi', price: 23000, supplierPrice: 18400, supplierPercent: 80, storePercent: 20, stock: 0, minStock: 5, category: 'Minuman' },
];

export const initialTransactions: Transaction[] = [
  {
    id: 'TRX001', date: '2026-06-17', time: '10:30', status: 'Selesai',
    items: [
      { productId: 'P001', name: 'Minyak Goreng 1L', price: 15000, quantity: 2, supplierName: 'Bu Siti', supplierShare: 0.8, storeShare: 0.2 },
      { productId: 'P002', name: 'Gula Pasir 1kg', price: 18000, quantity: 1, supplierName: 'Pak Ahmad', supplierShare: 0.8, storeShare: 0.2 },
    ],
  },
  {
    id: 'TRX002', date: '2026-06-17', time: '11:15', status: 'Selesai',
    items: [{ productId: 'P003', name: 'Mie Instan', price: 3500, quantity: 6, supplierName: 'Bu Yuli', supplierShare: 0.8, storeShare: 0.2 }],
  },
  {
    id: 'TRX003', date: '2026-06-16', time: '13:45', status: 'Selesai',
    items: [{ productId: 'P004', name: 'Tepung Terigu 1kg', price: 12000, quantity: 3, supplierName: 'Bu Siti', supplierShare: 0.8, storeShare: 0.2 }],
  },
];

export const initialUsers: AppUser[] = [
  { id: 'U001', name: 'Frans', email: 'owner@konsinyasiku.id', role: 'Pemilik', active: true },
  { id: 'U002', name: 'Dina', email: 'admin@konsinyasiku.id', role: 'Admin', active: true },
  { id: 'U003', name: 'Rudi', email: 'kasir@konsinyasiku.id', role: 'Kasir', active: true },
];

export const initialNotifications: NotificationItem[] = [
  { id: 'N001', title: 'Stok hampir habis', message: 'Stok Gula Pasir 1kg tersisa 8 unit.', time: '10 menit lalu', type: 'stock', read: false },
  { id: 'N002', title: 'Transaksi berhasil', message: 'TRX001 senilai Rp48.000 telah disimpan.', time: '1 jam lalu', type: 'transaction', read: false },
  { id: 'N003', title: 'Stok habis', message: 'Kopi Bubuk 200g sudah habis.', time: 'Kemarin', type: 'stock', read: true },
  { id: 'N004', title: 'Pembaruan sistem', message: 'Aplikasi menggunakan data lokal untuk prototipe frontend.', time: '2 hari lalu', type: 'system', read: true },
];
