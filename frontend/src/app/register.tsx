import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppInput, AppScreen, BackButton } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { authClient } from '@/lib/auth-client';
import type { AccountType } from '@/types/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const { session, ready, refreshSession } = useAuth();
  const { showToast } = useToast();
  const [accountType, setAccountType] = useState<AccountType>('store');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const businessLabel = accountType === 'store' ? 'Nama Toko' : 'Nama Penyuplai';
  const businessPlaceholder = accountType === 'store' ? 'Nama usaha' : 'Nama bisnis atau brand';
  const ownerLabel = accountType === 'store' ? 'Nama Pemilik' : 'Nama PIC';

  useEffect(() => {
    if (session) {
      router.replace('/home');
    }
  }, [router, session]);

  const register = async () => {
    if (!name || !businessName || !email || !password) {
      showToast({ title: 'Data belum lengkap', message: 'Semua data utama wajib diisi.', tone: 'error' });
      return;
    }
    if (password !== confirm) {
      showToast({ title: 'Kata sandi tidak cocok', message: 'Konfirmasi kata sandi harus sama.', tone: 'error' });
      return;
    }
    if (!ready) {
      showToast({ title: 'Auth belum siap', message: 'Isi konfigurasi backend auth di file environment terlebih dahulu.', tone: 'error' });
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const { error } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
        accountType,
        businessName: businessName.trim(),
      } as never);

      if (error) {
        setErrorMessage(error.message ?? 'Akun tidak dapat dibuat.');
        return;
      }

      await refreshSession();
      showToast({
        title: 'Akun berhasil dibuat',
        message: `Akun ${accountType === 'store' ? 'toko' : 'penyuplai'} untuk ${businessName.trim()} sudah aktif.`,
        tone: 'success',
      });
      router.replace('/home');
    } catch {
      showToast({ title: 'Pendaftaran gagal', message: 'Tidak dapat terhubung ke server autentikasi.', tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <BackButton onPress={() => router.back()} light={false} />
      <Text style={styles.title}>Buat Akun Baru</Text>
      <Text style={styles.subtitle}>Pilih jenis akun lebih dulu, lalu siapkan profil usaha yang akan memakai aplikasi.</Text>
      <View style={styles.form}>
        <View style={styles.accountTypeRow}>
          <Pressable
            onPress={() => setAccountType('store')}
            style={({ pressed }) => [
              styles.accountTypeCard,
              accountType === 'store' && styles.accountTypeCardActive,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="storefront-outline" size={24} color={accountType === 'store' ? colors.primaryDark : colors.textMuted} />
            <Text style={[styles.accountTypeTitle, accountType === 'store' && styles.accountTypeTitleActive]}>Toko</Text>
            <Text style={styles.accountTypeSubtitle}>Untuk pemilik usaha konsinyasi</Text>
          </Pressable>
          <Pressable
            onPress={() => setAccountType('supplier')}
            style={({ pressed }) => [
              styles.accountTypeCard,
              accountType === 'supplier' && styles.accountTypeCardActive,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="cube-outline" size={24} color={accountType === 'supplier' ? colors.primaryDark : colors.textMuted} />
            <Text style={[styles.accountTypeTitle, accountType === 'supplier' && styles.accountTypeTitleActive]}>Penyuplai</Text>
            <Text style={styles.accountTypeSubtitle}>Untuk penitip atau pemasok barang</Text>
          </Pressable>
        </View>
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}
        <AppInput label={ownerLabel} value={name} onChangeText={(value) => { setName(value); if (errorMessage) setErrorMessage(''); }} placeholder="Nama lengkap" icon="person-outline" />
        <AppInput label={businessLabel} value={businessName} onChangeText={(value) => { setBusinessName(value); if (errorMessage) setErrorMessage(''); }} placeholder={businessPlaceholder} icon={accountType === 'store' ? 'storefront-outline' : 'briefcase-outline'} />
        <AppInput label="Email" value={email} onChangeText={(value) => { setEmail(value); if (errorMessage) setErrorMessage(''); }} placeholder="nama@email.com" keyboardType="email-address" autoCapitalize="none" icon="mail-outline" />
        <AppInput label="Kata Sandi" value={password} onChangeText={(value) => { setPassword(value); if (errorMessage) setErrorMessage(''); }} placeholder="Minimal 8 karakter" secureTextEntry icon="lock-closed-outline" />
        <AppInput label="Konfirmasi Kata Sandi" value={confirm} onChangeText={(value) => { setConfirm(value); if (errorMessage) setErrorMessage(''); }} placeholder="Ulangi kata sandi" secureTextEntry icon="shield-checkmark-outline" />
        <AppButton title="Daftar" onPress={register} icon="person-add-outline" loading={submitting} />
      </View>
      <Text style={styles.footer}>Sudah punya akun? <Link href="/login" style={styles.link}>Masuk</Link></Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing.xxl },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, marginTop: spacing.xxl },
  subtitle: { color: colors.textMuted, lineHeight: 21, marginTop: spacing.sm },
  form: { gap: spacing.lg, marginTop: spacing.xxl },
  accountTypeRow: { flexDirection: 'row', gap: spacing.md },
  accountTypeCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  accountTypeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  accountTypeTitle: { color: colors.text, fontWeight: '800', fontSize: 15 },
  accountTypeTitleActive: { color: colors.primaryDark },
  accountTypeSubtitle: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  errorBanner: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBannerText: { flex: 1, color: colors.danger, fontWeight: '600' },
  pressed: { opacity: 0.78 },
  footer: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xxl },
  link: { color: colors.primaryDark, fontWeight: '700' },
});
