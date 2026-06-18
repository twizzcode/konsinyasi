import { StyleSheet, Text, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppScreen, Card, HeroHeader, SectionTitle, StatCard } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiGet } from '@/lib/api';
import { exportOverviewReportPdf } from '@/lib/report-export';
import type { AuthUserProfile, ReportOverview } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

const formatTransactionDate = (value: string) => new Date(value).toLocaleDateString('id-ID', {
  day: '2-digit',
  month: 'short',
});

export default function ReportScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const storeUserId = profile.id ?? '';
  const [overview, setOverview] = useState<ReportOverview | null>(null);

  const loadOverview = useCallback(async () => {
    if (!storeUserId) {
      setOverview(null);
      return;
    }

    try {
      const response = await apiGet<{ data: ReportOverview }>(`/api/stores/${storeUserId}/reports/overview`);
      setOverview(response.data);
    } catch {
      setOverview(null);
    }
  }, [storeUserId]);

  useFocusEffect(useCallback(() => {
    void loadOverview();
  }, [loadOverview]));

  const revenue = overview?.totalSales ?? 0;
  const supplierAmount = overview?.supplierAmount ?? 0;
  const storeMargin = overview?.storeAmount ?? 0;
  const soldItems = overview?.soldItems ?? 0;
  const supplierCount = overview?.supplierCount ?? 0;
  const maxSales = Math.max(...(overview?.recentTransactions.map((item) => Number(item.totalAmount)) ?? [1]), 1);

  const exportReport = async () => {
    if (!overview) {
      showToast({ title: 'Data belum siap', message: 'Laporan belum tersedia untuk diexport.', tone: 'info' });
      return;
    }

    try {
      await exportOverviewReportPdf(overview);
      showToast({ title: 'PDF laporan dibuat', message: 'File laporan siap dibagikan atau disimpan.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Gagal export laporan', message: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat PDF.', tone: 'error' });
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Laporan" subtitle="Ringkasan penjualan dan margin toko" />
      <View style={styles.content}>
        <View style={styles.stats}>
          <StatCard icon="cash-outline" label="Total Penjualan" value={formatRupiah(revenue)} />
          <StatCard icon="wallet-outline" label="Margin Toko" value={formatRupiah(storeMargin)} tone="warning" />
          <StatCard icon="cart-outline" label="Barang Terjual" value={String(soldItems)} tone="info" />
          <StatCard icon="people-outline" label="Jumlah Supplier" value={String(supplierCount)} tone="primary" />
        </View>

        <Card>
          <SectionTitle title="Distribusi Penjualan" />
          <View style={styles.financeList}>
            <View style={styles.financeRow}><Text style={styles.financeLabel}>Bagian Supplier</Text><Text style={styles.financeValue}>{formatRupiah(supplierAmount)}</Text></View>
            <View style={styles.track}><View style={[styles.bar, { width: `${revenue ? (supplierAmount / revenue) * 100 : 0}%`, backgroundColor: colors.info }]} /></View>
            <View style={styles.financeRow}><Text style={styles.financeLabel}>Margin Toko</Text><Text style={[styles.financeValue, { color: colors.primaryDark }]}>{formatRupiah(storeMargin)}</Text></View>
            <View style={styles.track}><View style={[styles.bar, { width: `${revenue ? (storeMargin / revenue) * 100 : 0}%`, backgroundColor: colors.primary }]} /></View>
          </View>
        </Card>

        <Card>
          <SectionTitle title="Transaksi Terakhir" />
          <View style={styles.chart}>
            {(overview?.recentTransactions ?? []).slice(0, 6).reverse().map((trx) => (
              <View key={trx.id} style={styles.barColumn}>
                <View style={[styles.verticalBar, { height: 30 + (Number(trx.totalAmount) / maxSales) * 90 }]} />
                <Text style={styles.barLabel}>{formatTransactionDate(trx.createdAt)}</Text>
              </View>
            ))}
          </View>
          {!overview?.recentTransactions.length ? <Text style={styles.note}>Belum ada transaksi penjualan.</Text> : null}
        </Card>

        <Card onPress={() => router.push('/laporan/penitip')}>
          <View style={styles.menuRow}>
            <View style={styles.menuIcon}><Ionicons name="people-outline" size={24} color={colors.primaryDark} /></View>
            <View style={styles.menuBody}><Text style={styles.menuTitle}>Laporan per Supplier</Text><Text style={styles.menuDescription}>Lihat total penjualan, bagian supplier, dan margin toko per supplier.</Text></View>
            <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
          </View>
        </Card>

        <AppButton title="Export Laporan" icon="download-outline" variant="outline" onPress={exportReport} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 28 }, content: { padding: spacing.xxl, gap: spacing.lg }, stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  financeList: { gap: spacing.sm, marginTop: spacing.lg }, financeRow: { flexDirection: 'row', justifyContent: 'space-between' }, financeLabel: { color: colors.textMuted, fontSize: 13 }, financeValue: { color: colors.info, fontWeight: '800', fontSize: 13 },
  track: { height: 10, backgroundColor: colors.input, borderRadius: radius.pill, overflow: 'hidden', marginBottom: spacing.sm }, bar: { height: '100%', borderRadius: radius.pill },
  chart: { height: 170, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: spacing.sm, marginTop: spacing.lg, paddingTop: spacing.lg }, barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: spacing.sm }, verticalBar: { width: '62%', maxWidth: 34, backgroundColor: colors.primary, borderTopLeftRadius: radius.sm, borderTopRightRadius: radius.sm }, barLabel: { color: colors.textMuted, fontSize: 11 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, menuIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, menuBody: { flex: 1 }, menuTitle: { color: colors.text, fontWeight: '700' }, menuDescription: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 3 }, note: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.md },
});
