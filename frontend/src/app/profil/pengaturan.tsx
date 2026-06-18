import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppInput, AppScreen, BackButton, Card, HeroHeader, SectionTitle } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { authClient } from '@/lib/auth-client';
import { apiPut } from '@/lib/api';
import { removeStorageFileByPublicUrl, uploadImageAsset } from '@/lib/storage';
import type { AuthUserProfile } from '@/types/auth';

type ChangePasswordFn = (payload: {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}) => Promise<{ error?: { message?: string } | null }>;

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const isStore = profile.accountType === 'store';

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [savingProfile, setSavingProfile] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setName(profile.name ?? '');
    setBusinessName(profile.businessName ?? '');
    setEmail(profile.email ?? '');
    setImageUri(profile.image ?? undefined);
  }, [profile.businessName, profile.email, profile.image, profile.name]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast({ title: 'Izin diperlukan', message: 'Akses galeri diperlukan untuk memilih foto profil.', tone: 'error' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.75,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => setImageUri(undefined);

  const saveProfile = async () => {
    if (!profile.id) {
      showToast({ title: 'Akun tidak ditemukan', message: 'Silakan masuk ulang lalu coba lagi.', tone: 'error' });
      return;
    }

    if (!name.trim() || !businessName.trim()) {
      showToast({ title: 'Data belum lengkap', message: 'Nama dan nama usaha wajib diisi.', tone: 'error' });
      return;
    }

    setSavingProfile(true);
    try {
      let image: string | null = profile.image ?? null;

      if (!imageUri) {
        if (profile.image) {
          await removeStorageFileByPublicUrl(profile.image).catch(() => {});
        }
        image = null;
      } else if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
        image = imageUri;
      } else {
        if (profile.image) {
          await removeStorageFileByPublicUrl(profile.image).catch(() => {});
        }
        const uploaded = await uploadImageAsset({
          fileUri: imageUri,
          folder: `profiles/${profile.id}`,
          fileName: `${profile.id}-${Date.now()}.jpg`,
          upsert: true,
        });
        image = uploaded.publicUrl;
      }

      await apiPut(`/api/users/${profile.id}/profile`, {
        name: name.trim(),
        businessName: businessName.trim(),
        image,
      });
      await refreshSession();
      showToast({ title: 'Profil diperbarui', message: 'Informasi akun berhasil disimpan.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Gagal menyimpan profil', message: error instanceof Error ? error.message : 'Terjadi kesalahan.', tone: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast({ title: 'Data belum lengkap', message: 'Isi kata sandi lama, baru, dan konfirmasi.', tone: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({ title: 'Kata sandi tidak cocok', message: 'Konfirmasi kata sandi baru berbeda.', tone: 'error' });
      return;
    }

    if (newPassword.length < 8) {
      showToast({ title: 'Kata sandi terlalu pendek', message: 'Gunakan minimal 8 karakter.', tone: 'error' });
      return;
    }

    const changePassword = (authClient as unknown as { changePassword?: ChangePasswordFn }).changePassword;

    if (!changePassword) {
      showToast({ title: 'Fitur belum tersedia', message: 'Method ganti password belum tersedia pada auth client project ini.', tone: 'info' });
      return;
    }

    setSavingPassword(true);
    try {
      const result = await changePassword({
        currentPassword: oldPassword,
        newPassword,
        revokeOtherSessions: false,
      });

      if (result?.error) {
        showToast({ title: 'Gagal ganti password', message: result.error.message ?? 'Terjadi kesalahan saat mengganti password.', tone: 'error' });
        return;
      }

      showToast({ title: 'Password diperbarui', message: 'Kata sandi akun berhasil diganti.', tone: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showToast({ title: 'Gagal ganti password', message: error instanceof Error ? error.message : 'Terjadi kesalahan.', tone: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Pengaturan Akun" subtitle="Perbarui identitas akun dan keamanan login" leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <Card>
          <SectionTitle title="Informasi Profil" />
          <View style={styles.form}>
            <View style={styles.photoSection}>
              <Text style={styles.photoLabel}>Foto Profil</Text>
              <Pressable style={styles.photoBox} onPress={pickImage}>
                {imageUri ? (
                  <>
                    <Image source={{ uri: imageUri }} style={styles.photo} />
                    <Pressable style={styles.removePhotoButton} onPress={removeImage} hitSlop={10}>
                      <Ionicons name="close" size={18} color={colors.white} />
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={32} color={colors.textMuted} />
                    <Text style={styles.photoText}>Pilih foto profil</Text>
                  </>
                )}
              </Pressable>
            </View>
            <AppInput
              label={isStore ? 'Nama Pemilik' : 'Nama PIC'}
              value={name}
              onChangeText={setName}
              icon="person-outline"
            />
            <AppInput
              label={isStore ? 'Nama Toko' : 'Nama Penyuplai'}
              value={businessName}
              onChangeText={setBusinessName}
              icon={isStore ? 'storefront-outline' : 'briefcase-outline'}
            />
            <AppInput
              label="Email"
              value={email}
              editable={false}
              icon="mail-outline"
            />
            <Text style={styles.note}>Email saat ini hanya ditampilkan sebagai informasi dan belum bisa diubah dari aplikasi.</Text>
            <AppButton title="Simpan Profil" icon="save-outline" onPress={saveProfile} loading={savingProfile} />
          </View>
        </Card>

        <Card>
          <SectionTitle title="Ubah Kata Sandi" />
          <View style={styles.form}>
            <AppInput label="Kata Sandi Lama" value={oldPassword} onChangeText={setOldPassword} secureTextEntry icon="lock-closed-outline" />
            <AppInput label="Kata Sandi Baru" value={newPassword} onChangeText={setNewPassword} secureTextEntry icon="key-outline" />
            <AppInput label="Konfirmasi Kata Sandi" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry icon="shield-checkmark-outline" />
            <AppButton title="Perbarui Kata Sandi" variant="outline" onPress={updatePassword} loading={savingPassword} />
          </View>
        </Card>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  form: { gap: spacing.lg, marginTop: spacing.lg },
  note: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: -4 },
  photoSection: { gap: spacing.sm },
  photoLabel: { color: colors.text, fontSize: 14, fontWeight: '600' },
  photoBox: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.input,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: spacing.xs,
  },
  photo: { width: '100%', height: '100%' },
  photoText: { color: colors.textMuted, fontSize: 12 },
  removePhotoButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(17,24,39,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
