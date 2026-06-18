import { StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { AppButton, AppScreen, BackButton, Card, EmptyState, HeroHeader, SectionTitle, SelectField, StatCard } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiGet } from '@/lib/api';
import { exportSupplierReportPdf } from '@/lib/report-export';
import type { AuthUserProfile, LinkedSupplier, SupplierReportDetail } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

const formatTransactionDate = (value: string) => new Date(value).toLocaleDateString('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export default function SupplierReportScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const storeUserId = profile.id ?? '';
  const [suppliers, setSuppliers] = useState<LinkedSupplier[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [report, setReport] = useState<SupplierReportDetail | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!storeUserId) return;

      try {
        const response = await apiGet<{ data: LinkedSupplier[] }>(`/api/stores/${storeUserId}/suppliers`);
        if (!active) return;
        setSuppliers(response.data);
        setSupplierId((current) => current || response.data[0]?.supplierUserId || '');
      } catch {
        if (active) setSuppliers([]);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [storeUserId]);

  const loadReport = useCallback(async () => {
    if (!storeUserId || !supplierId) {
      setReport(null);
      return;
    }

    try {
      const response = await apiGet<{ data: SupplierReportDetail }>(`/api/stores/${storeUserId}/reports/suppliers/${supplierId}`);
      setReport(response.data);
    } catch {
      setReport(null);
    }
  }, [storeUserId, supplierId]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const exportReport = async () => {
    if (!report) {
      showToast({ title: 'Data belum siap', message: 'Pilih supplier terlebih dahulu.', tone: 'info' });
      return;
    }

    try {
      await exportSupplierReportPdf(report);
      showToast({ title: 'PDF laporan supplier dibuat', message: 'File siap dibagikan atau disimpan.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Gagal export laporan supplier', message: error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat PDF.', tone: 'error' });
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Laporan per Supplier" subtitle="Rekap penjualan per supplier" leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <SelectField
          label="Pilih Supplier"
          value={supplierId}
          onChange={setSupplierId}
          options={suppliers.map((item) => ({ label: item.businessName ?? item.name, value: item.supplierUserId, description: item.email }))}
        />
        {!report ? <EmptyState icon="person-outline" title="Pilih supplier" /> : (
          <>
            <View style={styles.stats}>
              <StatCard icon="cube-outline" label="Jenis Barang" value={String(report.productCount)} />
              <StatCard icon="cart-outline" label="Barang Terjual" value={String(report.soldItems)} tone="info" />
            </View>
            <Card>
              <SectionTitle title={`Ringkasan ${report.supplier.businessName ?? report.supplier.name}`} />
              <View style={styles.summary}>
                <View style={styles.row}><Text style={styles.label}>Total Penjualan</Text><Text style={styles.value}>{formatRupiah(report.totalSales)}</Text></View>
                <View style={styles.row}><Text style={styles.label}>Bagian Supplier</Text><Text style={[styles.value, { color: colors.info }]}>{formatRupiah(report.supplierAmount)}</Text></View>
                <View style={styles.row}><Text style={styles.label}>Margin Toko</Text><Text style={[styles.value, { color: colors.primaryDark }]}>{formatRupiah(report.storeAmount)}</Text></View>
                <View style={styles.row}><Text style={styles.label}>Sisa Stok di Toko</Text><Text style={styles.value}>{report.currentStock} unit</Text></View>
              </View>
            </Card>
            <Card>
              <SectionTitle title="Riwayat Transaksi" />
              <View style={styles.history}>
                {report.transactions.length === 0 ? <Text style={styles.empty}>Belum ada transaksi untuk supplier ini.</Text> : report.transactions.map((item, index) => (
                  <View key={`${item.id}-${index}`} style={styles.historyRow}>
                    <View>
                      <Text style={styles.historyId}>{item.code}</Text>
                      <Text style={styles.historyMeta}>{formatTransactionDate(item.createdAt)} · {item.quantity} item</Text>
                    </View>
                    <View style={styles.right}>
                      <Text style={styles.historyValue}>{formatRupiah(item.supplierAmount)}</Text>
                      <Text style={styles.historyMeta}>bagian supplier</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
            <AppButton title="Export Laporan Supplier" icon="download-outline" variant="outline" onPress={exportReport} />
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 }, content: { padding: spacing.xxl, gap: spacing.lg }, stats: { flexDirection: 'row', gap: spacing.md }, summary: { gap: spacing.md, marginTop: spacing.lg }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg }, label: { color: colors.textMuted }, value: { color: colors.text, fontWeight: '800' }, history: { gap: spacing.md, marginTop: spacing.lg }, historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }, historyId: { color: colors.text, fontWeight: '800' }, historyMeta: { color: colors.textMuted, fontSize: 12, marginTop: 3 }, historyValue: { color: colors.primaryDark, fontWeight: '800' }, right: { alignItems: 'flex-end' }, empty: { color: colors.textMuted, fontSize: 13 },
});
