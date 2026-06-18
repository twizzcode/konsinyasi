import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppButton, AppInput, AppScreen, BackButton, Card, HeroHeader } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiPost } from '@/lib/api';
import type { AuthUserProfile } from '@/types/auth';

export default function TakeBackProductScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const params = useLocalSearchParams<{
    supplierUserId: string;
    productId: string;
    productName?: string;
    currentStock?: string;
  }>();

  const currentStock = Number(params.currentStock ?? 0);
  const [quantity, setQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fillAll = () => setQuantity(String(currentStock));

  const save = async () => {
    const parsedQuantity = Number(quantity);

    if (!parsedQuantity || parsedQuantity <= 0) {
      showToast({ title: 'Jumlah tidak valid', message: 'Masukkan jumlah barang yang akan diambil kembali.', tone: 'error' });
      return;
    }

    if (parsedQuantity > currentStock) {
      showToast({ title: 'Jumlah melebihi stok', message: 'Jumlah yang diambil tidak boleh melebihi sisa stok di toko.', tone: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await apiPost(`/api/stores/${profile.id}/suppliers/${params.supplierUserId}/products/${params.productId}/remove-stock`, {
        quantity: parsedQuantity,
      });
      showToast({ title: 'Barang berhasil diambil', message: 'Stok titipan sudah diperbarui dan masuk ke histori.', tone: 'success' });
      router.back();
    } catch (error) {
      showToast({ title: 'Gagal mengambil barang', message: error instanceof Error ? error.message : 'Terjadi kesalahan.', tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Ambil Barang Kembali" subtitle={params.productName || 'Barang titipan'} leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <Card>
          <Text style={styles.label}>Sisa stok di toko</Text>
          <Text style={styles.stockValue}>{currentStock} unit</Text>
          <Text style={styles.meta}>Isi jumlah barang yang mau diambil supplier. Bisa sebagian atau semua.</Text>
        </Card>
        <AppInput
          label="Jumlah Diambil"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="3"
          keyboardType="number-pad"
          icon="remove-outline"
        />
        <Text style={styles.fillAll} onPress={fillAll}>Ambil semua</Text>
        <AppButton title="Simpan Pengambilan" icon="remove-outline" onPress={save} loading={submitting} disabled={currentStock <= 0} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  label: { color: colors.textMuted, fontSize: 13 },
  stockValue: { color: colors.warning, fontSize: 28, fontWeight: '800', marginTop: spacing.sm },
  meta: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  fillAll: { color: colors.primaryDark, fontSize: 13, fontWeight: '700', marginTop: -4 },
});
