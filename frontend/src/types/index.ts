export type StockStatus = 'Aman' | 'Menipis' | 'Habis';
export type UserRole = 'Pemilik' | 'Admin' | 'Kasir';

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  itemCount: number;
  balance: number;
}

export interface Product {
  id: string;
  name: string;
  supplierId: string;
  supplierName: string;
  price: number;
  supplierPrice: number;
  supplierPercent: number;
  storePercent: number;
  stock: number;
  minStock: number;
  category: string;
  imageUri?: string;
}

export interface TransactionItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  supplierName: string;
  supplierShare: number;
  storeShare: number;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  items: TransactionItem[];
  status: 'Selesai';
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'stock' | 'transaction' | 'system';
  read: boolean;
}
