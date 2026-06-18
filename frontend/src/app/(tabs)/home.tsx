import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen, Badge, Card, EmptyState, HeroHeader, SectionTitle, StatCard } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import type { AuthUserProfile, ReportOverview, StoreProduct, StoreTransactionSummary, SupplierOverview } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

const LOW_STOCK_THRESHOLD = 5;

const actions = [
  { label: 'Tambah Stok', icon: 'layers-outline' as const, href: '/stok/tambah' as const, color: colors.primary },
  { label: 'Transaksi Baru', icon: 'receipt-outline' as const, href: '/transaksi/tambah' as const, color: colors.warning },
  { label: 'Laporan', icon: 'bar-chart-outline' as const, href: '/laporan' as const, color: colors.primaryDark },
];

const isSameCalendarDay = (value: string, target: Date) => {
  const date = new Date(value);
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
};

const formatTransactionDate = (value: string) => new Date(value).toLocaleString('id-ID', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const isStore = profile.accountType === 'store';
  const isSupplier = profile.accountType === 'supplier';
  const userId = profile.id ?? '';

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<ReportOverview | null>(null);
  const [supplierOverview, setSupplierOverview] = useState<SupplierOverview | null>(null);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [transactions, setTransactions] = useState<StoreTransactionSummary[]>([]);

  const loadHome = useCallback(async () => {
    if (!userId) {
      setOverview(null);
      setSupplierOverview(null);
      setProducts([]);
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (isStore) {
        const [overviewResponse, productsResponse, transactionsResponse] = await Promise.all([
          apiGet<{ data: ReportOverview }>(`/api/stores/${userId}/reports/overview`),
          apiGet<{ data: StoreProduct[] }>(`/api/stores/${userId}/products`),
          apiGet<{ data: StoreTransactionSummary[] }>(`/api/stores/${userId}/transactions`),
        ]);

        setOverview(overviewResponse.data);
        setProducts(productsResponse.data);
        setTransactions(transactionsResponse.data);
        setSupplierOverview(null);
      } else if (isSupplier) {
        const response = await apiGet<{ data: SupplierOverview }>(`/api/suppliers/${userId}/overview`);
        setSupplierOverview(response.data);
        setOverview(null);
        setProducts([]);
        setTransactions([]);
      } else {
        setOverview(null);
        setSupplierOverview(null);
        setProducts([]);
        setTransactions([]);
      }
    } catch {
      setOverview(null);
      setSupplierOverview(null);
      setProducts([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [isStore, isSupplier, userId]);

  useFocusEffect(useCallback(() => {
    void loadHome();
  }, [loadHome]));

  const todayTransactions = transactions.filter((item) => isSameCalendarDay(item.createdAt, new Date()));
  const todaySales = todayTransactions.reduce((sum, item) => sum + Number(item.totalAmount), 0);
  const todayStoreMargin = todayTransactions.reduce((sum, item) => sum + Number(item.storeAmount), 0);
  const lowStockProducts = useMemo(
    () => products
      .filter((item) => Number(item.currentStock) <= LOW_STOCK_THRESHOLD)
      .sort((left, right) => Number(left.currentStock) - Number(right.currentStock)),
    [products],
  );
  const lowStockItems = lowStockProducts.slice(0, 3);
  const lowStockCount = lowStockProducts.length;

  if (!isStore && !isSupplier) {
    return (
      <AppScreen contentStyle={styles.page}>
        <HeroHeader
          title={`Halo, ${profile.name ?? 'Pengguna'}`}
          subtitle="Halaman ini disiapkan untuk akun toko atau supplier."
        />
        <View style={styles.content}>
          <EmptyState icon="storefront-outline" title="Dashboard tidak tersedia" description="Masuk dengan akun toko atau supplier untuk melihat ringkasan yang sesuai." />
        </View>
      </AppScreen>
    );
  }

  if (isSupplier) {
    return (
      <AppScreen contentStyle={styles.page}>
        <HeroHeader
          title={`Halo, ${profile.businessName || profile.name || 'Supplier'}`}
          subtitle="Ringkasan kemitraan supplier"
        />
        <View style={styles.content}>
          {loading ? (
            <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
          ) : (
            <>
              <View style={styles.statsGrid}>
                <StatCard icon="storefront-outline" label="Toko Terhubung" value={String(supplierOverview?.linkedStoreCount ?? 0)} />
                <StatCard icon="cube-outline" label="Barang Aktif" value={String(supplierOverview?.productCount ?? 0)} tone="info" />
                <StatCard icon="archive-outline" label="Sisa Stok" value={String(supplierOverview?.currentStock ?? 0)} tone="warning" />
                <StatCard icon="wallet-outline" label="Saldo Siap Diambil" value={formatRupiah(supplierOverview?.availableBalance ?? 0)} tone="primary" />
              </View>

              <SectionTitle title="Toko Terhubung" actionLabel="Buka tab Toko" onAction={() => router.push('/supplier')} />
              {!supplierOverview?.linkedStores.length ? (
                <Card>
                  <EmptyState icon="storefront-outline" title="Belum terhubung ke toko" description="Daftar toko akan muncul di sini setelah ada toko yang menambahkan akun Anda sebagai supplier." />
                </Card>
              ) : (
                <View style={styles.list}>
                  {supplierOverview.linkedStores.slice(0, 4).map((store) => (
                    <Card
                      key={store.linkId}
                      onPress={() => router.push({
                        pathname: '/toko/[storeUserId]',
                        params: {
                          storeUserId: store.storeUserId,
                          name: store.name,
                          businessName: store.businessName,
                          email: store.email,
                        },
                      })}
                    >
                      <View style={styles.lowStockRow}>
                        <View style={styles.lowStockBody}>
                          <Text style={styles.lowStockName}>{store.businessName ?? store.name}</Text>
                          <Text style={styles.lowStockMeta}>{store.email}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                      </View>
                    </Card>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader
        title={`Halo, ${profile.businessName || profile.name || 'Toko'}`}
        subtitle="Ringkasan operasional toko hari ini"
      />

      <View style={styles.content}>
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
        ) : (
          <>
            <View style={styles.statsGrid}>
              <StatCard icon="cube-outline" label="Total Barang" value={String(overview?.productCount ?? products.length)} />
              <StatCard icon="trending-up-outline" label="Penjualan Hari Ini" value={formatRupiah(todaySales)} tone="info" />
              <StatCard icon="wallet-outline" label="Margin Hari Ini" value={formatRupiah(todayStoreMargin)} tone="warning" />
              <StatCard icon="warning-outline" label="Stok Menipis" value={String(lowStockCount)} tone="danger" />
            </View>

            <SectionTitle title="Aksi Cepat" />
            <View style={styles.actionGrid}>
              {actions.map((action) => (
                <Card key={action.label} style={styles.actionCard} onPress={() => router.push(action.href)}>
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}18` }]}>
                    <Ionicons name={action.icon} size={26} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </Card>
              ))}
            </View>

            <SectionTitle title="Transaksi Terbaru" actionLabel="Lihat semua" onAction={() => router.push('/transaksi')} />
            {transactions.length === 0 ? (
              <Card>
                <EmptyState icon="receipt-outline" title="Belum ada transaksi" description="Buat transaksi pertama untuk mulai mencatat penjualan toko." />
              </Card>
            ) : (
              <View style={styles.list}>
                {transactions.slice(0, 3).map((transaction) => (
                  <Card key={transaction.id} onPress={() => router.push(`/transaksi/${transaction.id}`)}>
                    <View style={styles.transactionTopRow}>
                      <View style={styles.transactionInfo}>
                        <View style={styles.transactionIcon}>
                          <Ionicons name="receipt-outline" size={22} color={colors.primaryDark} />
                        </View>
                        <View style={styles.transactionBody}>
                          <Text style={styles.transactionId}>{transaction.code}</Text>
                          <Text style={styles.transactionMeta}>{formatTransactionDate(transaction.createdAt)} · {transaction.itemCount} item</Text>
                        </View>
                      </View>
                      <Badge label={transaction.status} tone="success" />
                    </View>
                    <View style={styles.transactionBottomRow}>
                      <Text style={styles.transactionSubtext}>Margin toko {formatRupiah(Number(transaction.storeAmount))}</Text>
                      <Text style={styles.transactionTotal}>{formatRupiah(Number(transaction.totalAmount))}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            <SectionTitle title="Stok Menipis" actionLabel="Lihat barang" onAction={() => router.push('/barang')} />
            {lowStockItems.length === 0 ? (
              <Card>
                <EmptyState icon="checkmark-circle-outline" title="Stok masih aman" description="Belum ada barang dengan stok di bawah batas perhatian dashboard." />
              </Card>
            ) : (
              <View style={styles.list}>
                {lowStockItems.map((product) => {
                  const supplierLabel = product.supplierBusinessName || product.supplierName;

                  return (
                    <Card key={product.id} onPress={() => router.push(`/barang/${product.id}`)}>
                      <View style={styles.lowStockRow}>
                        <View style={styles.lowStockBody}>
                          <Text style={styles.lowStockName}>{product.name}</Text>
                          <Text style={styles.lowStockMeta}>Supplier: {supplierLabel}</Text>
                        </View>
                        <Badge label={`Stok ${product.currentStock}`} tone="warning" />
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 24 },
  content: { padding: spacing.xxl, gap: spacing.xl },
  center: { paddingVertical: spacing.xxxl, alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  actionCard: { width: '48%', minHeight: 138, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  actionIcon: { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: colors.text, fontWeight: '700', fontSize: 14, lineHeight: 19, textAlign: 'center' },
  list: { gap: spacing.md },
  transactionTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  transactionInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  transactionIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  transactionBody: { flex: 1 },
  transactionId: { color: colors.text, fontWeight: '800' },
  transactionMeta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  transactionBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, marginTop: spacing.md },
  transactionSubtext: { color: colors.textMuted, fontSize: 12, flex: 1 },
  transactionTotal: { color: colors.primaryDark, fontWeight: '800', fontSize: 15 },
  lowStockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  lowStockBody: { flex: 1 },
  lowStockName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  lowStockMeta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
});
