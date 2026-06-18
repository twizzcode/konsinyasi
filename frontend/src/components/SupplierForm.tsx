import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, AppInput, AppScreen, BackButton, HeroHeader } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import type { Supplier } from '@/types';

export function SupplierForm({ supplier }: { supplier?: Supplier }) {
  const router = useRouter();
  const { addSupplier, updateSupplier } = useApp();
  const { showToast } = useToast();
  const [name, setName] = useState(supplier?.name ?? '');
  const [phone, setPhone] = useState(supplier?.phone ?? '');
  const [address, setAddress] = useState(supplier?.address ?? '');

  const save = () => {
    if (!name.trim() || !phone.trim()) {
      showToast({ title: 'Data belum lengkap', message: 'Nama dan nomor telepon wajib diisi.', tone: 'error' });
      return;
    }
    const payload = { name: name.trim(), phone: phone.trim(), address: address.trim() };
    if (supplier) updateSupplier(supplier.id, payload);
    else addSupplier(payload);
    showToast({
      title: supplier ? 'Penitip diperbarui' : 'Penitip ditambahkan',
      message: `Data penitip berhasil ${supplier ? 'diperbarui' : 'ditambahkan'}.`,
      tone: 'success',
    });
    router.replace('/penitip');
  };

  return (
    <AppScreen>
      <HeroHeader title={supplier ? 'Edit Penitip' : 'Tambah Penitip'} leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.form}>
        <AppInput label="Nama Penitip" value={name} onChangeText={setName} placeholder="Nama lengkap" icon="person-outline" />
        <AppInput label="Nomor Telepon" value={phone} onChangeText={setPhone} placeholder="08xxxxxxxxxx" keyboardType="phone-pad" icon="call-outline" />
        <AppInput label="Alamat" value={address} onChangeText={setAddress} placeholder="Alamat lengkap" multiline icon="location-outline" />
        <AppButton title={supplier ? 'Simpan Perubahan' : 'Simpan Penitip'} onPress={save} icon="save-outline" />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({ form: { padding: spacing.xxl, gap: spacing.lg } });
