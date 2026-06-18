import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen, Card, HeroHeader } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import type { AuthUserProfile } from '@/types/auth';

const storeMenus = [
  { title: 'Pengaturan Akun', subtitle: 'Ubah profil dan kata sandi', icon: 'settings-outline' as const, href: '/profil/pengaturan' as const },
  { title: 'Bantuan', subtitle: 'FAQ dan panduan penggunaan', icon: 'help-circle-outline' as const, href: '/profil/bantuan' as const },
];

const supplierMenus = [
  { title: 'Pengaturan Akun', subtitle: 'Ubah profil penyuplai dan kata sandi', icon: 'settings-outline' as const, href: '/profil/pengaturan' as const },
  { title: 'Bantuan Kemitraan', subtitle: 'Lihat panduan titip jual dan bantuan akun', icon: 'help-circle-outline' as const, href: '/profil/bantuan' as const },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const profile = (user ?? {}) as AuthUserProfile;
  const isStore = profile.accountType === 'store';
  const isSupplier = profile.accountType === 'supplier';
  const businessLabel = isStore ? 'Akun Toko' : isSupplier ? 'Akun Penyuplai' : 'Tipe Akun Belum Diset';
  const avatarLabel = (profile.businessName ?? profile.name ?? 'P').charAt(0).toUpperCase();
  const heroSubtitle = isStore
    ? 'Kelola akun dan akses aplikasi'
    : isSupplier
      ? 'Kelola akun penyuplai dan informasi kemitraan'
      : 'Lengkapi data akun agar menu tampil sesuai tipe pengguna';
  const menus = isStore ? storeMenus : supplierMenus;

  const handleLogout = async () => {
    setLogoutVisible(false);
    await signOut();
    requestAnimationFrame(() => router.replace('/login'));
  };

  return (
    <>
      <AppScreen contentStyle={styles.page}>
        <HeroHeader title="Profil" subtitle={heroSubtitle} />
        <View style={styles.content}>
          <Card style={styles.profileCard}>
            <View style={styles.avatar}>
              {profile.image ? <Image source={{ uri: profile.image }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{avatarLabel}</Text>}
            </View>
            <Text style={styles.name}>{profile.businessName ?? profile.name ?? 'Pengguna'}</Text>
            <Text style={styles.email}>{profile.email ?? 'Email belum tersedia'}</Text>
            <View style={styles.role}><Text style={styles.roleText}>{businessLabel}</Text></View>
          </Card>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryIcon}>
                <Ionicons name={isStore ? 'storefront-outline' : 'cube-outline'} size={22} color={colors.primaryDark} />
              </View>
              <View style={styles.summaryBody}>
                <Text style={styles.summaryTitle}>{isStore ? 'Mode Toko Aktif' : 'Mode Penyuplai Aktif'}</Text>
                <Text style={styles.summarySubtitle}>
                  {isStore
                    ? 'Menu profil menampilkan pengaturan operasional toko dan akses tim.'
                    : isSupplier
                      ? 'Menu profil menampilkan pengaturan akun penyuplai dan bantuan kemitraan.'
                      : 'Akun ini belum memiliki tipe yang tersimpan. Silakan daftar ulang atau lengkapi data akun.'}
                </Text>
              </View>
            </View>
          </Card>
          <View style={styles.menuList}>
            {menus.map((menu) => (
              <Card key={menu.title} onPress={() => router.push(menu.href)}>
                <View style={styles.menuRow}>
                  <View style={styles.menuIcon}><Ionicons name={menu.icon} size={23} color={colors.primaryDark} /></View>
                  <View style={styles.menuBody}><Text style={styles.menuTitle}>{menu.title}</Text><Text style={styles.menuSubtitle}>{menu.subtitle}</Text></View>
                  <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
                </View>
              </Card>
            ))}
          </View>
          <Card onPress={() => setLogoutVisible(true)}>
            <View style={styles.logout}><Ionicons name="log-out-outline" size={23} color={colors.danger} /><Text style={styles.logoutText}>Keluar dari Akun</Text></View>
          </Card>
          <Text style={styles.version}>KonsinyasiKu Mobile · Expo prototype 1.0.1</Text>
        </View>
      </AppScreen>

      <Modal
        transparent
        animationType="fade"
        visible={logoutVisible}
        onRequestClose={() => setLogoutVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setLogoutVisible(false)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out-outline" size={30} color={colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Keluar dari akun?</Text>
            <Text style={styles.modalMessage}>Anda akan kembali ke halaman masuk.</Text>
            <View style={styles.modalActions}>
              <Pressable style={({ pressed }) => [styles.modalButton, styles.cancelButton, pressed && styles.pressed]} onPress={() => setLogoutVisible(false)}>
                <Text style={styles.cancelText}>Batal</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.modalButton, styles.confirmButton, pressed && styles.pressed]} onPress={handleLogout}>
                <Text style={styles.confirmText}>Keluar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 28 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  profileCard: { alignItems: 'center', paddingVertical: spacing.xxl },
  avatar: { width: 82, height: 82, borderRadius: 41, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { fontSize: 32, fontWeight: '800', color: colors.primaryDark },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  email: { color: colors.textMuted, marginTop: spacing.xs },
  role: { marginTop: spacing.md, backgroundColor: colors.primarySoft, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  roleText: { color: colors.primaryDark, fontSize: 12, fontWeight: '700' },
  summaryCard: { paddingVertical: spacing.lg },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryIcon: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  summaryBody: { flex: 1 },
  summaryTitle: { color: colors.text, fontWeight: '800' },
  summarySubtitle: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  menuList: { gap: spacing.md },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menuIcon: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  menuBody: { flex: 1 },
  menuTitle: { color: colors.text, fontWeight: '700' },
  menuSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  logoutText: { color: colors.danger, fontWeight: '700' },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: 11 },
  modalBackdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  modalCard: { width: '100%', maxWidth: 380, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  modalIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  modalMessage: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.sm },
  modalActions: { width: '100%', flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  modalButton: { flex: 1, minHeight: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  cancelButton: { backgroundColor: colors.surface, borderColor: colors.border },
  confirmButton: { backgroundColor: colors.danger, borderColor: colors.danger },
  cancelText: { color: colors.text, fontWeight: '700' },
  confirmText: { color: colors.white, fontWeight: '700' },
  pressed: { opacity: 0.72 },
});
