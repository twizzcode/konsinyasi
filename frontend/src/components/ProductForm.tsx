import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppButton, AppInput, AppScreen, BackButton, HeroHeader, SelectField } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import type { Product } from '@/types';

interface FixedSupplier {
  id: string;
  name: string;
  subtitle?: string;
}

export function ProductForm({
  product,
  fixedSupplier,
  successRedirect,
  onSaveProduct,
  consignmentValues,
}: {
  product?: Product;
  fixedSupplier?: FixedSupplier;
  successRedirect?: string;
  onSaveProduct?: (payload: {
    name: string;
    supplierId: string;
    supplierName?: string;
    price: number;
    supplierPrice: number;
    supplierPercent: number;
    storePercent: number;
    stock: number;
    minStock: number;
    category: string;
    imageUri?: string;
    quantity?: number;
    currentStock?: number;
  }) => Promise<void>;
  consignmentValues?: {
    quantity: number;
    currentStock: number;
  };
}) {
  const router = useRouter();
  const { suppliers, addProduct, updateProduct } = useApp();
  const { showToast } = useToast();
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name ?? '');
  const [supplierId, setSupplierId] = useState(product?.supplierId ?? fixedSupplier?.id ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [supplierPrice, setSupplierPrice] = useState(product ? String(product.supplierPrice) : '');
  const [imageUri, setImageUri] = useState(product?.imageUri);
  const [quantity, setQuantity] = useState(
    consignmentValues ? String(consignmentValues.quantity) : product ? String(product.stock || 0) : '',
  );
  const [currentStock, setCurrentStock] = useState(
    consignmentValues ? String(consignmentValues.currentStock) : product ? String(product.stock || 0) : '',
  );
  const [submitting, setSubmitting] = useState(false);
  const isSupplierConsignmentFlow = Boolean(fixedSupplier && onSaveProduct);
  const isAddSupplierConsignmentFlow = isSupplierConsignmentFlow && !isEdit;

  useEffect(() => {
    if (fixedSupplier?.id) setSupplierId(fixedSupplier.id);
  }, [fixedSupplier?.id]);

  const supplierOptions = useMemo(() => suppliers.map((item) => ({ label: item.name, value: item.id, description: item.phone })), [suppliers]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast({ title: 'Izin diperlukan', message: 'Akses galeri diperlukan untuk memilih foto barang.', tone: 'error' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.75, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const removeImage = () => setImageUri(undefined);

  const save = () => {
    void (async () => {
    if (!name.trim() || !supplierId || !price) {
      showToast({ title: 'Data belum lengkap', message: 'Nama, penitip, dan harga jual wajib diisi.', tone: 'error' });
      return;
    }
    if (isSupplierConsignmentFlow && !quantity) {
      showToast({ title: 'Data belum lengkap', message: 'Stok wajib diisi.', tone: 'error' });
      return;
    }

    const parsedPrice = Number(price);
    const parsedSupplierPrice = Number(supplierPrice || 0);
    const parsedQuantity = Number(quantity || 0);
    const parsedCurrentStock = Number(currentStock || quantity || 0);
    const supplierPercent = parsedPrice > 0 ? Number(((parsedSupplierPrice / parsedPrice) * 100).toFixed(2)) : 0;
    const storePercent = Number((100 - supplierPercent).toFixed(2));

    const payload = {
      name: name.trim(),
      supplierId,
      supplierName: fixedSupplier?.name,
      price: parsedPrice,
      supplierPrice: parsedSupplierPrice,
      supplierPercent,
      storePercent,
      stock: product?.stock ?? 0,
      minStock: product?.minStock ?? 0,
      category: product?.category ?? 'Titipan Supplier',
      imageUri,
      quantity: parsedQuantity,
      currentStock: parsedCurrentStock,
    };
    try {
      setSubmitting(true);
      if (onSaveProduct) await onSaveProduct(payload);
      else if (product) updateProduct(product.id, payload);
      else addProduct(payload);
      showToast({
        title: isEdit ? 'Barang diperbarui' : 'Barang ditambahkan',
        message: `Data barang berhasil ${isEdit ? 'disimpan ulang' : 'ditambahkan'} ke sistem.`,
        tone: 'success',
      });
      router.replace((successRedirect ?? '/barang') as never);
    } catch (error) {
      showToast({
        title: 'Gagal menyimpan barang',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
    })();
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title={isEdit ? 'Edit Barang' : 'Tambah Barang Baru'} leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.form}>
        <View style={styles.fieldGap}>
          <Text style={styles.label}>Foto Barang</Text>
          <Pressable style={styles.photoBox} onPress={pickImage}>
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.photo} />
                <Pressable style={styles.removePhotoButton} onPress={removeImage} hitSlop={10}>
                  <Ionicons name="close" size={18} color={colors.white} />
                </Pressable>
              </>
            ) : (
              <><Ionicons name="camera-outline" size={34} color={colors.textMuted} /><Text style={styles.photoText}>Pilih foto dari galeri</Text></>
            )}
          </Pressable>
        </View>
        <AppInput label="Nama Barang" value={name} onChangeText={setName} placeholder="Contoh: Minyak Goreng 1L" icon="cube-outline" />
        {fixedSupplier ? (
          <View style={styles.fixedSupplierCard}>
            <Text style={styles.fixedSupplierLabel}>Supplier</Text>
            <Text style={styles.fixedSupplierName}>{fixedSupplier.name}</Text>
            {fixedSupplier.subtitle ? <Text style={styles.fixedSupplierSubtitle}>{fixedSupplier.subtitle}</Text> : null}
          </View>
        ) : (
          <SelectField label="Penitip" value={supplierId} onChange={setSupplierId} options={supplierOptions} placeholder="Pilih penitip" />
        )}
        <AppInput label="Harga Jual" value={price} onChangeText={setPrice} placeholder="15000" keyboardType="number-pad" icon="cash-outline" />
        <AppInput label="Harga/Bagian Penitip" value={supplierPrice} onChangeText={setSupplierPrice} placeholder="12000" keyboardType="number-pad" icon="wallet-outline" />
        {isSupplierConsignmentFlow ? (
          <>
            <AppInput
              label="Stok"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="10"
              keyboardType="number-pad"
              icon="layers-outline"
            />
            {!isAddSupplierConsignmentFlow ? (
              <AppInput
                label="Sisa Stok Saat Ini"
                value={currentStock}
                onChangeText={setCurrentStock}
                placeholder="10"
                keyboardType="number-pad"
                icon="archive-outline"
              />
            ) : null}
          </>
        ) : null}
        <AppButton title={isEdit ? 'Simpan Perubahan' : 'Simpan Barang'} icon="save-outline" onPress={save} style={styles.saveButton} loading={submitting} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 40 },
  form: { padding: spacing.xxl, gap: spacing.lg },
  fieldGap: { gap: spacing.sm },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  photoBox: { width: '100%', aspectRatio: 1, backgroundColor: colors.input, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  photoText: { color: colors.textMuted, fontSize: 14 },
  removePhotoButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(17,24,39,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: { marginTop: spacing.sm },
  fixedSupplierCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    padding: spacing.lg,
    gap: 4,
  },
  fixedSupplierLabel: { color: colors.primaryDark, fontSize: 12, fontWeight: '700' },
  fixedSupplierName: { color: colors.text, fontSize: 16, fontWeight: '800' },
  fixedSupplierSubtitle: { color: colors.textMuted, fontSize: 12 },
});
