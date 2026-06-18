import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppInput, AppScreen, BackButton, Badge, Card, HeroHeader, SelectField } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import type { UserRole } from '@/types';

export default function UserManagementScreen() {
  const router = useRouter();
  const { users, addUser, removeUser } = useApp();
  const { showToast } = useToast();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Kasir');

  const save = () => {
    if (!name.trim() || !email.trim()) {
      showToast({ title: 'Data belum lengkap', message: 'Nama dan email wajib diisi.', tone: 'error' });
      return;
    }
    addUser({ name: name.trim(), email: email.trim(), role });
    setName(''); setEmail(''); setRole('Kasir'); setVisible(false);
    showToast({ title: 'User ditambahkan', message: 'Akses user baru berhasil disimpan.', tone: 'success' });
  };

  const confirmRemove = (id: string, userName: string) => Alert.alert('Hapus user', `Hapus akses ${userName}?`, [{ text: 'Batal', style: 'cancel' }, { text: 'Hapus', style: 'destructive', onPress: () => removeUser(id) }]);

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Kelola User/Admin" subtitle={`${users.length} akun memiliki akses`} leftAction={<BackButton onPress={() => router.back()} />} rightAction={<Pressable style={styles.addHeader} onPress={() => setVisible(true)}><Ionicons name="person-add-outline" size={20} color={colors.white} /></Pressable>} />
      <View style={styles.content}>
        {users.map((user) => (
          <Card key={user.id}>
            <View style={styles.row}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{user.name.charAt(0)}</Text></View>
              <View style={styles.flex}><View style={styles.nameRow}><Text style={styles.name}>{user.name}</Text><Badge label={user.role} tone={user.role === 'Pemilik' ? 'success' : user.role === 'Admin' ? 'info' : 'neutral'} /></View><Text style={styles.email}>{user.email}</Text><Text style={styles.status}>{user.active ? 'Aktif' : 'Nonaktif'}</Text></View>
              {user.role !== 'Pemilik' ? <Pressable onPress={() => confirmRemove(user.id, user.name)} hitSlop={10}><Ionicons name="trash-outline" size={21} color={colors.danger} /></Pressable> : null}
            </View>
          </Card>
        ))}
        <AppButton title="Tambah User" icon="person-add-outline" onPress={() => setVisible(true)} />
      </View>

      <Modal transparent animationType="slide" visible={visible} onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Tambah User Baru</Text><Pressable onPress={() => setVisible(false)}><Ionicons name="close" size={25} color={colors.text} /></Pressable></View>
            <View style={styles.form}>
              <AppInput label="Nama" value={name} onChangeText={setName} placeholder="Nama user" icon="person-outline" />
              <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="user@email.com" keyboardType="email-address" autoCapitalize="none" icon="mail-outline" />
              <SelectField label="Role" value={role} onChange={(value) => setRole(value as UserRole)} options={[{ label: 'Admin', value: 'Admin', description: 'Akses manajemen, tanpa pengaturan pemilik' }, { label: 'Kasir', value: 'Kasir', description: 'Fokus pada transaksi penjualan' }]} />
              <AppButton title="Simpan User" icon="save-outline" onPress={save} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 }, addHeader: { width: 42, height: 42, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }, content: { padding: spacing.xxl, gap: spacing.md }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, avatar: { width: 52, height: 52, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.primaryDark, fontWeight: '800', fontSize: 20 }, flex: { flex: 1 }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, name: { color: colors.text, fontWeight: '800' }, email: { color: colors.textMuted, fontSize: 12, marginTop: 4 }, status: { color: colors.primaryDark, fontSize: 11, fontWeight: '700', marginTop: 4 }, backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }, sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xxl, paddingBottom: 36 }, sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sheetTitle: { color: colors.text, fontSize: 22, fontWeight: '800' }, form: { gap: spacing.lg, marginTop: spacing.xl },
});
