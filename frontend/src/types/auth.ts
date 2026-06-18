export type AccountType = 'store' | 'supplier';

export interface AuthUserProfile {
  id?: string;
  email?: string;
  name?: string;
  image?: string | null;
  businessName?: string | null;
  accountType?: AccountType | null;
}

export interface SupplierSearchResult {
  id: string;
  name: string;
  email: string;
  businessName?: string | null;
  accountType?: AccountType | null;
  linked: boolean;
}

export interface LinkedSupplier {
  linkId: string;
  supplierUserId: string;
  name: string;
  email: string;
  businessName?: string | null;
}

export interface LinkedStore {
  linkId: string;
  storeUserId: string;
  name: string;
  email: string;
  businessName?: string | null;
}

export interface SupplierProduct {
  id: string;
  name: string;
  imageUrl?: string | null;
  sellPrice: string | number;
  supplierPrice: string | number;
  initialQuantity: number;
  currentStock: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreProduct extends SupplierProduct {
  supplierUserId: string;
  supplierName: string;
  supplierEmail: string;
  supplierBusinessName?: string | null;
}

export interface StoreTransactionSummary {
  id: string;
  code: string;
  status: string;
  totalAmount: string | number;
  supplierAmount: string | number;
  storeAmount: string | number;
  createdAt: string;
  itemCount: number;
}

export interface StoreTransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  supplierUserId: string;
  productName: string;
  supplierName: string;
  quantity: number;
  unitPrice: string | number;
  supplierUnitPrice: string | number;
  totalPrice: string | number;
  supplierTotal: string | number;
  storeTotal: string | number;
}

export interface StoreTransactionDetail extends Omit<StoreTransactionSummary, 'itemCount'> {
  items: StoreTransactionItem[];
}

export interface ReportOverview {
  transactionCount: number;
  totalSales: number;
  supplierAmount: number;
  storeAmount: number;
  soldItems: number;
  supplierCount: number;
  productCount: number;
  currentStock: number;
  recentTransactions: Array<{
    id: string;
    code: string;
    createdAt: string;
    totalAmount: string | number;
    supplierAmount: string | number;
    storeAmount: string | number;
    status: string;
  }>;
}

export interface SupplierReportDetail {
  supplier: {
    supplierUserId: string;
    name: string;
    email: string;
    businessName?: string | null;
  };
  productCount: number;
  soldItems: number;
  currentStock: number;
  totalSales: number;
  supplierAmount: number;
  storeAmount: number;
  paidOutAmount: number;
  availableBalance: number;
  transactions: Array<{
    id: string;
    code: string;
    createdAt: string;
    quantity: number;
    revenue: number;
    supplierAmount: number;
    storeAmount: number;
  }>;
}

export interface SupplierPayout {
  id: string;
  amount: number;
  note?: string | null;
  createdAt: string;
}

export interface SupplierBalanceSummary {
  supplier: {
    supplierUserId: string;
    name: string;
    email: string;
    businessName?: string | null;
  };
  totalEarned: number;
  totalPaidOut: number;
  availableBalance: number;
  payouts: SupplierPayout[];
}

export interface SupplierStockEntry {
  id: string;
  productId?: string | null;
  productName: string;
  quantity: number;
  type: 'consignment' | 'restock' | 'withdrawal';
  label: string;
  sellPrice?: number | null;
  supplierPrice?: number | null;
  previousStock?: number | null;
  newStock?: number | null;
  createdAt: string;
}

export interface SupplierHistorySummary {
  supplier: {
    supplierUserId: string;
    name: string;
    email: string;
    businessName?: string | null;
  };
  stockEntries: SupplierStockEntry[];
}

export interface SupplierOverview {
  linkedStoreCount: number;
  productCount: number;
  currentStock: number;
  availableBalance: number;
  linkedStores: LinkedStore[];
}
