import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppScreen, BackButton, Card, EmptyState, HeroHeader, SectionTitle } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import type { AuthUserProfile, SupplierBalanceSummary, SupplierHistorySummary, SupplierProduct } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

export default function SupplierDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const params = useLocalSearchParams<{
    supplierUserId: string;
    name?: string;
    businessName?: string;
    email?: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
  const [balanceSummary, setBalanceSummary] = useState<SupplierBalanceSummary | null>(null);
  const [historySummary, setHistorySummary] = useState<SupplierHistorySummary | null>(null);
  const supplierTitle = params.businessName || params.name || 'Supplier';

  const loadProducts = useCallback(async () => {
    if (!profile.id || !params.supplierUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [productsResponse, balanceResponse, historyResponse] = await Promise.all([
        apiGet<{ data: SupplierProduct[] }>(`/api/stores/${profile.id}/suppliers/${params.supplierUserId}/products`),
        apiGet<{ data: SupplierBalanceSummary }>(`/api/stores/${profile.id}/suppliers/${params.supplierUserId}/balance`),
        apiGet<{ data: SupplierHistorySummary }>(`/api/stores/${profile.id}/suppliers/${params.supplierUserId}/history`),
      ]);
      setSupplierProducts(productsResponse.data);
      setBalanceSummary(balanceResponse.data);
      setHistorySummary(historyResponse.data);
    } catch {
      setSupplierProducts([]);
      setBalanceSummary(null);
      setHistorySummary(null);
    } finally {
      setLoading(false);
    }
  }, [profile.id, params.supplierUserId]);

  useFocusEffect(useCallback(() => {
    void loadProducts();
  }, [loadProducts]));

  const totalProducts = supplierProducts.length;
  const totalCurrentStock = supplierProducts.reduce((sum, item) => sum + Number(item.currentStock), 0);
  const totalSupplierBalance = balanceSummary?.availableBalance ?? 0;

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title={supplierTitle} subtitle="Kelola barang titipan supplier" leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <Card>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <Ionicons name="people-outline" size={24} color={colors.primaryDark} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.name}>{supplierTitle}</Text>
              {params.name && params.businessName ? <Text style={styles.meta}>PIC: {params.name}</Text> : null}
              {params.email ? <Text style={styles.meta}>{params.email}</Text> : null}
            </View>
          </View>
        </Card>

        <View style={styles.actionRow}>
          <AppButton
            title="Tambah Barang"
            icon="add-outline"
            onPress={() => router.push({
              pathname: '/supplier/[supplierUserId]/tambah-barang',
              params: {
                supplierUserId: params.supplierUserId,
                name: params.name,
                businessName: params.businessName,
                email: params.email,
              },
            })}
            fullWidth={false}
            style={styles.actionButton}
          />
          <AppButton
            title="Ambil Uang"
            icon="wallet-outline"
            variant="outline"
            onPress={() => router.push({
              pathname: '/supplier/[supplierUserId]/ambil-uang',
              params: {
                supplierUserId: params.supplierUserId,
                name: params.name,
                businessName: params.businessName,
                email: params.email,
                availableBalance: String(totalSupplierBalance),
              },
            })}
            fullWidth={false}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Sisa Barang di Toko</Text>
            <Text style={styles.summaryValue}>{totalCurrentStock}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Saldo Siap Diambil</Text>
            <Text style={styles.summaryValue}>{formatRupiah(totalSupplierBalance)}</Text>
          </Card>
        </View>

        {balanceSummary ? (
          <Card>
            <SectionTitle title="Riwayat Ambil Uang" />
            <View style={styles.historyList}>
              <View style={styles.historySummary}>
                <Text style={styles.historyMeta}>Total pendapatan supplier {formatRupiah(balanceSummary.totalEarned)}</Text>
                <Text style={styles.historyMeta}>Sudah diambil {formatRupiah(balanceSummary.totalPaidOut)}</Text>
              </View>
              {balanceSummary.payouts.length === 0 ? (
                <Text style={styles.emptyHistory}>Belum ada pencairan uang untuk supplier ini.</Text>
              ) : balanceSummary.payouts.slice(0, 3).map((payout) => (
                <View key={payout.id} style={styles.historyRow}>
                  <View style={styles.flex}>
                    <Text style={styles.historyAmount}>{formatRupiah(payout.amount)}</Text>
                    <Text style={styles.historyMeta}>{new Date(payout.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                    {payout.note ? <Text style={styles.historyMeta}>{payout.note}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          </Card>
        ) : null}

        {historySummary ? (
          <Card>
            <SectionTitle title="Riwayat Masuk Barang" />
            <View style={styles.historyList}>
              {historySummary.stockEntries.length === 0 ? (
                <Text style={styles.emptyHistory}>Belum ada riwayat titip barang atau tambah stok untuk supplier ini.</Text>
              ) : historySummary.stockEntries.slice(0, 8).map((item) => (
                <View key={`${item.type}-${item.id}`} style={styles.historyRow}>
                  <View style={styles.flex}>
                    <Text style={styles.historyTitle}>{item.productName}</Text>
                    <Text style={styles.historyMeta}>
                      {item.label} {item.quantity} unit
                      {item.type === 'consignment' && item.sellPrice != null && item.supplierPrice != null
                        ? ` · jual ${formatRupiah(item.sellPrice)} · bagian supplier ${formatRupiah(item.supplierPrice)}`
                        : ''}
                    </Text>
                    <Text style={styles.historyMeta}>{new Date(item.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        ) : null}

        <SectionTitle title="Barang Titipan" />
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
        ) : supplierProducts.length === 0 ? (
          <EmptyState icon="cube-outline" title="Belum ada barang titipan" description="Tambah barang pertama dari supplier ini." />
        ) : (
          <View style={styles.list}>
            {supplierProducts.map((product) => (
              <Card key={product.id}>
                <View style={styles.productRow}>
                  <View style={styles.productIcon}>
                    {product.imageUrl ? <Image source={{ uri: product.imageUrl }} style={styles.productImage} /> : <Ionicons name="cube-outline" size={22} color={colors.primaryDark} />}
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.meta}>Sisa stok {product.currentStock}</Text>
                    <Text style={styles.meta}>Harga beli {formatRupiah(Number(product.supplierPrice))}</Text>
                    <Text style={styles.meta}>Harga jual {formatRupiah(Number(product.sellPrice))}</Text>
                  </View>
                  <View style={styles.productActions}>
                    <Pressable
                      hitSlop={10}
                      onPress={() => router.push({
                        pathname: '/supplier/[supplierUserId]/barang/[productId]/ambil',
                        params: {
                          supplierUserId: params.supplierUserId,
                          productId: product.id,
                          name: params.name,
                          businessName: params.businessName,
                          email: params.email,
                          productName: product.name,
                          currentStock: String(product.currentStock),
                        },
                      })}
                    >
                      <Ionicons name="remove-outline" size={20} color={colors.warning} />
                    </Pressable>
                    <Pressable
                      hitSlop={10}
                      onPress={() => router.push({
                        pathname: '/supplier/[supplierUserId]/barang/[productId]/edit',
                        params: {
                          supplierUserId: params.supplierUserId,
                          productId: product.id,
                          name: params.name,
                          businessName: params.businessName,
                          email: params.email,
                          productName: product.name,
                          sellPrice: String(product.sellPrice),
                          supplierPrice: String(product.supplierPrice),
                          initialQuantity: String(product.initialQuantity),
                          currentStock: String(product.currentStock),
                          imageUrl: product.imageUrl ?? '',
                        },
                      })}
                    >
                      <Ionicons name="create-outline" size={20} color={colors.primaryDark} />
                    </Pressable>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 28 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  center: { paddingVertical: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
  actionRow: { flexDirection: 'row', gap: spacing.md },
  actionButton: { flex: 1 },
  summaryGrid: { flexDirection: 'row', gap: spacing.md },
  summaryCard: { flex: 1 },
  summaryLabel: { color: colors.textMuted, fontSize: 12 },
  summaryValue: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: spacing.sm },
  historyList: { gap: spacing.md, marginTop: spacing.lg },
  historySummary: { gap: 4 },
  historyRow: { paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  historyAmount: { color: colors.primaryDark, fontWeight: '800' },
  historyTitle: { color: colors.text, fontWeight: '800' },
  historyMeta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  emptyHistory: { color: colors.textMuted, fontSize: 13 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 52, height: 52, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  name: { color: colors.text, fontSize: 18, fontWeight: '800' },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  list: { gap: spacing.md },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  productIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  productName: { color: colors.text, fontWeight: '800' },
  productActions: { gap: spacing.md, alignItems: 'center', justifyContent: 'center' },
});
