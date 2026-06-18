import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppButton, AppInput, AppScreen, BackButton, Card, HeroHeader } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiGet, apiPost } from '@/lib/api';
import type { AuthUserProfile, SupplierBalanceSummary } from '@/types/auth';
import { formatRupiah } from '@/utils/format';

export default function SupplierPayoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = (user ?? {}) as AuthUserProfile;
  const params = useLocalSearchParams<{
    supplierUserId: string;
    name?: string;
    businessName?: string;
    email?: string;
    availableBalance?: string;
  }>();

  const supplierTitle = params.businessName || params.name || 'Supplier';
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(Number(params.availableBalance ?? 0));

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!profile.id || !params.supplierUserId) return;

      try {
        const response = await apiGet<{ data: SupplierBalanceSummary }>(`/api/stores/${profile.id}/suppliers/${params.supplierUserId}/balance`);
        if (active) {
          setAvailableBalance(response.data.availableBalance);
        }
      } catch {
        if (active) {
          setAvailableBalance(Number(params.availableBalance ?? 0));
        }
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [params.availableBalance, params.supplierUserId, profile.id]);

  const fillMax = () => setAmount(String(availableBalance));

  const save = async () => {
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      showToast({ title: 'Nominal tidak valid', message: 'Masukkan nominal ambil uang yang lebih dari 0.', tone: 'error' });
      return;
    }

    if (parsedAmount > availableBalance) {
      showToast({ title: 'Saldo tidak cukup', message: 'Nominal melebihi saldo supplier yang tersedia.', tone: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await apiPost(`/api/stores/${profile.id}/suppliers/${params.supplierUserId}/payouts`, {
        amount: parsedAmount,
        note,
      });
      showToast({ title: 'Ambil uang berhasil', message: 'Pencairan uang supplier sudah disimpan.', tone: 'success' });
      router.back();
    } catch (error) {
      showToast({ title: 'Gagal mengambil uang', message: error instanceof Error ? error.message : 'Terjadi kesalahan.', tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Ambil Uang Supplier" subtitle={supplierTitle} leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <Card>
          <Text style={styles.cardLabel}>Saldo siap diambil</Text>
          <Text style={styles.balance}>{formatRupiah(availableBalance)}</Text>
          <Text style={styles.cardMeta}>Dana ini dihitung dari hasil penjualan supplier dikurangi payout yang sudah pernah dicairkan.</Text>
        </Card>

        <AppInput
          label="Nominal Ambil Uang"
          value={amount}
          onChangeText={setAmount}
          placeholder="50000"
          keyboardType="decimal-pad"
          icon="cash-outline"
        />
        <Text style={styles.maxLink} onPress={fillMax}>Gunakan saldo penuh</Text>
        <AppInput
          label="Catatan"
          value={note}
          onChangeText={setNote}
          placeholder="Contoh: diambil tunai hari ini"
          icon="document-text-outline"
          multiline
        />
        <AppButton title="Simpan Pencairan" icon="wallet-outline" onPress={save} loading={submitting} disabled={availableBalance <= 0} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 },
  content: { padding: spacing.xxl, gap: spacing.lg },
  cardLabel: { color: colors.textMuted, fontSize: 13 },
  balance: { color: colors.primaryDark, fontSize: 28, fontWeight: '800', marginTop: spacing.sm },
  cardMeta: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  maxLink: { color: colors.primaryDark, fontSize: 13, fontWeight: '700', marginTop: -4 },
});
