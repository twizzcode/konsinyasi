import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen, Badge, Card, EmptyState, FloatingActionButton, HeroHeader, SearchBar } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import type { AuthUserProfile, StoreTransactionSummary } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

const formatTransactionDate = (value: string) => new Date(value).toLocaleString('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export default function TransactionListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const storeUserId = profile.id ?? '';
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<StoreTransactionSummary[]>([]);

  const loadTransactions = useCallback(async () => {
    if (!storeUserId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiGet<{ data: StoreTransactionSummary[] }>(`/api/stores/${storeUserId}/transactions`);
      setTransactions(response.data);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [storeUserId]);

  useFocusEffect(useCallback(() => {
    void loadTransactions();
  }, [loadTransactions]));

  const filtered = useMemo(
    () => transactions.filter((item) => item.code.toLowerCase().includes(search.toLowerCase())),
    [transactions, search],
  );

  const totalStoreAmount = transactions.reduce((sum, item) => sum + Number(item.storeAmount), 0);

  return (
    <AppScreen scroll={false} contentStyle={styles.page}>
      <HeroHeader title="Transaksi Penjualan" subtitle={`${transactions.length} transaksi terjual · margin toko ${formatRupiah(totalStoreAmount)}`}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Cari kode transaksi..." />
      </HeroHeader>
      <View style={styles.listWrap}>
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
        ) : filtered.length === 0 ? (
          <EmptyState icon="receipt-outline" title="Transaksi tidak ditemukan" />
        ) : (
          <AppScreen safeTop={false} contentStyle={styles.list}>
            {filtered.map((transaction) => (
              <Card key={transaction.id} onPress={() => router.push(`/transaksi/${transaction.id}`)}>
                <View style={styles.topRow}>
                  <View style={styles.idWrap}>
                    <View style={styles.icon}><Ionicons name="receipt-outline" size={24} color={colors.primaryDark} /></View>
                    <View style={styles.flex}>
                      <Text style={styles.id}>{transaction.code}</Text>
                      <Text style={styles.date}>{formatTransactionDate(transaction.createdAt)}</Text>
                    </View>
                  </View>
                  <Badge label={transaction.status} tone="success" />
                </View>
                <View style={styles.divider} />
                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.meta}>{transaction.itemCount} item</Text>
                    <Text style={styles.meta}>Margin toko {formatRupiah(Number(transaction.storeAmount))}</Text>
                  </View>
                  <Text style={styles.total}>{formatRupiah(Number(transaction.totalAmount))}</Text>
                </View>
              </Card>
            ))}
          </AppScreen>
        )}
      </View>
      <FloatingActionButton onPress={() => router.push('/transaksi/tambah')} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  listWrap: { flex: 1 },
  list: { padding: spacing.xxl, gap: spacing.md, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  idWrap: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', flex: 1 },
  icon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  id: { color: colors.text, fontSize: 16, fontWeight: '800' },
  date: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  total: { color: colors.primaryDark, fontWeight: '800', fontSize: 17 },
});
