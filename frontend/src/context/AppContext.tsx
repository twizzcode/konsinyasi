import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { initialNotifications, initialProducts, initialSuppliers, initialTransactions, initialUsers } from '@/data/mock';
import type { AppUser, NotificationItem, Product, Supplier, Transaction, TransactionItem } from '@/types';
import { currentTime, todayISO } from '@/utils/format';

type ProductInput = Omit<Product, 'id' | 'supplierName'> & { supplierName?: string };
type SupplierInput = Omit<Supplier, 'id' | 'itemCount' | 'balance'>;
type UserInput = Omit<AppUser, 'id' | 'active'>;

interface AppContextValue {
  products: Product[];
  suppliers: Supplier[];
  transactions: Transaction[];
  users: AppUser[];
  notifications: NotificationItem[];
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, input: ProductInput) => void;
  addSupplier: (input: SupplierInput) => void;
  updateSupplier: (id: string, input: SupplierInput) => void;
  addTransaction: (items: TransactionItem[]) => Transaction;
  addUser: (input: UserInput) => void;
  removeUser: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(initialProducts);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [users, setUsers] = useState(initialUsers);
  const [notifications, setNotifications] = useState(initialNotifications);

  const resolveSupplierName = (supplierId: string, fallback?: string) =>
    suppliers.find((supplier) => supplier.id === supplierId)?.name ?? fallback ?? 'Tanpa nama';

  const addProduct = (input: ProductInput) => {
    const id = `P${String(products.length + 1).padStart(3, '0')}`;
    setProducts((current) => [...current, { ...input, id, supplierName: resolveSupplierName(input.supplierId, input.supplierName) }]);
  };

  const updateProduct = (id: string, input: ProductInput) => {
    setProducts((current) => current.map((product) => product.id === id
      ? { ...input, id, supplierName: resolveSupplierName(input.supplierId, input.supplierName) }
      : product));
  };

  const addSupplier = (input: SupplierInput) => {
    const id = `S${String(suppliers.length + 1).padStart(3, '0')}`;
    setSuppliers((current) => [...current, { ...input, id, itemCount: 0, balance: 0 }]);
  };

  const updateSupplier = (id: string, input: SupplierInput) => {
    setSuppliers((current) => current.map((supplier) => supplier.id === id ? { ...supplier, ...input } : supplier));
    setProducts((current) => current.map((product) => product.supplierId === id ? { ...product, supplierName: input.name } : product));
  };

  const addTransaction = (items: TransactionItem[]) => {
    const id = `TRX${String(transactions.length + 1).padStart(3, '0')}`;
    const transaction: Transaction = { id, date: todayISO(), time: currentTime(), items, status: 'Selesai' };
    setTransactions((current) => [transaction, ...current]);
    setProducts((current) => current.map((product) => {
      const sold = items.find((item) => item.productId === product.id)?.quantity ?? 0;
      return sold > 0 ? { ...product, stock: Math.max(0, product.stock - sold) } : product;
    }));
    setNotifications((current) => [{
      id: `N${Date.now()}`,
      title: 'Transaksi berhasil',
      message: `${id} telah disimpan.`,
      time: 'Baru saja',
      type: 'transaction',
      read: false,
    }, ...current]);
    return transaction;
  };

  const addUser = (input: UserInput) => {
    const id = `U${String(users.length + 1).padStart(3, '0')}`;
    setUsers((current) => [...current, { ...input, id, active: true }]);
  };

  const removeUser = (id: string) => setUsers((current) => current.filter((user) => user.id !== id));
  const markAllNotificationsRead = () => setNotifications((current) => current.map((item) => ({ ...item, read: true })));

  const value = useMemo(() => ({
    products, suppliers, transactions, users, notifications,
    addProduct, updateProduct, addSupplier, updateSupplier, addTransaction, addUser, removeUser, markAllNotificationsRead,
  }), [products, suppliers, transactions, users, notifications]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp harus digunakan di dalam AppProvider');
  return context;
}
