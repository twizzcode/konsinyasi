import { useLocalSearchParams } from 'expo-router';
import { ProductForm } from '@/components/ProductForm';
import { useAuth } from '@/context/AuthContext';
import { apiPost } from '@/lib/api';
import { uploadImageAsset } from '@/lib/storage';
import type { AuthUserProfile } from '@/types/auth';

export default function AddSupplierProductScreen() {
  const { user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const params = useLocalSearchParams<{
    supplierUserId: string;
    name?: string;
    businessName?: string;
    email?: string;
  }>();

  const supplierName = params.businessName || params.name || 'Supplier';
  const subtitle = [params.name && params.businessName ? `PIC: ${params.name}` : null, params.email].filter(Boolean).join(' · ');

  return (
    <ProductForm
      fixedSupplier={{
        id: params.supplierUserId,
        name: supplierName,
        subtitle,
      }}
      onSaveProduct={async (payload) => {
        if (!profile.id) {
          throw new Error('Store account not found');
        }

        let imageUrl: string | undefined;

        if (payload.imageUri) {
          if (payload.imageUri.startsWith('http://') || payload.imageUri.startsWith('https://')) {
            imageUrl = payload.imageUri;
          } else {
            const uploaded = await uploadImageAsset({
              fileUri: payload.imageUri,
              folder: `products/${profile.id}`,
              fileName: `${params.supplierUserId}-${Date.now()}.jpg`,
              upsert: true,
            });
            imageUrl = uploaded.publicUrl;
          }
        }

        await apiPost(`/api/stores/${profile.id}/suppliers/${params.supplierUserId}/products`, {
          name: payload.name,
          sellPrice: payload.price,
          supplierPrice: payload.supplierPrice,
          imageUrl,
          quantity: payload.quantity,
        });
      }}
      successRedirect={`/supplier/${params.supplierUserId}?name=${encodeURIComponent(params.name ?? '')}&businessName=${encodeURIComponent(params.businessName ?? '')}&email=${encodeURIComponent(params.email ?? '')}`}
    />
  );
}
