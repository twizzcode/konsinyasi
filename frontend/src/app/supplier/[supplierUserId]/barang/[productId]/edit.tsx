import { useLocalSearchParams } from 'expo-router';
import { ProductForm } from '@/components/ProductForm';
import { useAuth } from '@/context/AuthContext';
import { apiPut } from '@/lib/api';
import { removeStorageFileByPublicUrl, uploadImageAsset } from '@/lib/storage';
import type { AuthUserProfile } from '@/types/auth';
import type { Product } from '@/types';

export default function EditSupplierProductScreen() {
  const { user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const params = useLocalSearchParams<{
    supplierUserId: string;
    productId: string;
    name?: string;
    businessName?: string;
    email?: string;
    productName?: string;
    sellPrice?: string;
    supplierPrice?: string;
    initialQuantity?: string;
    currentStock?: string;
    imageUrl?: string;
  }>();

  const supplierName = params.businessName || params.name || 'Supplier';
  const subtitle = [params.name && params.businessName ? `PIC: ${params.name}` : null, params.email].filter(Boolean).join(' · ');
  const sellPrice = Number(params.sellPrice ?? 0);
  const supplierPrice = Number(params.supplierPrice ?? 0);
  const supplierPercent = sellPrice > 0 ? Number(((supplierPrice / sellPrice) * 100).toFixed(2)) : 0;
  const storePercent = Number((100 - supplierPercent).toFixed(2));
  const initialQuantity = Number(params.initialQuantity ?? 0);
  const currentStock = Number(params.currentStock ?? initialQuantity);

  const product: Product = {
    id: params.productId,
    name: params.productName ?? '',
    supplierId: params.supplierUserId,
    supplierName,
    price: sellPrice,
    supplierPrice,
    supplierPercent,
    storePercent,
    stock: currentStock,
    minStock: 0,
    category: 'Titipan Supplier',
    imageUri: params.imageUrl || undefined,
  };

  return (
    <ProductForm
      product={product}
      consignmentValues={{
        quantity: initialQuantity,
        currentStock,
      }}
      fixedSupplier={{
        id: params.supplierUserId,
        name: supplierName,
        subtitle,
      }}
      onSaveProduct={async (payload) => {
        if (!profile.id) {
          throw new Error('Store account not found');
        }

        let imageUrl: string | undefined | null = params.imageUrl ?? null;

        if (!payload.imageUri) {
          if (params.imageUrl) {
            await removeStorageFileByPublicUrl(params.imageUrl).catch(() => {});
          }
          imageUrl = null;
        } else if (payload.imageUri.startsWith('http://') || payload.imageUri.startsWith('https://')) {
          imageUrl = payload.imageUri;
        } else {
          if (params.imageUrl) {
            await removeStorageFileByPublicUrl(params.imageUrl).catch(() => {});
          }
          const uploaded = await uploadImageAsset({
            fileUri: payload.imageUri,
            folder: `products/${profile.id}`,
            fileName: `${params.productId}-${Date.now()}.jpg`,
            upsert: true,
          });
          imageUrl = uploaded.publicUrl;
        }

        await apiPut(`/api/stores/${profile.id}/suppliers/${params.supplierUserId}/products/${params.productId}`, {
          name: payload.name,
          sellPrice: payload.price,
          supplierPrice: payload.supplierPrice,
          imageUrl,
          quantity: payload.quantity,
          currentStock: payload.currentStock,
        });
      }}
      successRedirect={`/supplier/${params.supplierUserId}?name=${encodeURIComponent(params.name ?? '')}&businessName=${encodeURIComponent(params.businessName ?? '')}&email=${encodeURIComponent(params.email ?? '')}`}
    />
  );
}
