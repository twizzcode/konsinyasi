import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen, BackButton, Card, EmptyState, FloatingActionButton, HeroHeader, SearchBar } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { formatRupiah } from '@/utils/format';

export default function SupplierListScreen() {
  const router = useRouter();
  const { suppliers, products } = useApp();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => suppliers.filter((item) => `${item.name} ${item.phone}`.toLowerCase().includes(search.toLowerCase())), [suppliers, search]);
  return (
    <AppScreen scroll={false} contentStyle={styles.page}>
      <HeroHeader title="Daftar Penitip" subtitle={`${suppliers.length} penitip terdaftar`} leftAction={<BackButton onPress={() => router.back()} />}><SearchBar value={search} onChangeText={setSearch} placeholder="Cari nama atau telepon..." /></HeroHeader>
      <View style={styles.body}>
        {filtered.length === 0 ? <EmptyState icon="people-outline" title="Penitip tidak ditemukan" /> : (
          <AppScreen safeTop={false} contentStyle={styles.list}>
            {filtered.map((supplier) => {
              const count = products.filter((item) => item.supplierId === supplier.id).length;
              return (
                <Card key={supplier.id} onPress={() => router.push(`/penitip/${supplier.id}`)}>
                  <View style={styles.row}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{supplier.name.charAt(0)}</Text></View>
                    <View style={styles.flex}><Text style={styles.name}>{supplier.name}</Text><Text style={styles.meta}>{supplier.phone}</Text><Text style={styles.meta}>{count} jenis barang · Saldo {formatRupiah(supplier.balance)}</Text></View>
                    <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
                  </View>
                </Card>
              );
            })}
          </AppScreen>
        )}
      </View>
      <FloatingActionButton onPress={() => router.push('/penitip/tambah')} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({ page: { flex: 1 }, body: { flex: 1 }, list: { padding: spacing.xxl, gap: spacing.md, paddingBottom: 100 }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, avatar: { width: 52, height: 52, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.primaryDark, fontWeight: '800', fontSize: 20 }, flex: { flex: 1 }, name: { color: colors.text, fontWeight: '800', fontSize: 16 }, meta: { color: colors.textMuted, fontSize: 12, marginTop: 3 } });
