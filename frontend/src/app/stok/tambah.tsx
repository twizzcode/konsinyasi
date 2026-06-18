import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, AppInput, AppScreen, BackButton, HeroHeader, SelectField } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiGet, apiPost } from '@/lib/api';
import type { AuthUserProfile, LinkedSupplier, SupplierProduct } from '@/types/auth';

export default function AddStockScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const storeUserId = profile.id ?? '';

  const [suppliers, setSuppliers] = useState<LinkedSupplier[]>([]);
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [supplierUserId, setSupplierUserId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!storeUserId) {
        setLoadingSuppliers(false);
        return;
      }

      try {
        const response = await apiGet<{ data: LinkedSupplier[] }>(`/api/stores/${storeUserId}/suppliers`);
        if (active) setSuppliers(response.data);
      } catch {
        if (active) setSuppliers([]);
      } finally {
        if (active) setLoadingSuppliers(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [storeUserId]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!storeUserId || !supplierUserId) {
        setProducts([]);
        setProductId('');
        return;
      }

      setLoadingProducts(true);
      try {
        const response = await apiGet<{ data: SupplierProduct[] }>(`/api/stores/${storeUserId}/suppliers/${supplierUserId}/products`);
        if (active) {
          setProducts(response.data);
          setProductId('');
        }
      } catch {
        if (active) {
          setProducts([]);
          setProductId('');
        }
      } finally {
        if (active) setLoadingProducts(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [storeUserId, supplierUserId]);

  const supplierOptions = useMemo(
    () => suppliers.map((item) => ({
      label: item.businessName ?? item.name,
      value: item.supplierUserId,
      description: item.email,
    })),
    [suppliers],
  );

  const productOptions = useMemo(
    () => products.map((item) => ({
      label: item.name,
      value: item.id,
      description: `Sisa stok ${item.currentStock}`,
    })),
    [products],
  );

  const selectedProduct = products.find((item) => item.id === productId);

  const save = async () => {
    if (!supplierUserId || !productId || !quantity) {
      showToast({ title: 'Data belum lengkap', message: 'Pilih supplier, barang, dan jumlah tambahan stok.', tone: 'error' });
      return;
    }

    const parsedQuantity = Number(quantity);
    if (parsedQuantity <= 0) {
      showToast({ title: 'Jumlah tidak valid', message: 'Jumlah tambahan stok harus lebih dari 0.', tone: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await apiPost(`/api/stores/${storeUserId}/suppliers/${supplierUserId}/products/${productId}/add-stock`, {
        quantity: parsedQuantity,
      });
      showToast({ title: 'Stok ditambahkan', message: 'Jumlah stok barang sudah diperbarui.', tone: 'success' });
      router.back();
    } catch (error) {
      showToast({ title: 'Gagal menambah stok', message: error instanceof Error ? error.message : 'Terjadi kesalahan.', tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Tambah Stok" subtitle="Pilih supplier dan barang yang stoknya ingin ditambah" leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <SelectField
          label="Supplier"
          value={supplierUserId}
          onChange={setSupplierUserId}
          options={supplierOptions}
          placeholder={loadingSuppliers ? 'Memuat supplier...' : 'Pilih supplier'}
        />
        <SelectField
          label="Barang"
          value={productId}
          onChange={setProductId}
          options={productOptions}
          placeholder={loadingProducts ? 'Memuat barang...' : 'Pilih barang'}
        />
        {selectedProduct ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>{selectedProduct.name}</Text>
            <Text style={styles.infoText}>Sisa stok saat ini: {selectedProduct.currentStock}</Text>
            <Text style={styles.infoText}>Total titipan awal: {selectedProduct.initialQuantity}</Text>
          </View>
        ) : null}
        <AppInput label="Jumlah Tambahan" value={quantity} onChangeText={setQuantity} placeholder="5" keyboardType="number-pad" icon="add-outline" />
        <AppButton title="Simpan Tambahan Stok" icon="save-outline" onPress={save} loading={submitting} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  infoBox: { backgroundColor: colors.primarySoft, borderRadius: 16, padding: spacing.lg, gap: 4 },
  infoTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  infoText: { color: colors.textMuted, fontSize: 12 },
});
