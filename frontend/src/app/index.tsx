import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { loading, ready, session } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (ready && session) {
        router.replace('/(tabs)/home');
        return;
      }

      router.replace('/onboarding');
    }, 1400);

    return () => clearTimeout(timer);
  }, [loading, ready, router, session]);

  return (
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.container}>
      <View style={styles.logoBox}><Ionicons name="bag-handle" size={72} color={colors.white} /></View>
      <Text style={styles.title}>KonsinyasiKu</Text>
      <Text style={styles.subtitle}>Kelola titip jual jadi lebih mudah</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  logoBox: { width: 132, height: 132, borderRadius: radius.xl, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxl },
  title: { color: colors.white, fontSize: 38, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 16, marginTop: spacing.sm },
});
