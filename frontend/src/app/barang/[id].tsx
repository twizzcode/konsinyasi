import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppScreen, BackButton, Card, EmptyState, HeroHeader, SectionTitle } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import type { AuthUserProfile, StoreProduct } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<StoreProduct | null>(null);

  const loadProduct = useCallback(async () => {
    if (!profile.id || !id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiGet<{ data: StoreProduct }>(`/api/stores/${profile.id}/products/${id}`);
      setProduct(response.data);
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [profile.id, id]);

  useFocusEffect(useCallback(() => {
    void loadProduct();
  }, [loadProduct]));

  if (loading) {
    return (
      <AppScreen>
        <HeroHeader title="Detail Barang" leftAction={<BackButton onPress={() => router.back()} />} />
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      </AppScreen>
    );
  }

  if (!product) {
    return (
      <AppScreen>
        <HeroHeader title="Detail Barang" leftAction={<BackButton onPress={() => router.back()} />} />
        <EmptyState icon="alert-circle-outline" title="Barang tidak ditemukan" />
      </AppScreen>
    );
  }

  const supplierLabel = product.supplierBusinessName || product.supplierName;
  const soldCount = Math.max(0, Number(product.initialQuantity) - Number(product.currentStock));
  const supplierMoney = soldCount * Number(product.supplierPrice);
  const storeValue = Number(product.currentStock) * Number(product.sellPrice);

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Detail Barang" leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <Card style={styles.productCard}>
          <View style={styles.photoBox}>
            {product.imageUrl ? <Image source={{ uri: product.imageUrl }} style={styles.photo} /> : <Ionicons name="cube-outline" size={76} color={colors.textMuted} />}
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.supplier}>Supplier: {supplierLabel}</Text>
            <Text style={styles.price}>{formatRupiah(Number(product.sellPrice))}</Text>
          </View>
        </Card>

        <View style={styles.twoColumns}>
          <Card style={styles.flex}>
            <Text style={styles.smallLabel}>Sisa Stok</Text>
            <Text style={styles.metric}>{product.currentStock} unit</Text>
          </Card>
          <Card style={styles.flex}>
            <Text style={styles.smallLabel}>Sudah Terjual</Text>
            <Text style={styles.metric}>{soldCount} unit</Text>
          </Card>
        </View>

        <Card>
          <SectionTitle title="Informasi Titipan" />
          <View style={styles.infoList}>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Total titipan</Text><Text style={styles.infoValue}>{product.initialQuantity} unit</Text></View>
            <View style={styles.divider} />
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Harga beli</Text><Text style={styles.infoValue}>{formatRupiah(Number(product.supplierPrice))}</Text></View>
            <View style={styles.divider} />
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Harga jual</Text><Text style={styles.infoValue}>{formatRupiah(Number(product.sellPrice))}</Text></View>
            <View style={styles.divider} />
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nilai stok di toko</Text><Text style={styles.infoValue}>{formatRupiah(storeValue)}</Text></View>
            <View style={styles.divider} />
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Uang supplier</Text><Text style={[styles.infoValue, styles.highlight]}>{formatRupiah(supplierMoney)}</Text></View>
          </View>
        </Card>

        <View style={styles.actions}>
          <AppButton title="Edit Barang" icon="create-outline" variant="outline" onPress={() => router.push(`/barang/${product.id}/edit`)} />
          <AppButton title="Tambah Stok" icon="add-outline" onPress={() => router.push('/stok/tambah')} />
          <AppButton
            title="Buka Supplier"
            icon="people-outline"
            variant="secondary"
            onPress={() => router.push({
              pathname: '/supplier/[supplierUserId]',
              params: {
                supplierUserId: product.supplierUserId,
                name: product.supplierName,
                businessName: product.supplierBusinessName ?? '',
                email: product.supplierEmail,
              },
            })}
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  productCard: { padding: 0, overflow: 'hidden' },
  photoBox: { width: '100%', aspectRatio: 1, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '100%' },
  titleBlock: { padding: spacing.lg, gap: 6 },
  name: { fontSize: 21, fontWeight: '800', color: colors.text },
  supplier: { color: colors.textMuted, fontSize: 13 },
  price: { color: colors.primaryDark, fontSize: 24, fontWeight: '800', marginTop: spacing.xs },
  twoColumns: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  smallLabel: { color: colors.textMuted, fontSize: 12 },
  metric: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: spacing.sm },
  infoList: { marginTop: spacing.lg, gap: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg },
  infoLabel: { color: colors.textMuted, fontSize: 13 },
  infoValue: { color: colors.text, fontWeight: '700', fontSize: 13, textAlign: 'right' },
  highlight: { color: colors.primaryDark },
  divider: { height: 1, backgroundColor: colors.border },
  actions: { gap: spacing.md },
});
