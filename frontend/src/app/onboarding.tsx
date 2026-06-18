import { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppScreen } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const slides = [
  { icon: 'cube-outline' as const, title: 'Kelola Barang Titipan', description: 'Catat barang, stok, penitip, harga jual, dan pembagian keuntungan dalam satu aplikasi.' },
  { icon: 'receipt-outline' as const, title: 'Transaksi Lebih Cepat', description: 'Buat transaksi penjualan dan hitung bagian penitip serta keuntungan toko secara otomatis.' },
  { icon: 'bar-chart-outline' as const, title: 'Laporan Lebih Jelas', description: 'Pantau penjualan, stok, dan laporan per penitip untuk mendukung keputusan usaha.' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  useEffect(() => {
    if (session) {
      router.replace('/home');
    }
  }, [router, session]);

  return (
    <AppScreen scroll={false} contentStyle={styles.page}>
      <View style={styles.topRow}>
        <Text style={styles.brand}>KonsinyasiKu</Text>
        {!isLast ? <Pressable onPress={() => router.replace('/login')}><Text style={styles.skip}>Lewati</Text></Pressable> : <View />}
      </View>
      <View style={styles.content}>
        <View style={styles.illustration}><Ionicons name={slide.icon} size={100} color={colors.primary} /></View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
        <View style={styles.dots}>
          {slides.map((_, dot) => <View key={dot} style={[styles.dot, dot === index && styles.dotActive]} />)}
        </View>
      </View>
      <AppButton title={isLast ? 'Mulai Sekarang' : 'Lanjut'} icon={isLast ? 'arrow-forward-circle-outline' : 'arrow-forward-outline'} onPress={() => isLast ? router.replace('/login') : setIndex((value) => value + 1)} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing.xxl, paddingBottom: 36 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 18, fontWeight: '800', color: colors.primaryDark },
  skip: { color: colors.textMuted, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration: { width: Math.min(Dimensions.get('window').width - 48, 330), height: 280, borderRadius: radius.xl, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 34 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, textAlign: 'center' },
  description: { fontSize: 15, lineHeight: 23, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, maxWidth: 330 },
  dots: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xxl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 26, backgroundColor: colors.primary },
});
