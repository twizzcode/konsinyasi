import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppScreen, BackButton, Card, HeroHeader, SectionTitle } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';

const faqs = [
  { q: 'Bagaimana menambahkan barang konsinyasi?', a: 'Buka menu Barang, tekan tombol tambah, pilih penitip, lalu isi harga, pembagian hasil, stok, dan kategori.' },
  { q: 'Bagaimana pembagian keuntungan dihitung?', a: 'Persentase penitip dan toko disimpan pada setiap barang. Saat transaksi dibuat, sistem menghitung bagian masing-masing berdasarkan jumlah barang terjual.' },
  { q: 'Bagaimana melihat laporan per penitip?', a: 'Buka menu Laporan, pilih Laporan per Penitip, lalu pilih nama penitip yang akan dianalisis.' },
  { q: 'Apa yang terjadi saat stok menipis?', a: 'Barang berstatus Menipis ketika stok sama dengan atau lebih kecil dari batas minimal. Status tersebut tampil pada daftar dan dashboard.' },
  { q: 'Apakah data sudah tersimpan permanen?', a: 'Belum. Versi ini adalah implementasi frontend dengan state lokal. Tambahkan API dan penyimpanan aman sebelum produksi.' },
];

export default function HelpScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Bantuan" subtitle="Panduan penggunaan dan batas implementasi" leftAction={<BackButton onPress={() => router.back()} />} />
      <View style={styles.content}>
        <Card>
          <View style={styles.helpHero}><View style={styles.helpIcon}><Ionicons name="help-circle-outline" size={34} color={colors.primaryDark} /></View><View style={styles.flex}><Text style={styles.helpTitle}>Butuh bantuan teknis?</Text><Text style={styles.helpText}>Dokumentasi migrasi tersedia di folder docs pada proyek.</Text></View></View>
        </Card>
        <SectionTitle title="Pertanyaan Umum" />
        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <Card key={faq.q}>
              <Pressable style={styles.faqHeader} onPress={() => setOpen(open === index ? null : index)}><Text style={styles.question}>{faq.q}</Text><Ionicons name={open === index ? 'chevron-up' : 'chevron-down'} size={21} color={colors.textMuted} /></Pressable>
              {open === index ? <Text style={styles.answer}>{faq.a}</Text> : null}
            </Card>
          ))}
        </View>
        <Card>
          <SectionTitle title="Informasi Aplikasi" />
          <View style={styles.infoList}><View style={styles.infoRow}><Text style={styles.infoLabel}>Versi</Text><Text style={styles.infoValue}>1.0.0</Text></View><View style={styles.infoRow}><Text style={styles.infoLabel}>Platform</Text><Text style={styles.infoValue}>Expo, Android, iOS, Web</Text></View><View style={styles.infoRow}><Text style={styles.infoLabel}>Status data</Text><Text style={styles.infoValue}>Local prototype</Text></View></View>
        </Card>
        <AppButton title="Hubungi Dukungan" variant="outline" icon="mail-outline" onPress={async () => { const url = 'mailto:support@konsinyasiku.id?subject=Bantuan%20KonsinyasiKu'; const supported = await Linking.canOpenURL(url); if (supported) await Linking.openURL(url); else showToast({ title: 'Tidak dapat membuka email', message: 'Aplikasi email belum tersedia di perangkat ini.', tone: 'info' }); }} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 36 }, content: { padding: spacing.xxl, gap: spacing.lg }, helpHero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, helpIcon: { width: 58, height: 58, borderRadius: radius.lg, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, flex: { flex: 1 }, helpTitle: { color: colors.text, fontWeight: '800', fontSize: 16 }, helpText: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 4 }, faqList: { gap: spacing.md }, faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }, question: { flex: 1, color: colors.text, fontWeight: '700', lineHeight: 21 }, answer: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }, infoList: { gap: spacing.md, marginTop: spacing.lg }, infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg }, infoLabel: { color: colors.textMuted }, infoValue: { color: colors.text, fontWeight: '700', textAlign: 'right' },
});
