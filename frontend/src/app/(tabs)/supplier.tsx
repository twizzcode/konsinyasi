import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppButton, AppScreen, Card, EmptyState, HeroHeader, SearchBar, SectionTitle } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiGet, apiPost } from '@/lib/api';
import type { AuthUserProfile, LinkedStore, LinkedSupplier, SupplierSearchResult } from '@/types/auth';

export default function SupplierTabScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const isStore = profile.accountType === 'store';
  const isSupplier = profile.accountType === 'supplier';
  const storeUserId = profile.id ?? '';
  const supplierUserId = profile.id ?? '';

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [linkedSuppliers, setLinkedSuppliers] = useState<LinkedSupplier[]>([]);
  const [linkedStores, setLinkedStores] = useState<LinkedStore[]>([]);
  const [searchResults, setSearchResults] = useState<SupplierSearchResult[]>([]);

  const canSearch = search.trim().length >= 2 && isStore && Boolean(storeUserId);

  const loadLinkedSuppliers = async () => {
    if (!storeUserId || !isStore) {
      return;
    }

    const response = await apiGet<{ data: LinkedSupplier[] }>(`/api/stores/${storeUserId}/suppliers`);
    setLinkedSuppliers(response.data);
  };

  const loadLinkedStores = async () => {
    if (!supplierUserId || !isSupplier) {
      return;
    }

    const response = await apiGet<{ data: LinkedStore[] }>(`/api/suppliers/${supplierUserId}/stores`);
    setLinkedStores(response.data);
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      try {
        if (isStore) {
          await loadLinkedSuppliers();
        } else if (isSupplier) {
          await loadLinkedStores();
        } else {
          setLinkedSuppliers([]);
          setLinkedStores([]);
        }
      } catch {
        if (active) {
          setLinkedSuppliers([]);
          setLinkedStores([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [storeUserId, supplierUserId, isStore, isSupplier]);

  useEffect(() => {
    if (!canSearch) {
      setSearchResults([]);
      return;
    }

    let active = true;

    const run = async () => {
      setSearching(true);
      try {
        const response = await apiGet<{ data: SupplierSearchResult[] }>(
          `/api/suppliers/search?q=${encodeURIComponent(search.trim())}&storeUserId=${encodeURIComponent(storeUserId)}`,
        );
        if (active) setSearchResults(response.data);
      } catch {
        if (active) setSearchResults([]);
      } finally {
        if (active) setSearching(false);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [canSearch, search, storeUserId]);

  const addSupplier = async (supplierUserId: string) => {
    if (!storeUserId) return;

    setAddingId(supplierUserId);

    try {
      await apiPost(`/api/stores/${storeUserId}/suppliers`, { supplierUserId });
      await loadLinkedSuppliers();
      setSearchResults((current) => current.map((item) => item.id === supplierUserId ? { ...item, linked: true } : item));
      showToast({ title: 'Supplier ditambahkan', message: 'Supplier sudah terhubung ke toko.', tone: 'success' });
    } catch (error) {
      showToast({ title: 'Gagal menambahkan supplier', message: error instanceof Error ? error.message : 'Terjadi kesalahan.', tone: 'error' });
    } finally {
      setAddingId(null);
    }
  };

  const linkedIds = useMemo(() => new Set(linkedSuppliers.map((item) => item.supplierUserId)), [linkedSuppliers]);

  if (!isStore && !isSupplier) {
    return (
      <AppScreen contentStyle={styles.page}>
        <HeroHeader title="Kemitraan" subtitle="Menu ini hanya tersedia untuk akun toko atau supplier" />
        <View style={styles.content}>
          <EmptyState icon="lock-closed-outline" title="Akses tidak tersedia" description="Masuk dengan akun yang sudah memiliki tipe toko atau supplier." />
        </View>
      </AppScreen>
    );
  }

  if (isSupplier) {
    return (
      <AppScreen scroll={false} contentStyle={styles.page}>
        <HeroHeader title="Toko" subtitle={`${linkedStores.length} toko menjadikan Anda sebagai supplier`} />
        <View style={styles.content}>
          <SectionTitle title="Toko Terhubung" />
          {loading ? (
            <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
          ) : linkedStores.length === 0 ? (
            <EmptyState icon="storefront-outline" title="Belum terhubung ke toko" description="Daftar toko akan muncul di sini setelah ada toko yang menambahkan akun Anda sebagai supplier." />
          ) : (
            <View style={styles.list}>
              {linkedStores.map((store) => (
                <Card
                  key={store.linkId}
                  onPress={() => router.push({
                    pathname: '/toko/[storeUserId]',
                    params: {
                      storeUserId: store.storeUserId,
                      name: store.name,
                      businessName: store.businessName,
                      email: store.email,
                    },
                  })}
                >
                  <View style={styles.row}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{(store.businessName ?? store.name).charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.body}>
                      <Text style={styles.name}>{store.businessName ?? store.name}</Text>
                      <Text style={styles.meta}>{store.name}</Text>
                      <Text style={styles.meta}>{store.email}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll={false} contentStyle={styles.page}>
      <HeroHeader title="Supplier" subtitle={`${linkedSuppliers.length} supplier terhubung ke toko`}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Cari nama, bisnis, atau email supplier..." />
      </HeroHeader>

      <View style={styles.content}>
        <SectionTitle title="Supplier Toko" />
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
        ) : linkedSuppliers.length === 0 ? (
          <EmptyState icon="people-outline" title="Belum ada supplier" description="Cari akun supplier yang sudah terdaftar lalu tambahkan ke toko Anda." />
        ) : (
          <View style={styles.list}>
            {linkedSuppliers.map((supplier) => (
              <Card
                key={supplier.linkId}
                onPress={() => router.push({
                  pathname: '/supplier/[supplierUserId]',
                  params: {
                    supplierUserId: supplier.supplierUserId,
                    name: supplier.name,
                    businessName: supplier.businessName,
                    email: supplier.email,
                  },
                })}
              >
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{(supplier.businessName ?? supplier.name).charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.name}>{supplier.businessName ?? supplier.name}</Text>
                    <Text style={styles.meta}>{supplier.name}</Text>
                    <Text style={styles.meta}>{supplier.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
              </Card>
            ))}
          </View>
        )}

        <SectionTitle title="Cari Supplier Terdaftar" />
        {!canSearch ? (
          <EmptyState icon="search-outline" title="Mulai pencarian" description="Ketik minimal 2 karakter untuk mencari akun supplier yang sudah terdaftar." />
        ) : searching ? (
          <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
        ) : searchResults.length === 0 ? (
          <EmptyState icon="close-circle-outline" title="Supplier tidak ditemukan" description="Supplier harus sudah punya akun terlebih dahulu sebelum bisa ditambahkan." />
        ) : (
          <View style={styles.list}>
            {searchResults.map((supplier) => {
              const alreadyLinked = supplier.linked || linkedIds.has(supplier.id);

              return (
                <Card key={supplier.id}>
                  <View style={styles.searchRow}>
                    <View style={styles.body}>
                      <Text style={styles.name}>{supplier.businessName ?? supplier.name}</Text>
                      <Text style={styles.meta}>{supplier.name}</Text>
                      <Text style={styles.meta}>{supplier.email}</Text>
                    </View>
                    {alreadyLinked ? (
                      <View style={styles.addedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color={colors.primaryDark} />
                        <Text style={styles.addedText}>Sudah Ditambah</Text>
                      </View>
                    ) : (
                      <AppButton
                        title=""
                        icon="add"
                        onPress={() => addSupplier(supplier.id)}
                        loading={addingId === supplier.id}
                        fullWidth={false}
                        style={styles.addButton}
                      />
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingBottom: 24 },
  content: { flex: 1, padding: spacing.xxl, gap: spacing.lg },
  center: { paddingVertical: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
  list: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primaryDark, fontSize: 18, fontWeight: '800' },
  body: { flex: 1 },
  name: { color: colors.text, fontWeight: '800', fontSize: 15 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  addButton: { minWidth: 48, paddingHorizontal: 0 },
  addedBadge: { alignItems: 'center', gap: 4 },
  addedText: { color: colors.primaryDark, fontSize: 11, fontWeight: '700' },
});
