import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppInput, AppScreen } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { authClient } from '@/lib/auth-client';

export default function LoginScreen() {
  const router = useRouter();
  const { session, ready, refreshSession } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (session) {
      router.replace('/home');
    }
  }, [router, session]);

  const login = async () => {
    if (!email || !password) {
      showToast({ title: 'Data belum lengkap', message: 'Email dan kata sandi wajib diisi.', tone: 'error' });
      return;
    }
    if (!ready) {
      showToast({ title: 'Auth belum siap', message: 'Isi konfigurasi backend auth di file environment terlebih dahulu.', tone: 'error' });
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message ?? 'Email atau kata sandi tidak valid.');
        return;
      }

      await refreshSession();
      showToast({ title: 'Login berhasil', message: 'Selamat datang kembali.', tone: 'success' });
      router.replace('/home');
    } catch {
      showToast({ title: 'Login gagal', message: 'Tidak dapat terhubung ke server autentikasi.', tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <View style={styles.content}>
        <View style={styles.logo}><Ionicons name="bag-handle" size={58} color={colors.primary} /></View>
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Masuk ke akun KonsinyasiKu Anda</Text>
        <View style={styles.form}>
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}
          <AppInput label="Email" value={email} onChangeText={(value) => { setEmail(value); if (errorMessage) setErrorMessage(''); }} placeholder="nama@email.com" keyboardType="email-address" autoCapitalize="none" icon="mail-outline" />
          <View>
            <AppInput label="Kata Sandi" value={password} onChangeText={(value) => { setPassword(value); if (errorMessage) setErrorMessage(''); }} placeholder="Minimal 8 karakter" secureTextEntry={!showPassword} icon="lock-closed-outline" />
            <Pressable style={styles.eye} onPress={() => setShowPassword((value) => !value)}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} /></Pressable>
          </View>
          <Pressable onPress={() => showToast({ title: 'Fitur belum tersedia', message: 'Pemulihan kata sandi belum dihubungkan ke backend autentikasi.', tone: 'info' })}><Text style={styles.forgot}>Lupa kata sandi?</Text></Pressable>
          <AppButton title="Masuk" onPress={login} icon="log-in-outline" loading={submitting} />
        </View>
      </View>
      <Text style={styles.footer}>Belum punya akun? <Link href="/register" style={styles.link}>Daftar sekarang</Link></Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing.xxl },
  content: { flex: 1, justifyContent: 'center' },
  logo: { width: 112, height: 112, borderRadius: radius.xl, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
  form: { marginTop: 36, gap: spacing.lg },
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
  eye: { position: 'absolute', right: 14, bottom: 15 },
  forgot: { color: colors.primaryDark, textAlign: 'right', fontWeight: '600', marginTop: -6 },
  footer: { textAlign: 'center', color: colors.textMuted, paddingVertical: spacing.lg },
  link: { color: colors.primaryDark, fontWeight: '700' },
});
