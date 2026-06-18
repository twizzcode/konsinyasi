import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen, Card, EmptyState, FloatingActionButton, HeroHeader, SearchBar } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import type { AuthUserProfile, StoreProduct } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

export default function ProductListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const storeUserId = profile.id ?? '';
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<StoreProduct[]>([]);

  const loadProducts = useCallback(async () => {
    if (!storeUserId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiGet<{ data: StoreProduct[] }>(`/api/stores/${storeUserId}/products`);
      setProducts(response.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [storeUserId]);

  useFocusEffect(useCallback(() => {
    void loadProducts();
  }, [loadProducts]));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter((item) => [
      item.name,
      item.supplierBusinessName,
      item.supplierName,
      item.supplierEmail,
    ].filter(Boolean).join(' ').toLowerCase().includes(query));
  }, [products, search]);

  const totalStock = products.reduce((sum, item) => sum + Number(item.currentStock), 0);

  return (
    <AppScreen scroll={false} contentStyle={styles.page}>
      <HeroHeader title="Daftar Barang" subtitle={`${products.length} barang · ${totalStock} stok tersisa`}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Cari barang atau supplier..." />
      </HeroHeader>
      <View style={styles.listWrap}>
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="cube-outline"
            title="Belum ada barang"
            description={products.length === 0 ? 'Tambahkan stok dari supplier yang sudah terhubung.' : 'Coba ubah kata pencarian.'}
          />
        ) : (
          <AppScreen contentStyle={styles.innerList} safeTop={false}>
            {filtered.map((product) => {
              const supplierLabel = product.supplierBusinessName || product.supplierName;
              const soldCount = Math.max(0, Number(product.initialQuantity) - Number(product.currentStock));

              return (
                <Card key={product.id} onPress={() => router.push(`/barang/${product.id}`)}>
                  <View style={styles.row}>
                    <View style={styles.imageBox}>
                      {product.imageUrl ? <Image source={{ uri: product.imageUrl }} style={styles.image} /> : <Ionicons name="cube-outline" size={30} color={colors.textMuted} />}
                    </View>
                    <View style={styles.body}>
                      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
                      <Text style={styles.supplier}>Supplier: {supplierLabel}</Text>
                      <Text style={styles.meta}>Sisa stok {product.currentStock} dari {product.initialQuantity} · Terjual {soldCount}</Text>
                      <View style={styles.bottomRow}>
                        <Text style={styles.price}>{formatRupiah(Number(product.sellPrice))}</Text>
                        <Text style={styles.stockValue}>{formatRupiah(Number(product.currentStock) * Number(product.sellPrice))}</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            })}
          </AppScreen>
        )}
      </View>
      <FloatingActionButton icon="add-outline" onPress={() => router.push('/stok/tambah')} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  listWrap: { flex: 1 },
  innerList: { padding: spacing.xxl, gap: spacing.md, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', gap: spacing.md },
  imageBox: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  body: { flex: 1, justifyContent: 'space-between', gap: 4 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  supplier: { color: colors.textMuted, fontSize: 12 },
  meta: { color: colors.textMuted, fontSize: 12 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  price: { color: colors.primaryDark, fontWeight: '800' },
  stockValue: { color: colors.text, fontWeight: '700', fontSize: 12 },
});
