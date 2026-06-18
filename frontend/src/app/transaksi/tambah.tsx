import { useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppScreen, BackButton, Card, Divider, EmptyState, HeroHeader, SearchBar, SectionTitle } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiGet, apiPost } from '@/lib/api';
import type { AuthUserProfile, StoreProduct } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

type CartItem = {
  productId: string;
  name: string;
  supplierName: string;
  price: number;
  supplierPrice: number;
  stock: number;
  quantity: number;
  imageUrl?: string | null;
};

export default function AddTransactionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const storeUserId = profile.id ?? '';
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!storeUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiGet<{ data: StoreProduct[] }>(`/api/stores/${storeUserId}/products`);
        if (active) setProducts(response.data);
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [storeUserId]);

  const available = useMemo(
    () => products.filter((item) => Number(item.currentStock) > 0 && `${item.name} ${item.supplierBusinessName || item.supplierName}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const addProduct = (product: StoreProduct) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) => item.productId === product.id
          ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
          : item);
      }

      return [...current, {
        productId: product.id,
        name: product.name,
        supplierName: product.supplierBusinessName || product.supplierName,
        price: Number(product.sellPrice),
        supplierPrice: Number(product.supplierPrice),
        stock: Number(product.currentStock),
        quantity: 1,
        imageUrl: product.imageUrl,
      }];
    });
    setPickerVisible(false);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) => current.map((item) => item.productId === id
      ? { ...item, quantity: Math.max(1, Math.min(item.stock, item.quantity + delta)) }
      : item));
  };

  const remove = (id: string) => setCart((current) => current.filter((item) => item.productId !== id));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const supplierTotal = cart.reduce((sum, item) => sum + item.supplierPrice * item.quantity, 0);
  const storeProfit = total - supplierTotal;

  const save = async () => {
    if (cart.length === 0) {
      showToast({ title: 'Keranjang kosong', message: 'Tambahkan minimal satu barang.', tone: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiPost<{ data: { id: string; code: string } }>(`/api/stores/${storeUserId}/transactions`, {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      showToast({ title: 'Transaksi berhasil', message: `${response.data.code} telah disimpan.`, tone: 'success' });
      router.replace(`/transaksi/${response.data.id}`);
    } catch (error) {
      showToast({ title: 'Gagal menyimpan transaksi', message: error instanceof Error ? error.message : 'Terjadi kesalahan.', tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Transaksi Baru" subtitle="Catat barang yang terjual oleh toko" leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <AppButton title="Tambah Barang" icon="add-circle-outline" variant="outline" onPress={() => setPickerVisible(true)} />
        <SectionTitle title={`Keranjang (${cart.length})`} />
        {cart.length === 0 ? (
          <Card><EmptyState icon="cart-outline" title="Keranjang masih kosong" description="Tekan Tambah Barang untuk memulai transaksi." /></Card>
        ) : (
          <View style={styles.cartList}>
            {cart.map((item) => (
              <Card key={item.productId}>
                <View style={styles.itemTop}>
                  <View style={styles.itemIcon}>
                    {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.itemImage} /> : <Ionicons name="cube-outline" size={24} color={colors.primaryDark} />}
                  </View>
                  <View style={styles.itemBody}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>{item.supplierName} · {formatRupiah(item.price)}</Text>
                    <Text style={styles.itemMeta}>Stok tersedia: {item.stock}</Text>
                  </View>
                  <Pressable onPress={() => remove(item.productId)} hitSlop={10}>
                    <Ionicons name="trash-outline" size={21} color={colors.danger} />
                  </Pressable>
                </View>
                <Divider />
                <View style={styles.quantityRow}>
                  <View style={styles.stepper}>
                    <Pressable style={styles.stepButton} onPress={() => updateQuantity(item.productId, -1)}>
                      <Ionicons name="remove" size={20} color={colors.text} />
                    </Pressable>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <Pressable style={styles.stepButton} onPress={() => updateQuantity(item.productId, 1)}>
                      <Ionicons name="add" size={20} color={colors.text} />
                    </Pressable>
                  </View>
                  <Text style={styles.itemTotal}>{formatRupiah(item.price * item.quantity)}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        <Card>
          <SectionTitle title="Ringkasan Penjualan" />
          <View style={styles.summary}>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total Penjualan</Text><Text style={styles.summaryValue}>{formatRupiah(total)}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Bagian Supplier</Text><Text style={styles.summaryValue}>{formatRupiah(supplierTotal)}</Text></View>
            <Divider />
            <View style={styles.summaryRow}><Text style={styles.totalLabel}>Margin Toko</Text><Text style={styles.profit}>{formatRupiah(storeProfit)}</Text></View>
          </View>
        </Card>
        <AppButton title="Simpan Transaksi" icon="checkmark-circle-outline" onPress={save} disabled={cart.length === 0} loading={submitting} />
      </View>

      <Modal transparent animationType="slide" visible={pickerVisible} onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Pilih Barang</Text>
              <Pressable onPress={() => setPickerVisible(false)}>
                <Ionicons name="close" size={26} color={colors.text} />
              </Pressable>
            </View>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Cari barang..." />
            {loading ? (
              <View style={styles.sheetLoading}><Ionicons name="hourglass-outline" size={20} color={colors.textMuted} /><Text style={styles.sheetLoadingText}>Memuat daftar barang...</Text></View>
            ) : (
              <ScrollView contentContainerStyle={styles.productList} keyboardShouldPersistTaps="handled">
                {available.map((product) => (
                  <Pressable key={product.id} style={styles.productRow} onPress={() => addProduct(product)}>
                    <View style={styles.itemIcon}>
                      {product.imageUrl ? <Image source={{ uri: product.imageUrl }} style={styles.itemImage} /> : <Ionicons name="cube-outline" size={23} color={colors.primaryDark} />}
                    </View>
                    <View style={styles.itemBody}>
                      <Text style={styles.itemName}>{product.name}</Text>
                      <Text style={styles.itemMeta}>{product.supplierBusinessName || product.supplierName} · Stok {product.currentStock}</Text>
                    </View>
                    <Text style={styles.productPrice}>{formatRupiah(Number(product.sellPrice))}</Text>
                  </Pressable>
                ))}
                {!available.length ? <EmptyState icon="cube-outline" title="Tidak ada barang siap dijual" description="Pastikan stok barang masih tersedia." /> : null}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  cartList: { gap: spacing.md },
  itemTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  itemIcon: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemBody: { flex: 1 },
  itemName: { color: colors.text, fontWeight: '800' },
  itemMeta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  quantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.input, borderRadius: radius.md, overflow: 'hidden' },
  stepButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  quantity: { minWidth: 34, textAlign: 'center', fontWeight: '800', color: colors.text },
  itemTotal: { color: colors.primaryDark, fontWeight: '800', fontSize: 16 },
  summary: { gap: spacing.md, marginTop: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg },
  summaryLabel: { color: colors.textMuted },
  summaryValue: { color: colors.text, fontWeight: '700' },
  totalLabel: { color: colors.text, fontWeight: '800' },
  profit: { color: colors.primaryDark, fontSize: 18, fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { maxHeight: '78%', backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xxl, paddingBottom: 34 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  sheetLoading: { paddingVertical: spacing.xl, alignItems: 'center', gap: spacing.sm },
  sheetLoadingText: { color: colors.textMuted, fontSize: 13 },
  productList: { paddingTop: spacing.md, gap: spacing.xs },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  productPrice: { color: colors.primaryDark, fontWeight: '800', fontSize: 13 },
});
