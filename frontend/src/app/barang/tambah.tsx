import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppScreen, BackButton, Card, HeroHeader } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import type { AuthUserProfile } from '@/types/auth';

export default function AddProductScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const isStore = profile.accountType === 'store';

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader
        title="Tambah Barang"
        subtitle={isStore ? 'Barang baru sekarang ditambahkan dari supplier yang sudah terhubung.' : 'Halaman ini tersedia untuk akun toko.'}
        leftAction={<BackButton onPress={() => router.back()} />}
      />
      <View style={styles.content}>
        <Card>
          <View style={styles.iconWrap}>
            <Ionicons name="git-network-outline" size={30} color={colors.primaryDark} />
          </View>
          <Text style={styles.title}>Alur barang sudah diperbarui</Text>
          <Text style={styles.description}>
            {isStore
              ? 'Pilih supplier dulu, lalu tambahkan barang titipan dari halaman detail supplier. Setelah itu stok berikutnya ditambah lewat menu Tambah Stok.'
              : 'Masuk dengan akun toko untuk mengelola supplier, barang titipan, dan stok toko.'}
          </Text>
        </Card>

        {isStore ? (
          <>
            <AppButton title="Buka Menu Supplier" icon="people-outline" onPress={() => router.replace('/supplier')} />
            <AppButton title="Tambah Stok" icon="layers-outline" variant="outline" onPress={() => router.replace('/stok/tambah')} />
          </>
        ) : (
          <AppButton title="Kembali" icon="arrow-back-outline" onPress={() => router.back()} />
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  description: { color: colors.textMuted, fontSize: 14, lineHeight: 22, marginTop: spacing.sm },
});
