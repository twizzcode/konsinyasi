import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ProductForm } from '@/components/ProductForm';
import { AppScreen, BackButton, EmptyState, HeroHeader } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { apiGet, apiPut } from '@/lib/api';
import { removeStorageFileByPublicUrl, uploadImageAsset } from '@/lib/storage';
import type { AuthUserProfile, StoreProduct } from '@/types/auth';
import type { Product } from '@/types';

export default function EditProductScreen() {
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
        <HeroHeader title="Edit Barang" leftAction={<BackButton onPress={() => router.back()} />} />
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      </AppScreen>
    );
  }

  if (!product) {
    return (
      <AppScreen>
        <HeroHeader title="Edit Barang" leftAction={<BackButton onPress={() => router.back()} />} />
        <EmptyState icon="alert-circle-outline" title="Barang tidak ditemukan" />
      </AppScreen>
    );
  }

  const supplierName = product.supplierBusinessName || product.supplierName;
  const subtitle = [product.supplierBusinessName ? `PIC: ${product.supplierName}` : null, product.supplierEmail].filter(Boolean).join(' · ');
  const supplierPercent = Number(product.sellPrice) > 0
    ? Number(((Number(product.supplierPrice) / Number(product.sellPrice)) * 100).toFixed(2))
    : 0;

  const formProduct: Product = {
    id: product.id,
    name: product.name,
    supplierId: product.supplierUserId,
    supplierName,
    price: Number(product.sellPrice),
    supplierPrice: Number(product.supplierPrice),
    supplierPercent,
    storePercent: Number((100 - supplierPercent).toFixed(2)),
    stock: Number(product.currentStock),
    minStock: 0,
    category: 'Titipan Supplier',
    imageUri: product.imageUrl ?? undefined,
  };

  return (
    <ProductForm
      product={formProduct}
      consignmentValues={{
        quantity: Number(product.initialQuantity),
        currentStock: Number(product.currentStock),
      }}
      fixedSupplier={{
        id: product.supplierUserId,
        name: supplierName,
        subtitle,
      }}
      onSaveProduct={async (payload) => {
        if (!profile.id) {
          throw new Error('Store account not found');
        }

        let imageUrl: string | undefined | null = product.imageUrl ?? null;

        if (!payload.imageUri) {
          if (product.imageUrl) {
            await removeStorageFileByPublicUrl(product.imageUrl).catch(() => {});
          }
          imageUrl = null;
        } else if (payload.imageUri.startsWith('http://') || payload.imageUri.startsWith('https://')) {
          imageUrl = payload.imageUri;
        } else {
          if (product.imageUrl) {
            await removeStorageFileByPublicUrl(product.imageUrl).catch(() => {});
          }
          const uploaded = await uploadImageAsset({
            fileUri: payload.imageUri,
            folder: `products/${profile.id}`,
            fileName: `${product.id}-${Date.now()}.jpg`,
            upsert: true,
          });
          imageUrl = uploaded.publicUrl;
        }

        await apiPut(`/api/stores/${profile.id}/suppliers/${product.supplierUserId}/products/${product.id}`, {
          name: payload.name,
          sellPrice: payload.price,
          supplierPrice: payload.supplierPrice,
          imageUrl,
          quantity: payload.quantity,
          currentStock: payload.currentStock,
        });
      }}
      successRedirect={`/barang/${product.id}`}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
});
