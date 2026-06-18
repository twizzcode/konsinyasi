import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { AppButton, AppScreen, BackButton, Badge, Card, Divider, EmptyState, HeroHeader, SectionTitle } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiGet } from '@/lib/api';
import type { AuthUserProfile, StoreTransactionDetail } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

const formatTransactionDate = (value: string) => new Date(value).toLocaleString('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<StoreTransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTransaction = useCallback(async () => {
    if (!profile.id || !id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiGet<{ data: StoreTransactionDetail }>(`/api/stores/${profile.id}/transactions/${id}`);
      setTransaction(response.data);
    } catch {
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  }, [profile.id, id]);

  useFocusEffect(useCallback(() => {
    void loadTransaction();
  }, [loadTransaction]));

  if (!loading && !transaction) {
    return <AppScreen><EmptyState icon="alert-circle-outline" title="Transaksi tidak ditemukan" /></AppScreen>;
  }

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader
        title={transaction?.code ?? 'Detail Transaksi'}
        subtitle={transaction ? formatTransactionDate(transaction.createdAt) : 'Memuat transaksi...'}
        leftAction={<BackButton onPress={() => router.back()} />}
        rightAction={transaction ? <Badge label={transaction.status} tone="success" /> : null}
      />
      {transaction ? (
        <View style={styles.content}>
          <Card>
            <SectionTitle title="Detail Barang" />
            <View style={styles.items}>
              {transaction.items.map((item) => (
                <View key={item.id} style={styles.item}>
                  <View style={styles.flex}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemMeta}>{item.supplierName}</Text>
                    <Text style={styles.itemMeta}>{formatRupiah(Number(item.unitPrice))} × {item.quantity}</Text>
                    <Text style={styles.itemMeta}>Margin toko {formatRupiah(Number(item.storeTotal))}</Text>
                  </View>
                  <Text style={styles.itemTotal}>{formatRupiah(Number(item.totalPrice))}</Text>
                </View>
              ))}
            </View>
          </Card>
          <Card>
            <SectionTitle title="Ringkasan Penjualan" />
            <View style={styles.summary}>
              <View style={styles.row}><Text style={styles.label}>Total Penjualan</Text><Text style={styles.value}>{formatRupiah(Number(transaction.totalAmount))}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Bagian Supplier</Text><Text style={styles.value}>{formatRupiah(Number(transaction.supplierAmount))}</Text></View>
              <Divider />
              <View style={styles.row}><Text style={styles.totalLabel}>Margin Toko</Text><Text style={styles.profit}>{formatRupiah(Number(transaction.storeAmount))}</Text></View>
            </View>
          </Card>
          <View style={styles.actions}>
            <AppButton title="Cetak Struk" icon="print-outline" variant="outline" onPress={() => showToast({ title: 'Fitur belum tersedia', message: 'Cetak struk belum dihubungkan ke modul printer atau PDF.', tone: 'info' })} />
            <AppButton title="Bagikan" icon="share-social-outline" variant="secondary" onPress={() => showToast({ title: 'Fitur belum tersedia', message: 'Bagikan struk akan aktif setelah template PDF struk selesai.', tone: 'info' })} />
          </View>
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  items: { gap: spacing.md, marginTop: spacing.lg },
  item: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  flex: { flex: 1 },
  itemName: { color: colors.text, fontWeight: '800' },
  itemMeta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  itemTotal: { color: colors.text, fontWeight: '800' },
  summary: { gap: spacing.md, marginTop: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg },
  label: { color: colors.textMuted },
  value: { color: colors.text, fontWeight: '700' },
  totalLabel: { color: colors.text, fontWeight: '800' },
  profit: { color: colors.primaryDark, fontWeight: '800' },
  actions: { gap: spacing.md },
});
